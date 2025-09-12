"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BACKEND } from "@/lib/utils";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setError(""); 
    setIsLoading(true); 

    try {
        if (!name || !email || !password) {
            throw new Error("All fields are required");
        }

        const role = isStudent ? "STUDENT" : "STAFF";

        const res = await fetch(BACKEND + "api/v1/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role,
            }),
        });

        if (!res.ok) {
            const { message } = await res.json();
            throw new Error(message || "Signup failed");
        }

        setName("");
        setEmail("");
        setPassword("");
        setIsStudent(false);

    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mx-4 w-full max-w-md rounded-sm bg-gray-100 p-8 shadow-xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <h2 className="font-montserrat text-xl font-bold">REGISTER</h2>

          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-zinc-400 bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
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
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Must be at least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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

          <Button type="submit" className="w-full px-8" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>

          <p className="text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <Link href={"/login"} className="delay-50 hover:text-gray-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
