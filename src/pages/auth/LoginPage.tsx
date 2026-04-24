import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(form.email, form.password);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-stretch gap-0 px-4 py-10 md:grid-cols-2 md:gap-10 md:px-6 md:py-16">
        {/* Hero side */}
        <div className="relative hidden overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-sm md:block">
          <img
            src="/images/hero.png"
            alt="School restaurant"
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/75 via-slate-950/35 to-primary-900/30" />
          <div className="relative flex h-full flex-col justify-end p-10">
            <div className="max-w-md">
              <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur">
                School Restaurant
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                Plan meals, manage menus, and reserve in seconds.
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Sign in to access meal schedules, reservations, and administration tools based on your role.
              </p>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="flex items-center">
          <div className="relative w-full">
            {/* Subtle background accents */}
            <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent-food/10 blur-3xl" />

            <div className="relative mx-auto w-full max-w-md space-y-6">
              {/* Mobile hero (top) */}
              <div className="md:hidden">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-sm">
                  <img
                    src="/images/hero.png"
                    alt="School restaurant"
                    className="h-44 w-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-950/30 to-primary-900/30" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xs font-semibold text-white/90">School Restaurant</p>
                    <p className="mt-1 text-sm font-medium text-white">Sign in to continue</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
                <p className="text-sm text-slate-600">Use your school account to access the platform.</p>
              </div>

              <Card className="p-8 shadow-xl border-slate-200/50">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <Input
                    label="Email address"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@school.edu"
                    autoComplete="email"
                    required
                  />

                  <div className="space-y-1">
                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2">
                      <div className="flex">
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="ml-3 text-sm font-medium text-red-800">{error}</p>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full py-4 text-lg" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="mr-2 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>
              </Card>

              <p className="text-center text-sm text-slate-500">
                Need an account?{" "}
                <button className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Contact administration
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}