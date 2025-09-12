"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
      // login logic
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again later.");
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
