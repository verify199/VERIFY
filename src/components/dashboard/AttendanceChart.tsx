import React from "react";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  partial: number;
}

interface AttendanceChartProps {
  data?: AttendanceData[];
  title?: string;
}

const defaultData: AttendanceData[] = [
  { date: "Mon", present: 35, absent: 10, partial: 5 },
  { date: "Tue", present: 40, absent: 8, partial: 2 },
  { date: "Wed", present: 38, absent: 12, partial: 0 },
  { date: "Thu", present: 42, absent: 6, partial: 2 },
  { date: "Fri", present: 36, absent: 9, partial: 5 },
];

const AttendanceChart = ({
  data = defaultData,
  title = "Weekly Attendance Overview",
}: AttendanceChartProps) => {
  const { theme } = useTheme();

  return (
    <Card
      className={`p-4 sm:p-6 w-full h-full ${theme === "light" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]"}`}
    >
      <div className="flex flex-col h-full">
        <h3
          className={`text-base sm:text-lg font-semibold mb-2 sm:mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}
        >
          {title}
        </h3>
        <div className="flex-1 w-full min-h-[200px] sm:min-h-[300px] pr-2 sm:pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              style={{ fontSize: "11px" }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "light" ? "#e5e7eb" : "rgba(255,255,255,0.1)"}
              />
              <XAxis
                dataKey="date"
                stroke={theme === "light" ? "#374151" : "#ffffff"}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                stroke={theme === "light" ? "#374151" : "#ffffff"}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "light" ? "#fff" : "#1A1A24",
                  border:
                    theme === "light"
                      ? "1px solid #e2e8f0"
                      : "1px solid rgba(59,130,246,0.2)",
                  borderRadius: "6px",
                  color: theme === "light" ? "#111" : "#fff",
                  fontSize: "11px",
                  padding: "8px",
                }}
                formatter={(value, name) => [
                  value,
                  name === "partial" ? "Proxy Attempt" : name,
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px" }}
                verticalAlign="bottom"
                height={36}
              />
              <Bar dataKey="present" name="Present" fill="#3B82F6" />
              <Bar dataKey="partial" name="Proxy Attempt" fill="#60A5FA" />
              <Bar dataKey="absent" name="Absent" fill="#1E3A8A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceChart;
