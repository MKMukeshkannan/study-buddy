"use client";

import { useState, FC, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

const Register: FC = () => {
  const router = useRouter(); 

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const role = isStudent ? 'student' : 'teacher';

    const user = {
      name,
      email,
      password,
      role,
      profile_image_url: ""
    };

    try {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      interface ApiResponse {
        error?: string;
        message?: string;
      }
      
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess('Registration successful! Redirecting to login...');
      console.log('Success:', data);
      
      setTimeout(() => {
        router.push('/login'); 
      }, 1500); 

    } catch (err: any) {
      setError(err.message);
      console.error('Failed to register:', err);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">Create an Account</h1>
      
      <form onSubmit={handleSubmit} className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        {error && <div className="alert alert-error mb-4">{error}</div>}
        {success && <div className="alert alert-success mb-4">{success}</div>}

        <label className="label">Name</label>
        <input
          type="text"
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          required
        />

        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />

        <fieldset className="flex justify-between mt-4">
          <label className="label">Are you a student?</label>
          <input
            type="checkbox"
            checked={isStudent}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setIsStudent(e.target.checked)}
            className="toggle toggle-xs"
          />
        </fieldset>

        <button type="submit" className="btn btn-neutral mt-4 w-full">Register</button>
      </form>
    </main>
  );
};

export default Register;
