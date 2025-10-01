// components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button = ({ children, loading, className = "", ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full py-2 px-4 rounded-md text-white font-medium transition 
        ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} 
        ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
