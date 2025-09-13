"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";

export default function Home() {


  const router = useRouter();
  const {user, resetUser, } = useUserStore();

  useEffect(() => {
    if (user) {
        resetUser();
    }
  }, [user, router]);

  return <h1>YOU ARE LOGGED OUT</h1>
}
