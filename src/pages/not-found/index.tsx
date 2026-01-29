import { Helmet } from "react-helmet-async";
import { useId } from "react";

const NotFoundPage = () => {
  const id = useId();
  const gradientId = `flatlineGradient-${id}`;

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Intents</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-[#0a0a0a] px-4">
        <a href="/">
          <img
            src="/b-intents.svg"
            alt="Intents"
            className="h-[36px] opacity-40 transition-opacity hover:opacity-70"
          />
        </a>

        <span className="font-bold text-[96px] text-white/20 tracking-tight">
          404
        </span>

        <div className="w-[320px]">
          <svg
            viewBox="0 0 320 50"
            className="h-[50px] w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,25 L40,25 L50,25 L55,10 L60,38 L65,6 L70,40 L75,18 L80,30 L85,25 L120,25 L130,25 L135,14 L140,34 L145,25 L320,25"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 600,
                strokeDashoffset: 600,
                animation: "flatline 3s ease-out forwards",
              }}
            />
          </svg>
        </div>

        <p className="text-sm text-white/30">
          This swap pair doesn't exist.{" "}
          <a href="/" className="text-[#3B82F6]/60 transition-colors hover:text-[#3B82F6]">
            Go back
          </a>
        </p>
      </div>
    </>
  );
};

export default NotFoundPage;
