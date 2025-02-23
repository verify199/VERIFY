import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { auth, storage } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfileForm() {
  const navigate = useNavigate();
  const [name, setName] = useState(auth.currentUser?.displayName || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoURL, setPhotoURL] = useState(auth.currentUser?.photoURL || "");

  const handleFileUpload = async (file: File) => {
    try {
      const storageRef = ref(
        storage,
        `profile-photos/${auth.currentUser?.uid}`,
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        });
        setPhotoURL(downloadURL);
        localStorage.setItem("userPhoto", downloadURL);
        setMessage("Profile photo updated successfully!");
      }
    } catch (error) {
      setMessage("Error uploading photo");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        setMessage("Profile updated successfully!");
      }
    } catch (error) {
      setMessage("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full ${theme === "light" ? "bg-white" : "bg-[#020817]"} relative overflow-hidden`}
    >
      <div className="relative z-10 p-8 max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className={`mb-4 ${theme === "light" ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-white hover:text-white hover:bg-white/10"}`}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card
          className={`w-full ${theme === "light" ? "bg-white border border-gray-200 shadow-sm" : "bg-[#1A1A24]/60 backdrop-blur-xl border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]"}`}
        >
          <CardHeader>
            <CardTitle
              className={theme === "light" ? "text-gray-900" : "text-white"}
            >
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={photoURL || ""} />
                <AvatarFallback className="bg-blue-500/20 text-white text-xl">
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                >
                  Email
                </label>
                <Input
                  value={auth.currentUser?.email || ""}
                  disabled
                  className={`${theme === "light" ? "bg-gray-50 text-gray-900" : "bg-[#1E1E2D] text-white border-none"}`}
                />
              </div>

              <div className="space-y-2">
                <label
                  className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                >
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={`${theme === "light" ? "bg-white text-gray-900 border-gray-200" : "bg-[#1E1E2D] text-white border-none"}`}
                />
              </div>

              <div className="space-y-2">
                <label
                  className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                >
                  Course Code
                </label>
                <Input
                  value={localStorage.getItem("courseCode") || ""}
                  disabled
                  className={`${theme === "light" ? "bg-gray-50 text-gray-900" : "bg-[#1E1E2D] text-white border-none"}`}
                />
              </div>

              {message && (
                <p
                  className={`text-sm ${message.includes("Error") ? "text-red-400" : "text-green-400"}`}
                >
                  {message}
                </p>
              )}

              <Button
                type="submit"
                disabled={saving}
                className={`w-full ${theme === "light" ? "bg-blue-600 hover:bg-blue-700" : "bg-[#3B82F6] hover:bg-[#2563EB]"} text-white`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
