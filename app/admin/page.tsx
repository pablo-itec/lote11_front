"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/src/lib/api";
import AdminDashboard from "@/src/components/admin/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const logged = auth.hasToken();
    if (!logged) {
      router.replace("/admin/login");
    }
    setIsLogged(logged);
    setReady(true);
  }, [router]);

  if (!ready || !isLogged) return null;

  return <AdminDashboard onLogout={() => router.replace("/admin/login")} />;
}
