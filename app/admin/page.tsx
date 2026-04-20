"use client";

import { useState, useEffect } from "react";
import { auth } from "@/src/lib/api";
import LoginPanel      from "@/src/components/admin/LoginPanel";
import AdminDashboard  from "@/src/components/admin/AdminDashboard";

export default function AdminPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [ready, setReady]       = useState(false);

  useEffect(() => {
    setIsLogged(auth.hasToken());
    setReady(true);
  }, []);

  if (!ready) return null;

  return isLogged
    ? <AdminDashboard onLogout={() => setIsLogged(false)} />
    : <LoginPanel onLogin={() => setIsLogged(true)} />;
}
