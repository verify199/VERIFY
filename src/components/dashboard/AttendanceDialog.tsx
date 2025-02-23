import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";

interface AttendanceData {
  name: string;
  rfid_id: string;
  status: string;
  time: string;
}

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendanceData: AttendanceData[];
  sessionDate: string;
}

const AttendanceDialog: React.FC<AttendanceDialogProps> = ({
  open,
  onOpenChange,
  attendanceData,
  sessionDate,
}) => {
  const { theme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-2xl rounded-lg shadow-lg ${theme === "light" ? "bg-white border border-gray-200" : "bg-[#1A1A24] border border-[#3B82F6]/20"}`}
      >
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            className={`${theme === "light" ? "bg-white text-gray-900 hover:bg-gray-50 border-gray-200" : "bg-[#1E1E2D] text-white hover:text-white hover:bg-[#3B82F6]/20 border-[#3B82F6]/20"}`}
            onClick={() => {
              const csv = [
                ["Name", "RFID", "Time", "Status"],
                ...attendanceData.map((record) => [
                  record.name,
                  record.rfid_id,
                  record.time,
                  record.status,
                ]),
              ]
                .map((row) => row.join(","))
                .join("\n");

              const blob = new Blob([csv], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `attendance_${sessionDate.replace(/[\/:]/g, "_")}.csv`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }}
          >
            Export to CSV
          </Button>
        </div>
        <DialogHeader>
          <DialogTitle
            className={theme === "light" ? "text-gray-900" : "text-white"}
          >
            Session Attendance - {sessionDate}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className={theme === "light" ? "text-gray-900" : "text-white"}
                >
                  Name
                </TableHead>
                <TableHead
                  className={theme === "light" ? "text-gray-900" : "text-white"}
                >
                  RFID
                </TableHead>
                <TableHead
                  className={theme === "light" ? "text-gray-900" : "text-white"}
                >
                  Time
                </TableHead>
                <TableHead
                  className={theme === "light" ? "text-gray-900" : "text-white"}
                >
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record, index) => (
                <TableRow
                  key={index}
                  className={
                    theme === "light" ? "hover:bg-gray-50" : "hover:bg-white/5"
                  }
                >
                  <TableCell
                    className={
                      theme === "light" ? "text-gray-900" : "text-white"
                    }
                  >
                    {record.name}
                  </TableCell>
                  <TableCell
                    className={
                      theme === "light" ? "text-gray-900" : "text-white"
                    }
                  >
                    {record.rfid_id}
                  </TableCell>
                  <TableCell
                    className={
                      theme === "light" ? "text-gray-900" : "text-white"
                    }
                  >
                    {record.time}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        record.status.toLowerCase() === "present"
                          ? "bg-green-500/20 text-green-700 hover:bg-green-500/30"
                          : record.status.toLowerCase() === "partial"
                            ? "bg-amber-500/20 text-amber-700 hover:bg-amber-500/30"
                            : "bg-red-500/20 text-red-700 hover:bg-red-500/30"
                      }
                    >
                      {record.status.toLowerCase() === "present"
                        ? "Present"
                        : record.status.toLowerCase() === "partial"
                          ? "Proxy Attempt"
                          : "Absent"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDialog;
