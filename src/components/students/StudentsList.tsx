import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Sidebar from "@/components/layout/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";

interface Student {
  name: string;
  rfid_id: string;
  enrollment_no?: string;
  email?: string;
  attendancePercentage?: number;
}

export default function StudentsList() {
  const { theme } = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const courseCode = localStorage.getItem("courseCode");
        if (!courseCode) return;

        // Get all student users
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "student"));
        const querySnapshot = await getDocs(q);
        const studentsList: Student[] = [];

        // Get all lectures for this course
        const lecturesRef = collection(db, "lectures");
        const lecturesSnapshot = await getDocs(lecturesRef);
        const courseLectures = lecturesSnapshot.docs.filter((doc) =>
          doc.id.startsWith(courseCode + "_"),
        );

        // Process each student
        for (const userDoc of querySnapshot.docs) {
          const userData = userDoc.data();
          let totalSessions = courseLectures.length;
          let presentSessions = 0;

          // Check each lecture for attendance
          for (const lectureDoc of courseLectures) {
            const attendanceRef = collection(
              db,
              `lectures/${lectureDoc.id}/attendance`,
            );
            const attendanceSnapshot = await getDocs(attendanceRef);

            // Check if student was present
            const attendanceDoc = attendanceSnapshot.docs.find(
              (doc) => doc.data().rfid_id === userData.rfid_id,
            );

            if (
              attendanceDoc &&
              attendanceDoc.data().status.toLowerCase() === "present"
            ) {
              presentSessions++;
            } else {
              // If student wasn't in attendance or was marked absent, mark them as absent
              const attendanceRef = collection(
                db,
                `lectures/${lectureDoc.id}/attendance`,
              );
              const absentRef = doc(attendanceRef, userData.rfid_id);
              await setDoc(absentRef, {
                rfid_id: userData.rfid_id,
                name: userData.name,
                status: "absent",
                time: new Date(
                  lectureDoc.data().start_time,
                ).toLocaleTimeString(),
                date: new Date(
                  lectureDoc.data().start_time,
                ).toLocaleDateString(),
                unique_id: `${userData.rfid_id}_${lectureDoc.id}`,
              });
            }
          }

          studentsList.push({
            name: userData.name,
            rfid_id: userData.rfid_id,
            enrollment_no: userData.enrollment_no,
            email: userData.email,
            attendancePercentage:
              totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 0,
          });
        }

        // Sort by name
        studentsList.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(studentsList);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className={`flex h-screen ${theme === "light" ? "bg-white" : "bg-[#020817]"}`}
    >
      <Sidebar
        userRole="lecturer"
        userName={auth.currentUser?.displayName || "User"}
        userEmail={auth.currentUser?.email || ""}
        userImage={"/blank-user.jpg"}
      />
      <main className="flex-1 overflow-y-auto p-8">
        <Card
          className={`w-full p-6 ${theme === "light" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-2xl font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
            >
              Students
            </h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className={
                      theme === "light" ? "text-gray-900" : "text-white"
                    }
                  >
                    Name
                  </TableHead>
                  <TableHead
                    className={
                      theme === "light" ? "text-gray-900" : "text-white"
                    }
                  >
                    RFID
                  </TableHead>
                  <TableHead
                    className={
                      theme === "light" ? "text-gray-900" : "text-white"
                    }
                  >
                    Enrollment No
                  </TableHead>
                  <TableHead
                    className={
                      theme === "light" ? "text-gray-900" : "text-white"
                    }
                  >
                    Email
                  </TableHead>
                  <TableHead
                    className={
                      theme === "light" ? "text-gray-900" : "text-white"
                    }
                  >
                    Attendance %
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow
                    key={index}
                    className={
                      theme === "light"
                        ? "hover:bg-gray-50"
                        : "hover:bg-white/5"
                    }
                  >
                    <TableCell
                      className={
                        theme === "light" ? "text-gray-900" : "text-white"
                      }
                    >
                      {student.name}
                    </TableCell>
                    <TableCell
                      className={
                        theme === "light" ? "text-gray-900" : "text-white"
                      }
                    >
                      {student.rfid_id}
                    </TableCell>
                    <TableCell
                      className={
                        theme === "light" ? "text-gray-900" : "text-white"
                      }
                    >
                      {student.enrollment_no || "N/A"}
                    </TableCell>
                    <TableCell
                      className={
                        theme === "light" ? "text-gray-900" : "text-white"
                      }
                    >
                      {student.email || "N/A"}
                    </TableCell>
                    <TableCell
                      className={`font-medium ${student.attendancePercentage && student.attendancePercentage >= 75 ? "text-green-400" : "text-red-400"}`}
                    >
                      {student.attendancePercentage?.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
