"use client";
import { useRouter } from "next/navigation";
import { Lesson } from "@/app/page";
import { useUserStore } from "@/utils/store";
import { useEffect, useState } from "react"

export const Student = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [joinedLessons, setJoinedLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joinStatus, setJoinStatus] = useState<{[key: string]: string}>({});
  const {getId} = useUserStore();
  const router = useRouter()

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        setError(null);
        const studentId = getId();
        if (!studentId) {
            throw new Error("Student ID not found. Please log in.");
        }

        // Fetch joined and all lessons concurrently
        const [joinedLessonsRes, allLessonsRes] = await Promise.all([
            fetch('http://localhost:8080/student/lessons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: studentId }),
            }),
            fetch('http://localhost:8080/lesson/getall', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
        ]);

        if (!joinedLessonsRes.ok) throw new Error(`Failed to fetch your lessons. Status: ${joinedLessonsRes.status}`);
        if (!allLessonsRes.ok) throw new Error(`Failed to fetch available lessons. Status: ${allLessonsRes.status}`);

        const joinedData = await joinedLessonsRes.json();
        const allData = await allLessonsRes.json();
        
        const currentJoinedLessons = joinedData.lessons || [];
        const allAvailableLessons = allData.lessons || [];
        
        setJoinedLessons(currentJoinedLessons);

        const joinedLessonIds = new Set(currentJoinedLessons.map((l: Lesson) => l.lesson_id));
        const availableLessons = allAvailableLessons.filter((lesson: Lesson) => !joinedLessonIds.has(lesson.lesson_id));

        setLessons(availableLessons);

      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load lesson data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [getId]);

  const handleJoinLesson = async (lessonId: string) => {
    setJoinStatus(prev => ({...prev, [lessonId]: 'Joining...'}));
    try {
        const res = await fetch(`http://localhost:8080/join/${lessonId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ student_id: getId() }),
        });

        if (!res.ok) {
            throw new Error(`Failed to join. Server responded with status: ${res.status}`);
        }

        console.log(`Successfully sent join request for lesson: ${lessonId}`);
        setJoinStatus(prev => ({...prev, [lessonId]: 'Joined!'}));
        
        // Move lesson from available to joined list in the UI for immediate feedback
        const lessonToMove = lessons.find(l => l.lesson_id === lessonId);
        if (lessonToMove) {
            setLessons(prev => prev.filter(l => l.lesson_id !== lessonId));
            setJoinedLessons(prev => [...prev, lessonToMove]);
        }
    } catch (err: any) {
        console.error(`Error joining lesson ${lessonId}:`, err);
        setJoinStatus(prev => ({...prev, [lessonId]: 'Error'}));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 w-full">
      <div className="mx-auto space-y-12">
        {loading && <p className="text-center text-gray-500">Loading lessons...</p>}
        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        
        {!loading && !error && (
          <>
            {/* Joined Lessons Section */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Lessons</h1>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr >
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lesson Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {joinedLessons.length > 0 ? (
                            joinedLessons.map((lesson) => (
                            <tr onClick={() => router.push(`course/${lesson.lesson_id}`)} key={lesson.lesson_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lesson.lesson_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Joined
                                    </span>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">You haven't joined any lessons yet.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* Available Lessons Section */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Available Lessons</h1>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lesson Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {lessons.length > 0 ? (
                            lessons.map((lesson) => (
                            <tr key={lesson.lesson_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lesson.lesson_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => handleJoinLesson(lesson.lesson_id)}
                                    disabled={joinStatus[lesson.lesson_id] === 'Joining...' || joinStatus[lesson.lesson_id] === 'Joined!'}
                                    className={`px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 ease-in-out
                                    ${joinStatus[lesson.lesson_id] === 'Joined!' ? 'bg-green-500 cursor-not-allowed' : ''}
                                    ${joinStatus[lesson.lesson_id] === 'Error' ? 'bg-red-500 hover:bg-red-600' : ''}
                                    ${!joinStatus[lesson.lesson_id] ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                    ${joinStatus[lesson.lesson_id] === 'Joining...' ? 'bg-gray-400 cursor-wait' : ''}
                                    `}
                                >
                                    {joinStatus[lesson.lesson_id] || 'Join'}
                                </button>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No new lessons available at the moment.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// For standalone usage, you can create a default export
export default Student;
