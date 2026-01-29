import type { Icon } from "../icons";

const LoadIcon: Icon = ({ className, color = "currentColor" }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6667 7.99999C14.6667 4.3181 11.6819 1.33333 8 1.33333"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M8.00016 14.6667C4.31826 14.6667 1.3335 11.6819 1.3335 8"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default LoadIcon;
