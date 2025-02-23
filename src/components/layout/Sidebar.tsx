import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Download,
  Sun,
  Moon,
  Laptop,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface NavigationItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface NavigationItems {
  student: NavigationItem[];
  lecturer: NavigationItem[];
}

interface SidebarProps {
  userRole?: "student" | "lecturer";
  userName?: string;
  userEmail?: string;
  userImage?: string;
}

const defaultProps = {
  userRole: "student" as const,
  userName: "User",
  userEmail: "",
  userImage: "/blank-user.jpg",
};

const Sidebar = (props: SidebarProps) => {
  const { theme } = useTheme();
  const { userRole, userName, userEmail } = {
    ...defaultProps,
    ...props,
  };
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigationItems = {
    student: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/" },
      { icon: Calendar, label: "Sessions", href: "/sessions" },
    ],
    lecturer: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/" },
      { icon: Calendar, label: "Manage Sessions", href: "/sessions" },
      { icon: Users, label: "Students", href: "/students" },
      { icon: BarChart3, label: "Analytics", href: "/analytics" },
      { icon: Download, label: "Reports", href: "/reports" },
    ],
  } as const;

  const role = userRole || "student";
  const items =
    navigationItems[role as keyof typeof navigationItems] ||
    navigationItems.student;

  const handleNavigation = (href: string) => {
    navigate(href);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-14 bg-inherit border-b z-50 md:hidden flex items-center justify-between px-4">
        <Logo />
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div
        className={`${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} fixed md:static top-14 md:top-0 left-0 z-40 flex flex-col h-[calc(100%-3.5rem)] md:h-full w-[240px] border-r transition-all duration-300 ${theme === "light" ? "bg-white border-gray-200" : "bg-[#1A1A24] border-[#3B82F6]/20"}`}
      >
        <div
          className={`p-4 flex flex-col items-center space-y-3 border-b transition-colors ${theme === "light" ? "bg-white border-gray-200" : "bg-[#1E1E2D] border-[#3B82F6]/20"}`}
        >
          <div className="hidden md:block mb-2">
            <Logo />
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={
                auth.currentUser?.photoURL ||
                localStorage.getItem("userPhoto") ||
                "/blank-user.jpg"
              }
              alt={userName}
            />
            <AvatarFallback className="bg-[#3B82F6]/20 text-white">
              {userName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3
              className={`font-medium text-base ${theme === "light" ? "text-gray-900" : "text-white"}`}
            >
              {userName}
            </h3>
            <p
              className={`text-xs ${theme === "light" ? "text-gray-500" : "text-white/60"}`}
            >
              {userEmail}
            </p>
            <div className="mt-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full capitalize ${theme === "light" ? "bg-blue-100 text-blue-600" : "bg-[#3B82F6]/20 text-[#3B82F6]"}`}
              >
                {userRole}
              </span>
            </div>
          </div>
        </div>

        <ScrollArea
          className={`flex-1 py-2 ${theme === "light" ? "bg-white" : "bg-[#1A1A24]"}`}
        >
          <nav className="px-2 space-y-1">
            {items.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start gap-x-3 text-sm ${theme === "light" ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-white hover:text-white hover:bg-[#3B82F6]/10"}`}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </ScrollArea>

        <div
          className={`p-3 mt-auto border-t space-y-2 ${theme === "light" ? "bg-white border-gray-200" : "bg-[#1E1E2D] border-[#3B82F6]/20"}`}
        >
          <div className="flex gap-1 mb-2">
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-x-3 text-sm ${theme === "light" ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-white hover:text-white hover:bg-[#3B82F6]/10"}`}
            onClick={() => handleNavigation("/profile")}
          >
            <Settings className="h-4 w-4" />
            Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-x-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex w-full gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={`flex-1 justify-center ${theme === "light" ? "bg-blue-100 text-blue-600" : "text-white hover:text-white hover:bg-[#3B82F6]/10"}`}
        onClick={() => setTheme("light")}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`flex-1 justify-center ${theme === "dark" ? "bg-[#3B82F6]/10 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`flex-1 justify-center ${theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "bg-[#3B82F6]/10 text-white" : "bg-blue-100 text-blue-600") : theme === "dark" ? "text-white hover:text-white hover:bg-[#3B82F6]/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
        onClick={() => setTheme("system")}
      >
        <Laptop className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default Sidebar;
