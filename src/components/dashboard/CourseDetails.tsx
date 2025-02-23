import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

interface CourseDetailsProps {
  courseCode: string;
  courseName: string;
  lecturerName: string;
}

const CourseDetails = ({
  courseCode,
  courseName,
  lecturerName,
}: CourseDetailsProps) => {
  const { theme } = useTheme();

  return (
    <Card
      className={`w-full shadow-sm rounded-lg overflow-hidden h-[450px] ${theme === "light" ? "bg-white border border-gray-200" : "bg-[#0A0A1B] border-[#1E1E2D]"}`}
    >
      <CardHeader
        className={`border-b py-4 ${theme === "light" ? "border-gray-200" : "border-[#1E1E2D]"}`}
      >
        <CardTitle
          className={`text-xl ${theme === "light" ? "text-gray-900" : "text-white"}`}
        >
          Course Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-6">
          <div
            className={`flex justify-between items-center pb-2 border-b ${theme === "light" ? "border-gray-200" : "border-[#1E1E2D]"}`}
          >
            <h3
              className={`text-lg font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
            >
              Course Information
            </h3>
          </div>
          <div className="grid gap-4">
            <div
              className={`flex justify-between p-3 rounded-lg text-base ${theme === "light" ? "bg-gray-50" : "bg-[#1E1E2D]"}`}
            >
              <span
                className={
                  theme === "light" ? "text-gray-500" : "text-white/60"
                }
              >
                Course Code:
              </span>
              <span
                className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                {courseCode}
              </span>
            </div>
            <div
              className={`flex justify-between p-3 rounded-lg text-base ${theme === "light" ? "bg-gray-50" : "bg-[#1E1E2D]"}`}
            >
              <span
                className={
                  theme === "light" ? "text-gray-500" : "text-white/60"
                }
              >
                Course Name:
              </span>
              <span
                className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                {courseName}
              </span>
            </div>
            <div
              className={`flex justify-between p-3 rounded-lg text-base ${theme === "light" ? "bg-gray-50" : "bg-[#1E1E2D]"}`}
            >
              <span
                className={
                  theme === "light" ? "text-gray-500" : "text-white/60"
                }
              >
                Lecturer:
              </span>
              <span
                className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                {lecturerName}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseDetails;
