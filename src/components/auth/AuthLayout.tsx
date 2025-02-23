import { useLocation } from "react-router-dom";
import { Logo } from "@/components/ui/logo";
import AuthForm from "./AuthForm";
import LoginForm from "./LoginForm";

export default function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname === "/auth/register";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#020817]">
      <div className="absolute top-8 left-8 z-20">
        <Logo size="large" />
      </div>
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,30,70,0.4)_0%,rgba(2,8,23,0.95)_100%)]" />

      {/* Animated glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-700/10 rounded-full blur-[140px] animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {isRegister ? <AuthForm /> : <LoginForm />}
      </div>
    </div>
  );
}