"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth-storage";

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ok, setOk] = useState(() => pathname?.startsWith("/admin/login") ?? false);

  useEffect(() => {
    if (pathname?.startsWith("/admin/login")) {
      setOk(true);
      return;
    }
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    setOk(true);
  }, [pathname, router]);

  if (!ok) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-zinc-500">
        Перевірка доступу…
      </div>
    );
  }

  return <>{children}</>;
}
