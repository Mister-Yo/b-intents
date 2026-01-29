import type { Icon } from "../icons";

const Square: Icon = ({ className, color = "#FF5454" }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.3955 7.59473L7.60352 12.3867"
        id="Stroke 1"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12.3976 12.3898L7.60156 7.59277"
        id="Stroke 2"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        clipRule="evenodd"
        d="M14.335 0.75H5.66598C2.64498 0.75 0.750977 2.889 0.750977 5.916V14.084C0.750977 17.111 2.63598 19.25 5.66598 19.25H14.334C17.365 19.25 19.251 17.111 19.251 14.084V5.916C19.251 2.889 17.365 0.75 14.335 0.75Z"
        fillRule="evenodd"
        id="Stroke 3"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};
export default Square;
