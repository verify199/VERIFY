import React from "react";
import { Card } from "@/components/ui/card";
import { Users, BookOpen, Clock, CheckCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const StatCard = ({ icon, title, value, description = "" }: StatCardProps) => {
  const { theme } = useTheme();
  return (
    <Card
      className={`p-3 sm:p-6 ${theme === "light" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]"}`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`p-2 rounded-lg ${theme === "light" ? "bg-blue-50" : "bg-blue-100"}`}
        >
          {icon}
        </div>
        <div className="space-y-1">
          <p
            className={`text-sm font-medium ${theme === "light" ? "text-gray-500" : "text-white/60"}`}
          >
            {title}
          </p>
          <h3
            className={`text-lg sm:text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
          >
            {value}
          </h3>
          <p
            className={`text-sm ${theme === "light" ? "text-gray-500" : "text-white/60"}`}
          >
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};

interface StatsGridProps {
  stats?: {
    totalSessions: number;
    presentSessions: number;
    attendanceRate: number;
  };
}

const StatsGrid = ({
  stats = { totalSessions: 0, presentSessions: 0, attendanceRate: 0 },
}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={<Clock className="h-4 w-4 text-blue-600" />}
        title="Total Sessions"
        value={stats.totalSessions.toString()}
        description="Total number of sessions conducted"
      />
      <StatCard
        icon={<CheckCircle className="h-4 w-4 text-green-600" />}
        title="Sessions Attended"
        value={stats.presentSessions.toString()}
        description="Number of sessions you attended"
      />
      <StatCard
        icon={<Users className="h-4 w-4 text-purple-600" />}
        title="Attendance Rate"
        value={`${stats.attendanceRate}%`}
        description="Your overall attendance percentage"
      />
    </div>
  );
};

export default StatsGrid;
