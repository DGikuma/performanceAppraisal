import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

import DashboardLoader from "../components/DashboardLoader";
import AnimatedBackground from "../components/AnimatedBackground";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const [loading, setLoading] = useState(true);

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <Icon
        icon={
          theme === "dark"
            ? "line-md:moon-filled-to-sunny-filled-loop-transition"
            : "line-md:sunny-filled-loop-to-moon-filled-transition"
        }
        className="text-xl"
      />
    </button>
  );
};

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register } = useAuth();
  const navigate = useNavigate();

  const departments = [
    { key: "none", label: "None" },
    { key: "management", label: "Management" },
    { key: "claims", label: "Claims" },
    { key: "underwriting", label: "Underwriting" },
    { key: "ict", label: "ICT" },
    { key: "finance_admin", label: "Finance & Administration" },
    { key: "operations", label: "Operations" },
    { key: "hr", label: "HR" },
    { key: "marketing", label: "Marketing" },
    { key: "business_development", label: "Business Development" },
    { key: "legal", label: "Legal" },
    { key: "sales", label: "Sales" },
    { key: "customer_service", label: "Customer Service" },
    { key: "procurement", label: "Procurement" },
    { key: "product_management", label: "Product Management" },
    { key: "project_management", label: "Project Management" },
    { key: "data_analysis", label: "Data Analysis" },
  ];

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

    if (!name || !email || !password || !confirmPassword || !department) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!passwordPattern.test(password)) {
      setError("Password must be at least 6 characters and include uppercase, lowercase, and a special character.");
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password, department, role: "employee" });
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 5000);
        return () => clearTimeout(timer);
    }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/employee");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 overflow-hidden z-0">
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>
       {loading && <DashboardLoader />}
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center">
          </div>
          <h2 className="text-3xl font-bold text-base-content mt-4">Create Your Account</h2>
          <p className="text-lg text-base-content/60">Join the Performance Appraisal Portal</p>
        </div>

        <div className="card shadow-lg bg-base-100">
          <div className="card-body space-y-4">
            {error && <div className="alert alert-error text-sm">{error}</div>}
            {success && <div className="alert alert-success text-sm">Registration successful! Redirecting...</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Full Name</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Email Address</span>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Department</span>
                </div>
                <select
                  className="select select-bordered"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="" disabled>Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept.key} value={dept.key}>{dept.label}</option>
                  ))}
                </select>
              </label>

              <label className="form-control w-full relative">
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="input input-bordered w-full pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-11 right-3 text-xl text-base-content/70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
                </button>
              </label>

              <label className="form-control w-full relative">
                <div className="label">
                  <span className="label-text">Confirm Password</span>
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="input input-bordered w-full pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute top-11 right-3 text-xl text-base-content/70"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  title={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  <Icon icon={showConfirm ? "mdi:eye-off" : "mdi:eye"} />
                </button>
              </label>

              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
              >
                Create Account
              </button>
            </form>
          </div>
        </div>

        <p className="text-sm text-center text-base-content/70">
          Already have an account?{" "}
          <RouterLink to="/login" 
          className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition-all"
          >
            Sign in
          </RouterLink>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
