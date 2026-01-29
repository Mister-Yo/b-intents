import { AlertCircle } from "lucide-react";
import type { FC } from "react";

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
      <AlertCircle className="size-5 shrink-0" />
      <p className="font-medium text-sm">{message}</p>
    </div>
  );
};

export default ErrorDisplay;
