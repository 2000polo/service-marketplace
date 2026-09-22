import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, MapPin } from "lucide-react";
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

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      await login(formData.email, formData.password);

      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Container holding left visual & right form */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center p-4 lg:p-8">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-border/40 bg-card/20 shadow-2xl backdrop-blur-xl lg:grid-cols-2 lg:p-4">
          
          {/* Left Visual Side (Matching Reference Hero Card) */}
          <div className="relative hidden flex-col items-center justify-end overflow-hidden rounded-2xl bg-gradient-to-b from-primary/20 via-background/60 to-background p-8 lg:flex lg:min-h-[600px]">
            {/* Soft Ambient Radial Glow */}
            <div className="absolute top-1/3 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl" />

            <div className="z-10 flex flex-col items-center text-center">
              {/* Logo / Icon */}
              <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-xl mr-2 mb-2">
                {/* <MapPin className="h-7 w-7" /> */}
                S
              </div>

              {/* Branding Header */}
              <h2 className="text-2xl font-bold tracking-tight">ServiceHub</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Connecting you with trusted local service providers instantly.
              </p>
            </div>
          </div>

          {/* Right Form Side */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
            <div className="mx-auto w-full max-w-sm">
              
              {/* Title Header */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your details to log in to your account
                </p>
              </div>

              {/* Social Login Buttons */}
              {/* <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/50 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/50 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.67-.82 1.13-1.96.99-3.09-1 .04-2.22.67-2.92 1.49-.62.72-1.17 1.88-.1 1.02 3.02 1.03.04 2.23-.62 2.95-1.42z" />
                  </svg>
                  Apple
                </button>
              </div> */}

              {/* Divider */}
              {/* <div className="relative my-6 flex items-center justify-center">
                <div className="w-full border-t border-border/50" />
                <span className="absolute bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
                  or
                </span>
              </div> */}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border/60 bg-background/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-border/60 bg-background/50 px-3.5 py-2.5 pr-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 shadow-md shadow-primary/10"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>

              {/* Footer link */}
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-foreground underline underline-offset-4 hover:text-primary"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;