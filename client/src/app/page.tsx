'use client'

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconHammer, IconHome, IconLighter, IconPlus, IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import { useUserStore } from "@/utils/store";
import Student from "@/page/Student";
import StudentProgressDashboard from "@/page/StudDash";
import AggregateAnalyticsDashboard from "@/page/TeachDash";


export default function Page() {

  const [mounted, setMounted] = useState(false);
  const [ currentPage, setCurrentPage ] = useState<'home' | 'course' | 'setting'>('home');
  const router = useRouter();
  const {getRole, getId} = useUserStore()

  useEffect(() => {
    if (!getId()) { router.push('/login'); }
  }, [getId, router]);

  useEffect(() => {
    setMounted(true); // Once the component is mounted, update state
  }, []);

  if (!mounted) return null; // Don't render anything on the server

  if (!getId()) {
    return <div>Redirecting...</div>;
  }

  return (
    <section className="flex min-h-screen bg-gray-100">
        <aside className="bg-white p-5 rounded-r-xl ">
            <a className="btn btn-ghost text-xl font-black">STUDY BUDDY</a>

            <ul className="menu w-56 mt-10 space-y-2">
              <li onClick={() => setCurrentPage('home')}>
                <a className={`${currentPage === 'home' && "menu-active"}   `}>
                    <IconHome size={14}/>
                    Home
                </a>
              </li>
              <li onClick={() => setCurrentPage('course')}>
                <a className={`${currentPage === 'course' && "menu-active"}   `}>
                    <IconHammer size={14}/>
                    My Courses
                </a>
              </li>
              {
                  getRole() === 'student' && 
              <li onClick={() => router.push('/flash')}>
                <a className={``}>
                    <IconLighter size={14}/>
                    Flash Card 
                </a>
              </li>
              }
              <li onClick={() => setCurrentPage('setting')}>
                <a className={`${currentPage === 'setting' && "menu-active"}   `}>
                    <IconSettings size={14}/>
                    Settings 
                </a>
              </li>
            </ul>

        </aside>
        <section className="w-full flex flex-col h-screen">
            <nav className="navbar bg-base-100 shadowsm">
                <div className="flex-1">
                  <a className="btn btn-ghost text-xl"></a>
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS Navbar component"
                          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                      </div>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                      <li>
                        <a className="justify-between">Profile<span className="badge">New</span>
                        </a>
                      </li>
                      <li><a>Settings</a></li>
                      <li><a href="login">Logout</a></li>
                    </ul>
                  </div>
                </div>
            </nav>
            <main className="p-5 flex h-0 flex-1 ">
                {currentPage === 'home' && getRole() === 'teacher' && <AggregateAnalyticsDashboard />}
                {currentPage === 'home' && getRole() === 'student' && <StudentProgressDashboard />}

                {currentPage === 'course' && getRole() === 'teacher' && <Course />}
                {currentPage === 'course' && getRole() === 'student' && <Student />}
            </main>
        </section>
    </section>
  );
}


export type Lesson = { lesson_id: string; lesson_name: string; teacher_id: string; subject: string; };
function Course() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {getRole, getId} = useUserStore()

  // MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLesson, setNewLesson] = useState({
    lesson_name: '',
    subject: '',
  });

  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await fetch('http://localhost:8080/lesson/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "teacher_id": getId() }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: Lesson[] = (await res.json()).lessons;
        console.log(data)
        setLessons(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLesson(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { getId } = useUserStore.getState();
      const res = await fetch('http://localhost:8080/lesson/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newLesson, teacher_id: getId() }),
      });
      if (!res.ok) throw new Error('Failed to create lesson');
    } catch (error) {
      console.error(error);
    }

    setIsModalOpen(false); // Close modal
    setNewLesson({ lesson_name: '', subject: '' }); // Reset form
  };

  if (loading) return <div className="p-4 text-center">Loading lessons...</div>;
  if (error) return <div className="p-4 text-center text-error">Error: {error}</div>;

  return (
    <section className="p-4 bgwhite rounded-2xl flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lessons.map((l) => (
          <article
            key={l.lesson_id}
            className="card shadow-md hover:shadow-lg transition-shadow duration-150 select-none bg-white"
          >
            <div className="card-body">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="card-title text-base md:text-lg">{l.lesson_name}</h3>
                  <p className="text-sm opacity-80 mt1">{l.subject}</p>
                </div>
              </div>

              <div className="card-actions justify-between mt-4">
                <button
                  className="btn btn-sm"
                  onClick={() => router.push(`course/${l.lesson_id}`)}
                >
                  Open
                </button>
              </div>
            </div>
          </article>
        ))}
        <article
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center card shadow-md hover:shadow-lg transition-shadow duration-150 cursorpointer bg-white cursor-pointer">
            <IconPlus size={48}/>
        </article>
      </div>

      {lessons.length === 0 && (
        <div className="mt-8 text-center text-sm opacity-70">No lessons to display</div>
      )}

      <dialog id="add_lesson_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add a New Lesson</h3>
          <form onSubmit={handleCreateLesson}>
            <div className="form-control py-4 space-y-4">
              <input
                type="text"
                name="lesson_name"
                placeholder="Lesson Name"
                className="input input-bordered w-full"
                value={newLesson.lesson_name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="input input-bordered w-full"
                value={newLesson.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </dialog>

    </section>
  );
}

