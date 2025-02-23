import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateRFID, validateCourseCode } from "@/lib/firebase-utils";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Smartphone, Users } from "lucide-react";

export default function AuthForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rfid: "",
    enrollmentNo: "",
    branch: "",
    courseCode: "",
  });
  const [role, setRole] = useState<"student" | "lecturer" | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const branches = ["CSE", "IT", "ECE", "EEE", "MECH"];

  const handleRoleChange = (selectedRole: "student" | "lecturer") => {
    setRole(selectedRole);
    setError("");
  };

  const handleBranchChange = (value: string) => {
    setFormData((prev) => ({ ...prev, branch: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (role === "student") {
        const isValidRFID = await validateRFID(formData.rfid);
        if (!isValidRFID) {
          setError("This RFID is already registered");
          setLoading(false);
          return;
        }
      } else if (role === "lecturer") {
        const isValidCourseCode = await validateCourseCode(formData.courseCode);
        if (!isValidCourseCode) {
          setError("This course code is already registered");
          setLoading(false);
          return;
        }
      }

      if (!formData.branch) {
        setError("Please select a branch");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      const user = userCredential.user;
      const userData = {
        name: formData.name,
        email: formData.email,
        role,
        branch: formData.branch,
        ...(role === "student"
          ? {
              rfid_id: formData.rfid,
              enrollment_no: formData.enrollmentNo,
            }
          : { course_code: formData.courseCode }),
      };

      await updateProfile(user, {
        displayName: formData.name,
      });

      await setDoc(doc(db, "users", user.uid), userData);

      if (role === "student") {
        localStorage.setItem("studentRfid", formData.rfid);
      } else {
        localStorage.setItem("courseCode", formData.courseCode);
      }
      localStorage.setItem("userRole", role);

      navigate("/");
    } catch (error: any) {
      setError(
        error.message || "An error occurred while creating your account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-4 mx-4 bg-[#1A1A24]/60 backdrop-blur-xl rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.15)] relative overflow-hidden animate-slideIn border border-[#3B82F6]/20">
      <div className="relative z-10">
        <h2 className="text-lg font-bold text-white mb-1 text-center">
          Create your account
        </h2>
        <p className="text-sm text-white/60 text-center mb-4">
          Choose your role to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!role ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("student")}
                className="group relative p-3 rounded-lg bg-[#1A1A24] border border-[#3B82F6]/20 hover:border-[#3B82F6] transition-all duration-300 flex flex-col items-center gap-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#0A0A1B]"
              >
                <div className="h-8 w-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center group-hover:bg-[#3B82F6]/20 transition-colors">
                  <Smartphone className="h-4 w-4 text-[#3B82F6]" />
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-white mb-0.5">
                    Student
                  </h4>
                  <p className="text-xs text-white/60">Track your attendance</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("lecturer")}
                className="group relative p-3 rounded-lg bg-[#1A1A24] border border-[#3B82F6]/20 hover:border-[#3B82F6] transition-all duration-300 flex flex-col items-center gap-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#0A0A1B]"
              >
                <div className="h-8 w-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center group-hover:bg-[#3B82F6]/20 transition-colors">
                  <Users className="h-4 w-4 text-[#3B82F6]" />
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-white mb-0.5">
                    Lecturer
                  </h4>
                  <p className="text-xs text-white/60">Manage your classes</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <Button
                type="button"
                variant="ghost"
                className="w-full text-sm text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setRole(null)}
              >
                ← Back to role selection
              </Button>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full h-10 text-sm bg-[#1A1A24] border-none text-white rounded-lg focus:ring-[#3B82F6]"
                  required
                />

                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full h-10 text-sm bg-[#1A1A24] border-none text-white rounded-lg focus:ring-[#3B82F6]"
                  required
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full h-10 text-sm bg-[#1A1A24] border-none text-white rounded-lg focus:ring-[#3B82F6]"
                  required
                />

                {role === "student" ? (
                  <>
                    <Input
                      type="text"
                      placeholder="RFID Number"
                      value={formData.rfid}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          rfid: e.target.value,
                        }))
                      }
                      className="w-full h-10 text-sm bg-[#1A1A24] border-none text-white rounded-lg focus:ring-[#3B82F6]"
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Enrollment Number"
                      value={formData.enrollmentNo}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          enrollmentNo: e.target.value,
                        }))
                      }
                      className="w-full h-10 text-sm bg-[#1A1A24] border-none text-white rounded-lg focus:ring-[#3B82F6]"
                      required
                    />
                  </>
                ) : (
                  <Input
                    type="text"
                    placeholder="Course Code"
                    value={formData.courseCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        courseCode: e.target.value,
                      }))
                    }
                    className="w-full h-10 text-sm bg-[#1A1A24] border-none text-white rounded-lg focus:ring-[#3B82F6]"
                    required
                  />
                )}

                <Select
                  value={formData.branch}
                  onValueChange={handleBranchChange}
                  required
                >
                  <SelectTrigger className="w-full h-10 text-sm bg-[#1A1A24] border-none text-white/80 rounded-lg focus:ring-[#3B82F6]">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A24] border border-[#3B82F6]/20 text-white min-w-[8rem] rounded-lg">
                    {branches.map((branch) => (
                      <SelectItem
                        key={branch}
                        value={branch}
                        className="hover:bg-[#3B82F6]/20 focus:bg-[#3B82F6]/20 cursor-pointer text-white text-sm"
                      >
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full h-10 text-sm bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg transition-colors"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => navigate("/auth")}
                >
                  ← Back to Login
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}