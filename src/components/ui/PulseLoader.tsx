import { cn } from "@/shadcn/utils";
import { useId } from "react";

const PulseLoader = ({ className }: { className?: string }) => {
  const id = useId();
  const gradientId = `pulseGradient-${id}`;

  return (
    <div className={cn("flex items-center justify-end overflow-hidden", className)}>
      <svg
        viewBox="0 0 200 40"
        className="w-full h-10"
        preserveAspectRatio="xMaxYMid slice"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F05A28" stopOpacity="0" />
            <stop offset="50%" stopColor="#F05A28" stopOpacity="1" />
            <stop offset="100%" stopColor="#F05A28" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M0,20 L30,20 L35,20 L40,8 L45,32 L50,5 L55,35 L60,15 L65,25 L70,20 L100,20 L105,20 L110,10 L115,30 L120,8 L125,33 L130,18 L135,22 L140,20 L200,20"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: 400,
            animation: "pulse-line 1.5s ease-in-out infinite",
          }}
        />
      </svg>
    </div>
  );
};

export default PulseLoader;
