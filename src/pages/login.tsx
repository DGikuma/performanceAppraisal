import { useState, useEffect, FC } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AnimatedBackground from "../components/AnimatedBackground";
import DashboardLoader from "../components/DashboardLoader";
import ThemeToggle from "../components/themeToggle";
import { useToast } from "../components/ui/use-toast";

// Validation schema
const schema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const LoginPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched", // show error when input is touched and blurred
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(data.email, data.password);

      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
        variant: "success",
        duration: 3000,
        shortTimeout: true,
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
        duration: 4000,
        shortTimeout: true,
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "supervisor":
          navigate("/supervisor");
          break;
        default:
          navigate("/employee");
      }
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 overflow-hidden z-0">
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>
      {loading && <DashboardLoader />}

      {/* Theme toggle in top-right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-6">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-base-content">Performance Appraisal Portal</h2>
        <p className="mt-2 text-lg text-base-content/70">Sign in to access your dashboard</p>
      </div>
        <div className="card bg-base-100 
        shadow-md border-2 border-primary rounded-xl w-full max-w-lg min-h-[24rem]">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control relative">
              <label className="label">
                <span className="label-text">
                  Email <span className="text-error">*</span>
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-base-content/70 text-xl">
                  <Icon icon="mdi:account-outline" />
                </span>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className={`input input-bordered pl-10 w-full ${
                    errors.email ? "border-error focus:outline-error" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="form-control relative">
              <label className="label">
                <span className="label-text">
                  Password <span className="text-error">*</span>
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-base-content/70 text-xl">
                  <Icon icon="mdi:lock-outline" />
                </span>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`input input-bordered pr-10 pl-10 w-full ${
                    errors.password ? "border-error focus:outline-error" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 inset-y-0 flex items-center text-xl text-base-content/70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

              <div className="flex justify-between text-sm">
                <RouterLink to="/forgot-password" className="link link-primary">
                  Forgot password?
                </RouterLink>
              </div>

              <button
                type="submit"
                className={`btn w-full ${isSubmitting ? "loading" : "btn-primary hover:bg-blue-500/80"} transition-colors duration-200`}
                disabled={isSubmitting}
              >
                Sign In
              </button>

            </form>
          </div>
        </div>

        <div className="text-center text-sm text-base-content/70">
          Don't have an account?{" "}
        <RouterLink
          to="/register"
          className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition-all"
        >
          Create an account
        </RouterLink>
        </div>
        <footer className="text-center text-xl text-base-content/60">
          <span className="text-blue-500 font-bold text-xl">
            Birdview Insurance
          </span>
          . © {new Date().getFullYear()} All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
