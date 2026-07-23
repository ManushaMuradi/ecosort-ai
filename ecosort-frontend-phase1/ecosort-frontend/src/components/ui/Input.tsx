import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

/**
 * Labeled input with built-in error/hint slots. Wires aria-describedby
 * and aria-invalid automatically so screen readers announce validation
 * errors — this is what "accessibility best practices" means concretely
 * for a form field, not just visual styling.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "h-10 rounded-md border px-3 text-sm text-zinc-900 placeholder:text-zinc-400",
            "transition-shadow focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1",
            error ? "border-red-300" : "border-zinc-300 hover:border-zinc-400",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="text-sm text-zinc-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
