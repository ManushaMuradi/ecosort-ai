"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { registerSchema, type RegisterFormValues } from "@/lib/validators/authSchemas";
import type { ApiResponse } from "@/types/api.types";

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    try {
      await registerUser({ ...values, phone: values.phone || undefined });
      toast.success("Account created — please sign in");
      router.push("/login");
    } catch (err) {
      const message =
        (err as AxiosError<ApiResponse<unknown>>).response?.data?.message ??
        "Unable to create your account. Please try again.";
      setServerError(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <Input
        label="Full name"
        autoComplete="name"
        required
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        hint="At least 8 characters, with a letter and a number"
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-2 w-full">
        Create account
      </Button>
    </form>
  );
}
