'use client'
import { useUserStore } from '@/utils/store';
import { IconBook, IconCircleCheck, IconCirclePlusFilled, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState  } from 'react'

interface CourseStructure {
    module_id: string;
    module_type: 'VNOVEL' | 'QUIZ';
    module_name: string;
    module_description: string;
};

interface prop {
    content: CourseStructure;
    i: number;
};
const TimelineComponent = ({content, i}: prop) => {
    const router = useRouter();
    const {getRole} = useUserStore();

    return (<li>
            { i !== 0 && <hr /> }
            <div className="timeline-middle">
                <IconCircleCheck />
            </div>
            <div className={`${ i%2 ? 'timeline-end md:text-start': 'timeline-start md:text-end'} mb-10 `}>
              <div className={`text-lg font-black flex gap-2 ${i%2?'justify-start ':'flex-row-reverse'}`}>
                <span className="mt-1">
                    {content.module_type == 'VNOVEL' && <IconBook />}
                    {content.module_type == 'QUIZ' && <IconPencil />}
                </span>
                { getRole() === 'student' ? 
                    <span onClick={() => router.push(`preview/${content.module_id}`)}>{content.module_name}</span> :
                    <span onClick={() => router.push(`/design/${content.module_id}`)}>{content.module_name}</span> }
              </div>
              <p className="max-w-md">{content.module_description}</p>
            </div>
            <hr />
          </li>)
};

 
export default function BlogPostPage({ params, }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  const [courseStructure, setCourseStructure] = useState<CourseStructure[]>([]);
  const [lessonName, setLessonName] = useState<string>('LESSON NAME');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await fetch('http://localhost:8080/all-module', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({ "lesson_id": slug }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: CourseStructure[] = (await res.json()).lessons;
        console.log(data)
        setCourseStructure(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading lessons...</div>;
  if (error) return <div className="p-4 text-center text-error">Error: {error}</div>;
 
    return (
        <section className=" flex flex-col items-center justify-center py-10">
            <h1 className="text-5xl font-black py-5">{lessonName}</h1>
            <main>
                <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                    { courseStructure.map((val, ind) => <TimelineComponent key={ind} content={val} i={ind} />) }
                    <li >
                        <hr />
                        <button onClick={() => { }} className="timeline-middle">
                            <IconCirclePlusFilled className="hover:text-accent cursor-pointer" size={32} />
                        </button>
                    </li>
                </ul>
            </main>
        </section>
    );
}

