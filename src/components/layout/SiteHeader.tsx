"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import ProfileModal from "./ProfileModal";

// Header reutilizable (logo + nav + admin + perfil) para páginas fuera de la home.
export default function SiteHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <>
      <Navbar onProfileClick={() => setProfileOpen(true)} />
      <div className="h-[100px]" />
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
