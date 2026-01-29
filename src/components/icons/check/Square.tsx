import type { Icon } from "../icons";

const CheckSquare: Icon = ({ className, color = "#00EC97" }) => {
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
        clipRule="evenodd"
        d="M14.334 0.750244H5.665C2.644 0.750244 0.75 2.88924 0.75 5.91624V14.0842C0.75 17.1112 2.635 19.2502 5.665 19.2502H14.333C17.364 19.2502 19.25 17.1112 19.25 14.0842V5.91624C19.25 2.88924 17.364 0.750244 14.334 0.750244Z"
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6.43945 10.0002L8.81345 12.3732L13.5595 7.6272"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};
export default CheckSquare;
