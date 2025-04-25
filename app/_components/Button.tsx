"use client";

interface ButtonProps {
  onClick?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | (() => void);
  className?: string;
  type?: "submit" | "reset" | "button"; // ✅ Restrict type to valid button types
  disabled?: boolean;
  children: React.ReactNode; // ✅ Accepts any valid JSX content
}

const Button = ({ onClick, type, className, disabled, children }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-very-light-green font-medium p-[10px] bg-navy-blue border-none rounded-md ${className || ''}`.trim()}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;