"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  label?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const PasswordInput = ({
  label = "Password",
  error,
  name,
  id,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-control">
      <label htmlFor={id ?? name} className="label mb-1">
        <span className="label-text">{label}</span>
      </label>

      <div className="relative">
        <input
          id={id ?? name}
          name={name}
          type={showPassword ? "text" : "password"}
          className={`input input-bordered w-full rounded-md pr-12 ${
            error ? "input-error" : ""
          }`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && <p className="text-error mt-1 text-sm">{error}</p>}
    </div>
  );
};

export default PasswordInput;
