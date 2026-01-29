import type { Icon } from "../icons";

const MagicPenIcon: Icon = ({ className, color = "currentColor" }) => {
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
        d="M2.33321 13.6667C2.88655 14.22 3.77988 14.22 4.33321 13.6667L12.9999 4.99999C13.5532 4.44666 13.5532 3.55332 12.9999 2.99999C12.4465 2.44666 11.5532 2.44666 10.9999 2.99999L2.33321 11.6667C1.77988 12.22 1.77988 13.1133 2.33321 13.6667Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12.0066 5.99335L10.0066 3.99335"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M5.66675 1.62668L6.66675 1.33334L6.37342 2.33334L6.66675 3.33334L5.66675 3.04001L4.66675 3.33334L4.96008 2.33334L4.66675 1.33334L5.66675 1.62668Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 5.62668L4 5.33334L3.70667 6.33334L4 7.33334L3 7.04001L2 7.33334L2.29333 6.33334L2 5.33334L3 5.62668Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 8.95999L14 8.66666L13.7067 9.66666L14 10.6667L13 10.3733L12 10.6667L12.2933 9.66666L12 8.66666L13 8.95999Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MagicPenIcon;
