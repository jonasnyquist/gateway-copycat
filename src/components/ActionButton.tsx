
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ActionButtonProps {
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const ActionButton = ({
  onClick,
  icon,
  disabled = false,
  variant = "default",
  children,
  className = "",
  type = "button"
}: ActionButtonProps) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      className={`flex items-center gap-2 ${className}`}
    >
      {icon && <span className="h-4 w-4">{icon}</span>}
      {children}
    </Button>
  );
};

export default ActionButton;
