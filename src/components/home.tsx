import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import StatsGrid from "./dashboard/StatsGrid";
import CourseDetails from "./dashboard/CourseDetails";
import SessionsTable from "./dashboard/SessionsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import AttendanceDialog from "./dashboard/AttendanceDialog";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  fetchTeacherSessions,
  fetchSessionAttendance,
  SessionData,
  formatDateTime,
} from "@/lib/firebase-utils";

const Home = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latestSession, setLatestSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);

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
          if (sortedSessions.length > 0) {
            setLatestSession(sortedSessions[0]);
            const attendance = await fetchSessionAttendance(
              sortedSessions[0].session_id!,
            );
            setAttendanceData(attendance);
          }
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
                  course_name: data.course_name || "CSP",
                  lecturer_name: data.lecturer_name || user?.displayName || "Lecturer",
                  lecturer_rfid: data.lecturer_rfid || "",
                  start_time: data.start_time ||
                    sessionId.split("_").slice(1).join("_").replace(/_/g, ""),
                  status: data.status || "completed",
                  session_id: sessionId,
                  attendance: undefined
                });
              }
            });

            const sortedSessions = teacherSessions.sort(
              (a, b) =>
                new Date(b.start_time).getTime() -
                new Date(a.start_time).getTime(),
            );
            setSessions(sortedSessions);

            if (sortedSessions.length > 0) {
              const latest = sortedSessions[0];
              setLatestSession(latest);
              const attendance = await fetchSessionAttendance(
                latest.session_id!,
              );
              setAttendanceData(attendance);
            }
          }
        }
        setLoading(false);
      }
    };

    loadSessions();
  }, [user]);

  if (!user || loading) {
    return null;
  }

  const courseCode = localStorage.getItem("courseCode") || "";

  return (
    <div
      className={`flex flex-col md:flex-row h-screen ${theme === "light" ? "bg-gray-50" : "bg-[#020817]"}`}
    >
      <Sidebar
        userRole={localStorage.getItem("userRole") as "student" | "lecturer"}
        userName={user.displayName || "User"}
        userEmail={user.email || ""}
        userImage={"/blank-user.jpg"}
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
            >
              Dashboard
            </h1>
            <p
              className={`mt-2 text-sm md:text-base ${theme === "light" ? "text-gray-500" : "text-white/60"}`}
            >
              Welcome back, {user.displayName?.split(" ")[0] || "User"}
            </p>
          </div>

          {localStorage.getItem("userRole") === "lecturer" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CourseDetails
                courseCode={courseCode}
                courseName={latestSession?.course_name || "Loading..."}
                lecturerName={
                  latestSession?.lecturer_name || user.displayName || ""
                }
              />

              {latestSession && (
                <Card
                  className={`w-full shadow-sm rounded-lg overflow-hidden h-auto md:h-[450px] ${theme === "light" ? "bg-white border border-gray-200" : "bg-[#0A0A1B] border-[#1E1E2D]"}`}
                >
                  <CardHeader
                    className={`border-b py-4 ${theme === "light" ? "border-gray-200" : "border-[#1E1E2D]"}`}
                  >
                    <CardTitle
                      className={`text-lg md:text-xl ${theme === "light" ? "text-gray-900" : "text-white"}`}
                    >
                      Latest Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
                    <div className="grid gap-4">
                      <div
                        className={`flex justify-between p-3 rounded-lg text-sm md:text-base ${theme === "light" ? "bg-gray-50" : "bg-[#1E1E2D]"}`}
                      >
                        <span
                          className={
                            theme === "light"
                              ? "text-gray-500"
                              : "text-white/60"
                          }
                        >
                          Date:
                        </span>
                        <span
                          className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          {formatDateTime(latestSession.start_time).date}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between p-3 rounded-lg text-sm md:text-base ${theme === "light" ? "bg-gray-50" : "bg-[#1E1E2D]"}`}
                      >
                        <span
                          className={
                            theme === "light"
                              ? "text-gray-500"
                              : "text-white/60"
                          }
                        >
                          Time:
                        </span>
                        <span
                          className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          {formatDateTime(latestSession.start_time).time}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between p-3 rounded-lg text-sm md:text-base ${theme === "light" ? "bg-gray-50" : "bg-[#1E1E2D]"}`}
                      >
                        <span
                          className={
                            theme === "light"
                              ? "text-gray-500"
                              : "text-white/60"
                          }
                        >
                          Status:
                        </span>
                        <span
                          className={`font-medium capitalize ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          {latestSession.status}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      className={`w-full mt-4 md:mt-6 text-sm md:text-base ${theme === "light" ? "bg-white text-gray-900 border-gray-200 hover:bg-gray-50" : "text-white bg-[#1E1E2D] border-[#1E1E2D] hover:bg-[#2A2B2D]"} transition-all`}
                      onClick={async () => {
                        if (latestSession?.session_id) {
                          const attendance = await fetchSessionAttendance(
                            latestSession.session_id,
                          );
                          setAttendanceData(attendance);
                          setShowAttendance(true);
                        }
                      }}
                    >
                      <Eye className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      View Attendance
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              <StatsGrid
                stats={{
                  totalSessions: sessions.length,
                  presentSessions: sessions.filter(
                    (s) => s.attendance?.status === "present",
                  ).length,
                  attendanceRate: sessions.length
                    ? Math.round(
                        (sessions.filter(
                          (s) => s.attendance?.status === "present",
                        ).length /
                          sessions.length) *
                          100,
                      )
                    : 0,
                }}
              />

              {latestSession && (
                <Card
                  className={`w-full shadow-sm rounded-lg overflow-hidden ${theme === "light" ? "bg-white border border-gray-200" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]"}`}
                >
                  <CardHeader>
                    <CardTitle
                      className={
                        theme === "light" ? "text-gray-900" : "text-white"
                      }
                    >
                      Latest Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span
                          className={
                            theme === "light"
                              ? "text-gray-500"
                              : "text-white/60"
                          }
                        >
                          Course:
                        </span>
                        <span
                          className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          {latestSession.course_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={
                            theme === "light"
                              ? "text-gray-500"
                              : "text-white/60"
                          }
                        >
                          Lecturer:
                        </span>
                        <span
                          className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          {latestSession.lecturer_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={
                            theme === "light"
                              ? "text-gray-500"
                              : "text-white/60"
                          }
                        >
                          Date & Time:
                        </span>
                        <span
                          className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          {formatDateTime(latestSession.start_time).full}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
                        <span
                          className={
                            theme === "light"
                              ? "text-gray-500"
                              : "text-white/60"
                          }
                        >
                          Status:
                        </span>
                        <div className="flex justify-center sm:justify-end">
                          <span
                            className={`font-medium px-3 py-1 rounded-full text-sm ${attendanceData.find((a) => a.rfid_id === localStorage.getItem("studentRfid"))?.status === "present" ? "bg-green-100 text-green-700" : attendanceData.find((a) => a.rfid_id === localStorage.getItem("studentRfid"))?.status === "partial" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}
                          >
                            {attendanceData.find(
                              (a) =>
                                a.rfid_id ===
                                localStorage.getItem("studentRfid"),
                            )?.status === "present"
                              ? "Present"
                              : attendanceData.find(
                                    (a) =>
                                      a.rfid_id ===
                                      localStorage.getItem("studentRfid"),
                                  )?.status === "partial"
                                ? "Proxy Attempt"
                                : "Absent"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {showAttendance && latestSession && (
            <AttendanceDialog
              open={showAttendance}
              onOpenChange={setShowAttendance}
              attendanceData={attendanceData}
              sessionDate={formatDateTime(latestSession.start_time).full}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
