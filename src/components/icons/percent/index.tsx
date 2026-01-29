import type { Icon } from "../icons";

const Percent: Icon = ({ className, color = "currentColor" }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="16"
      viewBox="0 0 17 16"
      width="17"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.1666 3.33333L3.83331 12.6667"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        clipRule="evenodd"
        d="M4.83335 6C5.75383 6 6.50002 5.25381 6.50002 4.33334C6.50002 3.41286 5.75383 2.66667 4.83335 2.66667C3.91288 2.66667 3.16669 3.41286 3.16669 4.33334C3.16669 5.25381 3.91288 6 4.83335 6Z"
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        clipRule="evenodd"
        d="M12.1667 13.3333C13.0871 13.3333 13.8333 12.5871 13.8333 11.6667C13.8333 10.7462 13.0871 10 12.1667 10C11.2462 10 10.5 10.7462 10.5 11.6667C10.5 12.5871 11.2462 13.3333 12.1667 13.3333Z"
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Percent;
