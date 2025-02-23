import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowUpDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface Session {
  id: string;
  courseCode: string;
  courseName: string;
  lecturerName: string;
  dateTime: string;
  status: string;
  attendance?: {
    status: string;
    time: string;
  };
}

interface SessionsTableProps {
  sessions?: Session[];
  isLecturer?: boolean;
  onViewDetails?: (sessionId: string) => void;
}

const SessionsTable = ({
  sessions = [],
  isLecturer = true,
  onViewDetails,
}: SessionsTableProps) => {
  const { theme } = useTheme();
  const [sortField, setSortField] = useState<string>("dateTime");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedAndFilteredSessions = useMemo(() => {
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

  return (
    <Card
      className={`w-full p-6 ${theme === "light" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]"}`}
    >
      <div className="space-y-4">
        <h2
          className={`text-2xl font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
        >
          Sessions
        </h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => toggleSort("courseCode")}
                className={`cursor-pointer ${theme === "light" ? "hover:bg-gray-50 text-gray-900" : "hover:bg-white/5 text-white"}`}
              >
                <div className="flex items-center gap-2">
                  Course Code
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("courseName")}
                className={`cursor-pointer ${theme === "light" ? "hover:bg-gray-50 text-gray-900" : "hover:bg-white/5 text-white"}`}
              >
                <div className="flex items-center gap-2">
                  Course Name
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("lecturerName")}
                className={`cursor-pointer ${theme === "light" ? "hover:bg-gray-50 text-gray-900" : "hover:bg-white/5 text-white"}`}
              >
                <div className="flex items-center gap-2">
                  Lecturer Name
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("dateTime")}
                className={`cursor-pointer ${theme === "light" ? "hover:bg-gray-50 text-gray-900" : "hover:bg-white/5 text-white"}`}
              >
                <div className="flex items-center gap-2">
                  Date & Time
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className={theme === "light" ? "text-gray-900" : "text-white"}
              >
                {isLecturer ? "Actions" : "Attendance"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredSessions.map((session) => (
              <TableRow
                key={session.id}
                className={
                  theme === "light" ? "hover:bg-gray-50" : "hover:bg-white/5"
                }
              >
                <TableCell
                  className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                >
                  {session.courseCode}
                </TableCell>
                <TableCell
                  className={theme === "light" ? "text-gray-900" : "text-white"}
                >
                  {session.courseName}
                </TableCell>
                <TableCell
                  className={theme === "light" ? "text-gray-900" : "text-white"}
                >
                  {session.lecturerName}
                </TableCell>
                <TableCell
                  className={theme === "light" ? "text-gray-900" : "text-white"}
                >
                  {session.dateTime}
                </TableCell>
                <TableCell>
                  {isLecturer ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails?.(session.id)}
                      className={`flex items-center gap-2 ${theme === "light" ? "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" : "bg-[#1E1E2D] text-white hover:text-white hover:bg-[#3B82F6]/20 border-[#3B82F6]/20"}`}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  ) : (
                    <Badge
                      className={
                        session.attendance?.status === "present"
                          ? "bg-green-100 text-green-800"
                          : session.attendance?.status === "partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {session.attendance?.status === "present"
                        ? "Present"
                        : session.attendance?.status === "partial"
                          ? "Proxy Attempt"
                          : "Absent"}
                      {session.attendance?.time &&
                        ` - ${session.attendance.time}`}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default SessionsTable;
