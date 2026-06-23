"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, API_BASE } from "@/src/lib/api";
import LoginPanel from "@/src/components/admin/LoginPanel";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (!auth.hasToken()) return;
    // Verificar que el token siga siendo válido en el servidor
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
    })
      .then(r => { if (r.ok) router.replace("/admin"); else auth.clearToken(); })
      .catch(() => auth.clearToken());
  }, [router]);

  return <LoginPanel onLogin={() => router.replace("/admin")} />;
}
