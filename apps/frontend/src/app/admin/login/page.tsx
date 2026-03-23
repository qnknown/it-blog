"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setToken } from "@/lib/auth-storage";
import { getApiUrl } from "@/lib/env";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`${getApiUrl()}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as { data?: { access_token: string }; error?: { message: string } };
      if (!res.ok || !json.data?.access_token) {
        throw new Error(json.error?.message || "Помилка входу");
      }
      setToken(json.data.access_token);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-[420px] rounded-[2.5rem] bg-white p-8 sm:p-10 shadow-2xl shadow-[var(--accent)]/10 ring-1 ring-zinc-900/5 dark:bg-zinc-900/50 dark:ring-zinc-100/10">
        <h1 className="text-center text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          ВХІД.
        </h1>
        <p className="mt-3 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Авторизуйтеся для доступу до системи
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="pass">Пароль</label>
            <input
              id="pass"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

          <button type="submit" disabled={pending} className="btn btn-primary mt-2 justify-center w-full">
            {pending ? "Перевірка..." : "Увійти"}
          </button>
        </form>
      </div>
    </div>
  );
}

