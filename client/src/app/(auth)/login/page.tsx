
export default function Login() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen ">
        <h1 className="text-4xl font-bold text-center mb-10">Welcome!!!</h1>
        <form className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="Email" />
        
          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Password" />

          <fieldset className="flex justify-between mt4">
            <label className="label">Are you a student?</label>
            <input type="checkbox" defaultChecked className="toggle toggle-xs" />
          </fieldset>
        
          <button type="submit" className="btn btn-neutral mt-4">Login</button>
        </form>
    </main>
  );
}
