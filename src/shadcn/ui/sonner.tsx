import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      richColors
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!p-3 !rounded-xl",
          title: "!text-base !font-semibold",
          error: "!text-red-700 !bg-red-100 !border-red-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
