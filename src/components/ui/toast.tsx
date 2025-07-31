import React, { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ToastProps {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  shortTimeout?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = "default",
  duration = 4000,
  open = true,
  onOpenChange,
  shortTimeout = false,
}) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (visible && duration) {
      const timer = setTimeout(() => {
        setVisible(false);
        onOpenChange?.(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onOpenChange]);

  if (!visible) return null;

  // Icons for each variant
  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  // Background and border color based on variant
  const bgColor = {
    default: "bg-blue-100",
    destructive: "bg-red-100",
    success: "bg-green-100",
  };

  const borderColor = {
    default: "border-blue-500",
    destructive: "border-red-600",
    success: "border-green-600",
  };

  const progressBg = {
    default: "bg-blue-200",
    destructive: "bg-red-300",
    success: "bg-green-300",
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-md px-4 py-3 shadow-md border-l-4 animate-slide-down",
        bgColor[variant],
        borderColor[variant]
      )}
    >
      {/* ✅ Progress background animation */}
      {shortTimeout && (
        <div
          className={cn(
            "absolute inset-0 z-0 origin-left scale-x-100",
            progressBg[variant],
            "animate-toast-progress",
            "toast-progress-bar"
          )}
          data-toast-duration={duration}
        />
      )}

      {/* ✅ Foreground content */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="pt-1">{getIcon()}</div>

        <div className="flex-1">
          {title && <p className="font-semibold text-sm text-gray-900">{title}</p>}
          {description && <p className="text-sm mt-1 text-gray-700">{description}</p>}
        </div>

      </div>
    </div>
  );
};
