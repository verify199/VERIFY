import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import {
  fetchTeacherSessions,
  fetchSessionAttendance,
} from "@/lib/firebase-utils";
import Sidebar from "@/components/layout/Sidebar";
import { auth } from "@/lib/firebase";
import { useTheme } from "@/contexts/ThemeContext";

export default function ReportsPage() {
  const { theme } = useTheme();

  const exportSessionwise = async () => {
    const courseCode = localStorage.getItem("courseCode");
    if (!courseCode) return;

    const sessions = await fetchTeacherSessions(courseCode);
    const allAttendance: any[] = [];

    for (const session of sessions) {
      const attendance = await fetchSessionAttendance(session.session_id!);
      allAttendance.push(
        ...attendance.map((a) => ({
          ...a,
          session_id: session.session_id,
          session_date: new Date(session.start_time).toLocaleDateString(),
        })),
      );
    }

    const csv = [
      ["Session ID", "Date", "Student Name", "RFID", "Status", "Time"],
      ...allAttendance.map((record) => [
        record.session_id,
        record.session_date,
        record.name,
        record.rfid_id,
        record.status,
        record.time,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    downloadCSV(csv, `sessionwise_attendance_${courseCode}.csv`);
  };

  const exportWeekly = async () => {
    // Similar to sessionwise but grouped by week
    const courseCode = localStorage.getItem("courseCode");
    if (!courseCode) return;

    const sessions = await fetchTeacherSessions(courseCode);
    // Group by week logic here
  };

  const exportMonthly = async () => {
    // Similar to sessionwise but grouped by month
    const courseCode = localStorage.getItem("courseCode");
    if (!courseCode) return;

    const sessions = await fetchTeacherSessions(courseCode);
    // Group by month logic here
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

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
        <div className="space-y-8">
          <h1
            className={`text-3xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
          >
            Reports
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className={`${theme === "light" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]"}`}
            >
              <CardHeader>
                <CardTitle
                  className={theme === "light" ? "text-gray-900" : "text-white"}
                >
                  Sessionwise Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className={`w-full ${theme === "light" ? "bg-white text-gray-900 hover:bg-gray-50 border-gray-200" : "bg-[#1E1E2D] text-white hover:text-white hover:bg-[#3B82F6]/20 border-[#3B82F6]/20"}`}
                  onClick={exportSessionwise}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardContent>
            </Card>

            <Card
              className={`${theme === "light" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]"}`}
            >
              <CardHeader>
                <CardTitle
                  className={theme === "light" ? "text-gray-900" : "text-white"}
                >
                  Weekly Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className={`w-full ${theme === "light" ? "bg-white text-gray-900 hover:bg-gray-50 border-gray-200" : "bg-[#1E1E2D] text-white hover:text-white hover:bg-[#3B82F6]/20 border-[#3B82F6]/20"}`}
                  onClick={exportWeekly}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardContent>
            </Card>

            <Card
              className={`${theme === "light" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]"}`}
            >
              <CardHeader>
                <CardTitle
                  className={theme === "light" ? "text-gray-900" : "text-white"}
                >
                  Monthly Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className={`w-full ${theme === "light" ? "bg-white text-gray-900 hover:bg-gray-50 border-gray-200" : "bg-[#1E1E2D] text-white hover:text-white hover:bg-[#3B82F6]/20 border-[#3B82F6]/20"}`}
                  onClick={exportMonthly}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
