"use client"
import { useUserStore } from "@/utils/store";
import { IconBook, IconCircleCheck, IconCirclePlusFilled, IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface CourseStructure {
    type: 'quiz' | 'learn';
    title: string;
    description: string;
    progress:  {
        before: boolean;
        current_module: boolean;
        after: boolean;
    };
};


interface prop {
    content: CourseStructure;
    i: number;
};
const TimelineComponent = ({content, i}: prop) => {
    return (<li>
            { i !== 0 && <hr /> }
            <div className="timeline-middle">
                <IconCircleCheck />
            </div>
            <div className={`${ i%2 ? 'timeline-end md:text-start': 'timeline-start md:text-end'} mb-10 `}>
              <div className={`text-lg font-black flex gap-2 ${i%2?'justify-start ':'flex-row-reverse'}`}>
                <span className="mt-1">
                    {content.type == 'learn' && <IconBook />}
                    {content.type == 'quiz' && <IconPencil />}
                </span>
                <span>{content.title}</span>
              </div>
              <p className="max-w-md">{content.description}</p>
            </div>
            <hr />
          </li>)
};

export default function Page() {

    const router = useRouter();
    const {getId} = useUserStore();
    if (getId == null) {
      router.push("/login")
    }

    const courses: CourseStructure[] = [
      {
        type: "learn",
        title: "Introduction to Programming",
        description: "Learn the basics of programming, variables, and control flow.",
        progress: {
          before: true,
          current_module: false,
          after: false,
        },
      },
      {
        type: "learn",
        title: "Variables & Data Types Quiz",
        description: "Test your understanding of variables and data types.",
        progress: {
          before: true,
          current_module: false,
          after: false,
        },
      },
      {
        type: "learn",
        title: "Functions and Loops",
        description: "Understand how to write reusable code with functions and control repetition using loops.",
        progress: {
          before: false,
          current_module: true,
          after: false,
        },
      },
      {
        type: "quiz",
        title: "Functions & Loops Quiz",
        description: "Assess your knowledge of functions, loops, and problem-solving.",
        progress: {
          before: false,
          current_module: false,
          after: true,
        },
      },
      {
        type: "learn",
        title: "Object-Oriented Basics",
        description: "Dive into classes, objects, and the principles of OOP.",
        progress: {
          before: false,
          current_module: false,
          after: true,
        },
      },
      {
        type: "learn",
        title: "OOP Concepts Quiz",
        description: "Check your grasp on OOP concepts like encapsulation and inheritance.",
        progress: {
          before: false,
          current_module: false,
          after: true,
        },
      },
      {
        type: "learn",
        title: "Introduction to Programming",
        description: "Learn the basics of programming, variables, and control flow.",
        progress: {
          before: true,
          current_module: false,
          after: false,
        },
      },
      {
        type: "quiz",
        title: "Variables & Data Types Quiz",
        description: "Test your understanding of variables and data types.",
        progress: {
          before: true,
          current_module: false,
          after: false,
        },
      },
      {
        type: "learn",
        title: "Functions and Loops",
        description: "Understand how to write reusable code with functions and control repetition using loops.",
        progress: {
          before: false,
          current_module: true,
          after: false,
        },
      },
      {
        type: "quiz",
        title: "Functions & Loops Quiz",
        description: "Assess your knowledge of functions, loops, and problem-solving.",
        progress: {
          before: false,
          current_module: false,
          after: true,
        },
      },
      {
        type: "learn",
        title: "Object-Oriented Basics",
        description: "Dive into classes, objects, and the principles of OOP.",
        progress: {
          before: false,
          current_module: false,
          after: true,
        },
      },
      {
        type: "quiz",
        title: "OOP Concepts Quiz",
        description: "Check your grasp on OOP concepts like encapsulation and inheritance.",
        progress: {
          before: false,
          current_module: false,
          after: true,
        },
      },
    ];

    return (
        <section className=" flex flex-col items-center justify-center py-10">
            <h1 className="text-5xl font-black py-5">COURSE BUIDER</h1>
            <main>
                <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                    { courses.map((val, ind) => <TimelineComponent key={ind} content={val} i={ind} />) }
                    <li >
                        <hr />
                        <div className="timeline-middle">
                            <IconCirclePlusFilled className="hover:text-accent cursor-pointer" size={32} />
                        </div>
                    </li>
                </ul>
            </main>
        </section>
    );
};
