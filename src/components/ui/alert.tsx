import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
  onClose?: () => void;
  dismissible?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, onClose, dismissible = false, ...props }, ref) => {
    const baseStyles =
      "relative w-full rounded-lg border p-4 text-sm shadow-lg animate-slide-fade-in";
    const variantStyles =
      variant === "destructive"
        ? "bg-red-50 border-red-300 text-red-800"
        : "bg-green-50 border-green-300 text-green-800";

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(baseStyles, variantStyles, className)}
        {...props}
      >
        {dismissible && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-inherit hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold text-base", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm leading-snug text-current", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
