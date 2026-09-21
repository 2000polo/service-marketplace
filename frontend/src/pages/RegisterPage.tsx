import { useState } from "react";
import { Link, useNavigate } from "react-router";

import toast from "react-hot-toast";

import {
  registerUser,
  type RegisterData,
} from "@/api/authApi";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    role: "customer",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      const data = await registerUser(formData);

      toast.success(data.message || "Registration successful");

      navigate("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">
          Create an account
        </h1>

        <p className="mt-2 text-muted-foreground">
          Create your account to find or provide services.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium"
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="John Doe"
          />
        </div>

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
            minLength={6}
            className="w-full rounded-md border px-3 py-2"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium"
          >
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2"
            placeholder="+91 9876543210"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="mb-2 block text-sm font-medium"
          >
            Account type
          </label>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="customer">
              Customer
            </option>

            <option value="provider">
              Service Provider
            </option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
        >
          {isLoading
            ? "Creating account..."
            : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-foreground underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;