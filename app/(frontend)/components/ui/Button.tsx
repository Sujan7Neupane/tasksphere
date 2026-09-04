type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
};

const Button = ({
  children,
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn btn-primary rounded-md ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
