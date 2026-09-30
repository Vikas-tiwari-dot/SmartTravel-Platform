import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Milestone, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn({ email, password });
      notify("Welcome back!", { tone: "green" });
      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-amber">
            <Milestone size={19} strokeWidth={2.25} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">TripLink</span>
        </Link>

        <div className="rounded-2xl border border-line bg-paper p-7 shadow-[var(--shadow-stone)]">
          <h1 className="font-display text-2xl font-bold text-ink">Log in</h1>
          <p className="mt-1.5 text-sm text-ink/50">Pick up your commute where you left it.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              error={error}
              required
            />
            <Button type="submit" variant="amber" size="md" className="w-full" disabled={loading} icon={ArrowRight} iconPosition="right">
              {loading ? "Logging in…" : "Log in"}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-ink/40">
            Seeded demo account: demo@TripLink.app / demopass123
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-ink/55">
          New to TripLink?{" "}
          <Link to="/signup" className="font-semibold text-teal hover:text-teal-dark">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
