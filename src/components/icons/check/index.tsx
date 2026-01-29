import type { Icon } from "../icons";

import CheckSquare from "./Square";

type CheckIcon = Icon & {
  Square: Icon;
};

const Check: CheckIcon = ({ className, color = "currentColor" }) => {
  return (
    <svg className={className} fill="none" height="5" viewBox="0 0 8 5" width="8" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.62695 2.50007L3.20962 4.08207L6.37362 0.918068"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

Check.Square = CheckSquare;

export default Check;
