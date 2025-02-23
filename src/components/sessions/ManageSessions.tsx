import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import SessionsTable from "@/components/dashboard/SessionsTable";
import AttendanceDialog from "@/components/dashboard/AttendanceDialog";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useTheme } from "@/contexts/ThemeContext";
import {
  fetchSessionAttendance,
  SessionData,
  formatDateTime,
  AttendanceData,
} from "@/lib/firebase-utils";

const ManageSessions = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(
    null,
  );
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [sortField, setSortField] = useState<string>("start_time");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedAndFilteredSessions = useMemo(() => {
    if (!sessions) return [];
    let filtered = [...sessions];

    return filtered.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [sessions, sortField, sortDirection]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    const loadSessions = async () => {
      if (user) {
        if (localStorage.getItem("userRole") === "student") {
          const lecturesRef = collection(db, "lectures");
          const querySnapshot = await getDocs(lecturesRef);
          const allSessions: SessionData[] = [];
          const studentRfid = localStorage.getItem("studentRfid");

          for (const doc of querySnapshot.docs) {
            const sessionId = doc.id;
            const data = doc.data();
            const attendance = await fetchSessionAttendance(sessionId);
            const studentAttendance = attendance.find(
              (a) => a.rfid_id === studentRfid,
            );

            allSessions.push({
              course_code: data.course_code || sessionId.split("_")[0],
              course_name: data.course_name || "Course",
              lecturer_name: data.lecturer_name || "Lecturer",
              start_time: data.start_time ||
                sessionId.split("_").slice(1).join("_").replace(/_/g, ""),
              status: data.status || "completed",
              session_id: sessionId,
              attendance: studentAttendance,
              lecturer_rfid: ""
            });
          }

          const sortedSessions = allSessions.sort(
            (a, b) =>
              new Date(b.start_time).getTime() -
              new Date(a.start_time).getTime(),
          );

          setSessions(sortedSessions);
        } else {
          const courseCode = localStorage.getItem("courseCode");
          if (courseCode) {
            const lecturesRef = collection(db, "lectures");
            const querySnapshot = await getDocs(lecturesRef);
            const teacherSessions: SessionData[] = [];

            querySnapshot.forEach((doc) => {
              const sessionId = doc.id;
              const sessionCourseCode = sessionId.split("_")[0];
              const data = doc.data();

              if (sessionCourseCode === courseCode) {
                teacherSessions.push({
                  course_code: data.course_code || sessionCourseCode,
                  course_name: data.course_name || "Course",
                  lecturer_name: data.lecturer_name || "Lecturer",
                  lecturer_rfid: data.lecturer_rfid || "",
                  start_time: data.start_time ||
                    sessionId.split("_").slice(1).join("_").replace(/_/g, ""),
                  status: data.status || "completed",
                  session_id: sessionId,
                  attendance: undefined
                });
              }
            });

            setSessions(
              teacherSessions.sort(
                (a, b) =>
                  new Date(b.start_time).getTime() -
                  new Date(a.start_time).getTime(),
              ),
            );
          }
        }
        setLoading(false);
      }
    };

    loadSessions();
  }, [user]);

  if (loading) {
    return (
      <div
        className={`flex h-screen ${theme === "light" ? "bg-white" : "bg-[#020817]"}`}
      >
        <Sidebar
          userRole={localStorage.getItem("userRole") as "student" | "lecturer"}
          userName={user?.displayName || "User"}
          userEmail={user?.email || ""}
          userImage={"/blank-user.jpg"}
        />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-center h-full">
            <p
              className={`text-lg ${theme === "light" ? "text-gray-500" : "text-white/60"}`}
            >
              Loading sessions...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`flex h-screen ${theme === "light" ? "bg-white" : "bg-[#020817]"}`}
    >
      <Sidebar
        userRole={localStorage.getItem("userRole") as "student" | "lecturer"}
        userName={user?.displayName || "User"}
        userEmail={user?.email || ""}
        userImage={"/blank-user.jpg"}
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-6">
            <div>
              <h1
                className={`text-3xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                {localStorage.getItem("userRole") === "lecturer"
                  ? "Manage Sessions"
                  : "All Sessions"}
              </h1>
              <p
                className={`mt-2 ${theme === "light" ? "text-gray-500" : "text-white/60"}`}
              >
                {localStorage.getItem("userRole") === "lecturer"
                  ? "Create and manage your course sessions"
                  : "View all your session attendance"}
              </p>
            </div>
          </div>

          <SessionsTable
            isLecturer={localStorage.getItem("userRole") === "lecturer"}
            sessions={sortedAndFilteredSessions.map((s) => ({
              id: s.session_id!,
              courseCode: s.course_code,
              courseName: s.course_name,
              lecturerName: s.lecturer_name,
              dateTime: formatDateTime(s.start_time).full,
              status: s.status.toLowerCase(),
              attendance: s.attendance
                ? {
                    status:
                      s.attendance.status === "partial"
                        ? "partial"
                        : s.attendance.status,
                    time: s.attendance.time,
                  }
                : {
                    status: "absent",
                    time: "",
                  },
            }))}
            onViewDetails={async (sessionId) => {
              const session = sessions.find((s) => s.session_id === sessionId);
              if (session) {
                setSelectedSession(session);
                const attendance = await fetchSessionAttendance(sessionId);
                setAttendanceData(attendance);
                setShowAttendance(true);
              }
            }}
          />

          {showAttendance && selectedSession && (
            <AttendanceDialog
              open={showAttendance}
              onOpenChange={setShowAttendance}
              attendanceData={attendanceData}
              sessionDate={formatDateTime(selectedSession.start_time).full}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageSessions;
