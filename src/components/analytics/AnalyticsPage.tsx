import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart2, TrendingUp } from "lucide-react";
import {
  fetchTeacherSessions,
  fetchSessionAttendance,
  formatDateTime,
} from "@/lib/firebase-utils";
import Sidebar from "@/components/layout/Sidebar";
import { auth } from "@/lib/firebase";
import AttendanceChart from "../dashboard/AttendanceChart";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [sessionStats, setSessionStats] = useState<
    {
      date: string;
      present: number;
      absent: number;
      partial: number;
    }[]
  >([]);
  const [overallStats, setOverallStats] = useState({
    present: 0,
    absent: 0,
    partial: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const courseCode = localStorage.getItem("courseCode");
      if (!courseCode) return;

      const sessions = await fetchTeacherSessions(courseCode);
      const sessionData = [];
      let totalPresent = 0;
      let totalAbsent = 0;
      let totalPartial = 0;

      for (const session of sessions) {
        const attendance = await fetchSessionAttendance(session.session_id!);
        const presentCount = attendance.filter(
          (a) => a.status.toLowerCase() === "present",
        ).length;
        const partialCount = attendance.filter(
          (a) => a.status.toLowerCase() === "partial",
        ).length;
        const absentCount = attendance.filter(
          (a) => a.status.toLowerCase() === "absent",
        ).length;

        totalPresent += presentCount;
        totalAbsent += absentCount;
        totalPartial += partialCount;

        sessionData.push({
          date: formatDateTime(session.start_time).date,
          present: presentCount,
          absent: absentCount,
          partial: partialCount,
        });
      }

      setOverallStats({
        present: totalPresent,
        absent: totalAbsent,
        partial: totalPartial,
      });

      // Sort by date
      sessionData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      setSessionStats(sessionData);
    };

    fetchStats();
  }, []);

  // Calculate percentage for each session
  const pieData = sessionStats.map((session) => {
    const total = session.present + session.absent + session.partial;
    const percentage = total ? Math.round((session.present / total) * 100) : 0;
    return {
      name: `${session.date}`,
      value: percentage,
      students: session.present,
    };
  });

  const COLORS = [
    "#1E40AF",
    "#1E3A8A",
    "#1E3B8A",
    "#2563EB",
    "#3B82F6",
    "#60A5FA",
    "#93C5FD",
    "#BFDBFE",
    "#DBEAFE",
    "#EFF6FF",
  ];

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
            Analytics
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className={`${theme === "light" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)] hover:shadow-[0_0_60px_rgba(59,130,246,0.2)]"} transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}
                >
                  <TrendingUp className="h-5 w-5 text-[#3B82F6]" />
                  Overall Attendance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#3B82F6]">
                  {overallStats.present +
                  overallStats.absent +
                  overallStats.partial
                    ? Math.round(
                        (overallStats.present /
                          (overallStats.present +
                            overallStats.absent +
                            overallStats.partial)) *
                          100,
                      )
                    : 0}
                  %
                </div>
              </CardContent>
            </Card>

            <Card
              className={`col-span-2 ${theme === "light" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)] hover:shadow-[0_0_60px_rgba(59,130,246,0.2)]"} transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}
                >
                  <PieChart className="h-5 w-5 text-[#3B82F6]" />
                  Session-wise Attendance Percentage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] md:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, value, students }) =>
                          `${name} (${students})`
                        }
                        labelLine={{
                          stroke: theme === "light" ? "#111" : "#fff",
                          strokeWidth: 1,
                        }}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            theme === "light" ? "#fff" : "#1A1A24",
                          border:
                            theme === "light"
                              ? "1px solid #e2e8f0"
                              : "1px solid rgba(59,130,246,0.2)",
                          borderRadius: "6px",
                          color: theme === "light" ? "#111" : "#fff",
                        }}
                        formatter={(value, name, { payload }) => [
                          `${value}% (${payload.students} students)`,
                          payload.name,
                        ]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card
            className={`${theme === "light" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)] hover:shadow-[0_0_60px_rgba(59,130,246,0.2)]"} transition-all duration-300`}
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                <BarChart2 className="h-5 w-5 text-[#3B82F6]" />
                Session-wise Attendance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px]">
                <AttendanceChart data={sessionStats} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
