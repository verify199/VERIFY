interface LogoProps {
    className?: string;
    size?: "default" | "large";
  }
  
  export function Logo({ className = "", size = "default" }: LogoProps) {
    return (
      <div className={`flex items-center ${className}`}>
        <div
          className={`${size === "large" ? "h-10 w-10" : "h-8 w-8"} text-[#3B82F6] mr-2 relative group`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="absolute inset-0 transform transition-transform duration-300 group-hover:scale-110"
          >
            <path
              d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute inset-0 bg-[#3B82F6]/20 rounded-full blur-lg animate-pulse"></div>
        </div>
        <span
          className={`font-bold tracking-wider ${size === "large" ? "text-3xl" : "text-xl"} text-white relative group`}
        >
          <span className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent animate-gradient relative">
            VERIFY
            <div className="absolute -inset-1 bg-[#3B82F6]/20 blur-lg group-hover:bg-[#3B82F6]/30 transition-all duration-300 rounded-lg"></div>
          </span>
          <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] transition-all duration-300 group-hover:w-full"></div>
        </span>
      </div>
    );
  }
  