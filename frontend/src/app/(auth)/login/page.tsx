"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BACKEND } from "@/lib/utils";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(false); // for the checkbox
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); 

     try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const role = isStudent ? "STUDENT" : "STAFF";

    const res = await fetch(BACKEND + "api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
        credentials: "include", // only if backend uses cookies/sessions
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Login failed");
      }

      const data = await res.json();

      // Example: save JWT in localStorage
      localStorage.setItem("token", data.token);

      // Clear fields
      setEmail("");
      setPassword("");
      setIsStudent(false);

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center h-screen items-center">
      <div className="bg-gray-100 rounded-sm max-w-md w-full p-8 shadow-xl mx-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <h2 className="font-bold font-montserrat text-xl">LOGIN</h2>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-zinc-400 bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-zinc-400 bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="flex w-full items-center justify-between pr-2">
            <label htmlFor="role-checkbox" className="text-sm">
              I'm a <span className="font-semibold">Student</span>
            </label>
            <input
              id="role-checkbox"
              type="checkbox"
              checked={isStudent}
              onChange={(e) => setIsStudent(e.target.checked)}
              className="h-4 w-4"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full px-8">
            Submit
          </Button>

          <p className="text-sm">
            <span className="text-gray-400">Don't have an account? </span>
            <Link
              href={"/register"}
              className="delay-50 hover:text-gray-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
