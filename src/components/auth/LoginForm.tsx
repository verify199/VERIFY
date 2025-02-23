import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      // Get user data from Firestore
      const userDoc = await getDocs(
        query(collection(db, "users"), where("email", "==", formData.email)),
      );

      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userId", userDoc.docs[0].id);

        if (userData.role === "student") {
          localStorage.setItem("studentRfid", userData.rfid_id);
          localStorage.removeItem("courseCode");
        } else if (userData.role === "lecturer") {
          localStorage.setItem("courseCode", userData.course_code);
          localStorage.removeItem("studentRfid");
        }
      }

      navigate("/");
    } catch (error: any) {
      setError(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-6 mx-4 bg-[#1A1A24]/60 backdrop-blur-xl rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.15)] relative overflow-hidden animate-slideIn animate-glow border border-[#3B82F6]/20">
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          Welcome back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full bg-[#1A1A24] border-none text-white rounded-xl focus:ring-[#3B82F6]"
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full bg-[#1A1A24] border-none text-white rounded-xl focus:ring-[#3B82F6]"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2 rounded-xl transition-colors"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => navigate("/auth/register")}
              className="text-[#3B82F6] hover:text-[#2563EB] text-xs w-full text-center mt-3"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}