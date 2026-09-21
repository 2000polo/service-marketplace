import { useState } from "react";
import { Link, useNavigate } from "react-router";

import toast from "react-hot-toast";

import type { LoginData } from "@/api/authApi";
import { useAuth } from "@/context/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();
    try {
      setIsLoading(true);
  
      await login(
        formData.email,
        formData.password
      );
  
      toast.success("Login successful");
  
      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login failed";
  
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">
          Welcome back
        </h1>

        <p className="mt-2 text-muted-foreground">
          Login to continue using the marketplace.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
        >
          {isLoading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-foreground underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;