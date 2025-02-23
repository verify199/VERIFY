import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export interface SessionData {
  attendance: any;
  course_code: string;
  course_name: string;
  lecturer_name: string;
  lecturer_rfid: string;
  start_time: string;
  status: string;
  session_id?: string;
}

export interface AttendanceData {
  date: string;
  name: string;
  rfid_id: string;
  status: string;
  time: string;
  unique_id: string;
}

export const formatDateTime = (dateTimeStr: string) => {
  try {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString("en-GB"), // DD-MM-YYYY
      time: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }), // HH:MM
      full: `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`,
    };
  } catch (error) {
    return {
      date: "Invalid date",
      time: "Invalid time",
      full: "Invalid date and time",
    };
  }
};

export const fetchTeacherSessions = async (courseCode: string) => {
  if (!courseCode) return [];
  try {
    const lecturesRef = collection(db, "lectures");
    const querySnapshot = await getDocs(lecturesRef);
    const sessions: SessionData[] = [];

    querySnapshot.forEach((doc) => {
      const sessionId = doc.id;
      const sessionCourseCode = sessionId.split("_")[0];
      const data = doc.data();

      if (sessionCourseCode === courseCode) {
        sessions.push({
          course_code: data.course_code || sessionCourseCode,
          course_name: data.course_name || "CSP",
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

    return sessions;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
};

export const validateRFID = async (rfid: string): Promise<boolean> => {
  try {
    // Check if any user already has this RFID
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("rfid_id", "==", rfid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error("Error validating RFID:", error);
    return false;
  }
};

export const validateCourseCode = async (
  courseCode: string,
): Promise<boolean> => {
  try {
    // Check if any user already has this course code
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("course_code", "==", courseCode));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error("Error validating course code:", error);
    return false;
  }
};

export const fetchSessionAttendance = async (sessionId: string) => {
  try {
    const attendanceRef = collection(db, `lectures/${sessionId}/attendance`);
    const querySnapshot = await getDocs(attendanceRef);

    const attendanceList: AttendanceData[] = [];
    querySnapshot.forEach((doc) => {
      attendanceList.push(doc.data() as AttendanceData);
    });

    return attendanceList;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }
};
