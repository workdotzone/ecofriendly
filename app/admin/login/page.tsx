"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Mail, ShieldCheck, UserPlus } from "lucide-react";

type SetupStatus = {
  registrationOpen: boolean;
  authConfigured: boolean;
  setupKeyConfigured: boolean;
};

async function fetchSetupStatus(): Promise<SetupStatus> {
  const response = await fetch("/api/admin/setup", { cache: "no-store" });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to check admin setup.");
  }
  return {
    registrationOpen: data.registrationOpen === true,
    authConfigured: data.authConfigured === true,
    setupKeyConfigured: data.setupKeyConfigured === true,
  };
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);

  useEffect(() => {
    let active = true;
    fetchSetupStatus()
      .then((status) => {
        if (active) setSetupStatus(status);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setSetupStatus(null);
          setError(requestError instanceof Error ? requestError.message : "Unable to check admin setup.");
        }
      })
      .finally(() => {
        if (active) setCheckingSetup(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const retrySetupCheck = async () => {
    setCheckingSetup(true);
    setError("");
    try {
      setSetupStatus(await fetchSetupStatus());
    } catch (requestError) {
      setSetupStatus(null);
      setError(requestError instanceof Error ? requestError.message : "Unable to check admin setup.");
    } finally {
      setCheckingSetup(false);
    }
  };

  const registering = setupStatus?.registrationOpen === true;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(registering ? "/api/admin/setup" : "/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registering ? { email, password, setupKey } : { email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (registering && (response.status === 403 || response.status === 409)) {
          setSetupStatus(await fetchSetupStatus());
        }
        throw new Error(data.message || (registering ? "Registration failed." : "Invalid email or password."));
      }

      if (registering) {
        setSetupStatus((current) => current ? { ...current, registrationOpen: false } : current);
        setPassword("");
        setSetupKey("");
        setNotice("Admin account created. Sign in with your new email and password.");
      } else {
        router.replace("/admin");
        router.refresh();
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to complete the request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !loading
    && !checkingSetup
    && setupStatus !== null
    && setupStatus.authConfigured
    && (!registering || setupStatus.setupKeyConfigured);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <section className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl" aria-labelledby="admin-auth-heading">
        <div className="relative bg-gray-900 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-gray-800 bg-green-600 shadow-lg">
            {registering ? <UserPlus size={30} className="text-white" /> : <ShieldCheck size={32} className="text-white" />}
          </div>
          <h1 id="admin-auth-heading" className="text-2xl font-bold text-white">
            {checkingSetup ? "Admin Panel" : registering ? "Create Admin Account" : "Admin Sign In"}
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            {registering ? "One-time setup for the first administrator" : "Secure access for authorized administrators"}
          </p>
        </div>

        <div className="p-8">
          {checkingSetup && (
            <p className="mb-6 flex items-center justify-center gap-2 text-sm text-gray-600" role="status">
              <Loader2 className="animate-spin" size={18} /> Checking secure setup…
            </p>
          )}

          {registering && setupStatus && !setupStatus.setupKeyConfigured && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800" role="alert">
              <p>
                Initial registration is locked. Add a random <code>ADMIN_SETUP_KEY</code> of at least 32 characters to the server environment and restart the app.
              </p>
              <button
                type="button"
                onClick={retrySetupCheck}
                disabled={checkingSetup}
                className="mt-3 font-semibold underline disabled:opacity-60"
              >
                I restarted the app — check setup again
              </button>
            </div>
          )}

          {setupStatus?.registrationOpen && (
            <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
              Initial registration is available only until the first admin is created. Complete setup from a trusted device before sharing this site publicly.
            </p>
          )}

          {!setupStatus?.authConfigured && !checkingSetup && setupStatus && (
            <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800" role="alert">
              Admin authentication is not configured. Set a random <code>JWT_SECRET</code> of at least 32 characters on the server, then reload this page.
            </p>
          )}

          {error && (
            <p className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="mb-6 rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm text-green-800" role="status">
              {notice}
            </p>
          )}

          {!setupStatus && !checkingSetup ? (
            <button
              type="button"
              onClick={retrySetupCheck}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Retry setup check
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {registering && (
                <div>
                  <label htmlFor="admin-setup-key" className="mb-2 block text-sm font-semibold text-gray-700">
                    One-time setup key
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3.5 text-gray-400" size={18} aria-hidden="true" />
                    <input
                      id="admin-setup-key"
                      name="setupKey"
                      type="password"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      maxLength={256}
                      required
                      value={setupKey}
                      onChange={(event) => setSetupKey(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your server setup key"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} aria-hidden="true" />
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-green-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} aria-hidden="true" />
                  <input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete={registering ? "new-password" : "current-password"}
                    minLength={registering ? 12 : 1}
                    maxLength={72}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-green-500"
                    placeholder={registering ? "At least 12 characters" : "Enter your password"}
                  />
                </div>
                {registering && <p className="mt-2 text-xs text-gray-500">Use at least 12 characters. A longer passphrase is recommended.</p>}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-bold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? <Loader2 className="animate-spin" size={20} />
                  : registering && !setupStatus?.setupKeyConfigured
                    ? "Setup Key Required"
                    : registering
                      ? "Create Admin Account"
                      : "Sign In Securely"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
