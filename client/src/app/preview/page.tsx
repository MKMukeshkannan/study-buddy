'use client'

import { useUserStore } from "@/utils/store";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

type BaseElement = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type RectElement = BaseElement & { type: "rect" };
type TextElement = BaseElement & { type: "text"; text: string; fontSize: number };
type ButtonElement = BaseElement & { type: "button"; text: string; navigateTo: number };
type ImageElement = BaseElement & { type: "image"; src: string };

export type Element = RectElement | TextElement | ImageElement | ButtonElement;

const BASE_WIDTH = 800;
const BASE_HEIGHT = 480;

export default function FrameRenderer() {

  const router = useRouter();
  const {getId} = useUserStore();
  if (getId == null) {
    router.push("/login")
  }
  const [frames] = useState<Element[][]>([
        [
            {
                "height": 250,
                "id": "teacher_intro_f0",
                "src": "teacher_1.svg",
                "type": "image",
                "width": 150,
                "x": 325,
                "y": 200
            },
            {
                "fontSize": 24,
                "height": 50,
                "id": "text_intro_f0",
                "text": "Welcome! Today, we'll learn about chemical bonding.",
                "type": "text",
                "width": 500,
                "x": 150,
                "y": 80
            },
            {
                "height": 40,
                "id": "start_button_f0",
                "navigateTo": 1,
                "text": "Let's Start",
                "type": "button",
                "width": 100,
                "x": 350,
                "y": 150
            }
        ],
        [
            {
                "height": 250,
                "id": "teacher_menu_f1",
                "src": "teacher_1.svg",
                "type": "image",
                "width": 150,
                "x": 50,
                "y": 200
            },
            {
                "fontSize": 22,
                "height": 50,
                "id": "text_menu_f1",
                "text": "There are three main types. Which one first?",
                "type": "text",
                "width": 500,
                "x": 250,
                "y": 80
            },
            {
                "height": 40,
                "id": "ionic_button_f1",
                "navigateTo": 2,
                "text": "Ionic Bonds",
                "type": "button",
                "width": 150,
                "x": 350,
                "y": 150
            },
            {
                "height": 40,
                "id": "covalent_button_f1",
                "navigateTo": 3,
                "text": "Covalent Bonds",
                "type": "button",
                "width": 150,
                "x": 350,
                "y": 210
            },
            {
                "height": 40,
                "id": "metallic_button_f1",
                "navigateTo": 4,
                "text": "Metallic Bonds",
                "type": "button",
                "width": 150,
                "x": 350,
                "y": 270
            }
        ],
        [
            {
                "height": 250,
                "id": "teacher_ionic_f2",
                "src": "teacher_2.svg",
                "type": "image",
                "width": 150,
                "x": 50,
                "y": 200
            },
            {
                "height": 200,
                "id": "atom_giver_f2",
                "src": "student_1.svg",
                "type": "image",
                "width": 150,
                "x": 300,
                "y": 220
            },
            {
                "height": 200,
                "id": "atom_taker_f2",
                "src": "student_2.svg",
                "type": "image",
                "width": 150,
                "x": 550,
                "y": 220
            },
            {
                "fontSize": 20,
                "height": 50,
                "id": "text_ionic_f2",
                "text": "Ionic bonds: One atom gives an electron to another.",
                "type": "text",
                "width": 600,
                "x": 100,
                "y": 50
            },
            {
                "height": 40,
                "id": "button_menu_f2",
                "navigateTo": 1,
                "text": "Back to Menu",
                "type": "button",
                "width": 150,
                "x": 420,
                "y": 120
            }
        ],
        [
            {
                "height": 250,
                "id": "teacher_covalent_f3",
                "src": "teacher_3.svg",
                "type": "image",
                "width": 150,
                "x": 50,
                "y": 200
            },
            {
                "height": 200,
                "id": "atom_sharer1_f3",
                "src": "student_1.svg",
                "type": "image",
                "width": 150,
                "x": 375,
                "y": 220
            },
            {
                "height": 200,
                "id": "atom_sharer2_f3",
                "src": "student_1.svg",
                "type": "image",
                "width": 150,
                "x": 475,
                "y": 220
            },
            {
                "fontSize": 20,
                "height": 50,
                "id": "text_covalent_f3",
                "text": "Covalent bonds: Atoms share electrons to become stable.",
                "type": "text",
                "width": 600,
                "x": 100,
                "y": 50
            },
            {
                "height": 40,
                "id": "button_menu_f3",
                "navigateTo": 1,
                "text": "Back to Menu",
                "type": "button",
                "width": 150,
                "x": 420,
                "y": 120
            }
        ],
        [
            {
                "height": 250,
                "id": "teacher_metallic_f4",
                "src": "teacher_1.svg",
                "type": "image",
                "width": 150,
                "x": 50,
                "y": 200
            },
            {
                "fontSize": 20,
                "height": 50,
                "id": "text_metallic_f4",
                "text": "Metallic bonds are a 'sea' of electrons shared among atoms.",
                "type": "text",
                "width": 600,
                "x": 100,
                "y": 50
            },
            {
                "height": 133,
                "id": "atom_metal1_f4",
                "src": "student_2.svg",
                "type": "image",
                "width": 100,
                "x": 300,
                "y": 250
            },
            {
                "height": 133,
                "id": "atom_metal2_f4",
                "src": "student_2.svg",
                "type": "image",
                "width": 100,
                "x": 400,
                "y": 250
            },
            {
                "height": 133,
                "id": "atom_metal3_f4",
                "src": "student_2.svg",
                "type": "image",
                "width": 100,
                "x": 500,
                "y": 250
            },
            {
                "height": 40,
                "id": "button_end_f4",
                "navigateTo": 5,
                "text": "Finish Lesson",
                "type": "button",
                "width": 150,
                "x": 420,
                "y": 120
            }
        ],
        [
            {
                "height": 250,
                "id": "teacher_end_f5",
                "src": "teacher_1.svg",
                "type": "image",
                "width": 150,
                "x": 325,
                "y": 200
            },
            {
                "fontSize": 24,
                "height": 50,
                "id": "text_end_f5",
                "text": "Great work! You've learned the basics of bonding.",
                "type": "text",
                "width": 500,
                "x": 150,
                "y": 80
            },
            {
                "height": 40,
                "id": "restart_button_f5",
                "navigateTo": 0,
                "text": "Start Over",
                "type": "button",
                "width": 100,
                "x": 350,
                "y": 150
            }
        ]
    ]);

  const [currentFrame, setCurrentFrame] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });

  // Resize handler to recalc scale factors
  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setScale({
          x: clientWidth / BASE_WIDTH,
          y: clientHeight / BASE_HEIGHT,
        });
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const renderElement = (el: Element) => {
    const scaledStyle: React.CSSProperties = {
      position: "absolute",
      top: el.y * scale.y,
      left: el.x * scale.x,
      width: el.width * scale.x,
      height: el.height * scale.y,
    };

    switch (el.type) {
      case "image":
        return <img key={el.id} src={el.src} alt={el.id} style={scaledStyle} />;
      case "text":
        return (
          <p
            key={el.id}
            style={{
              ...scaledStyle,
              fontSize: el.fontSize * scale.y, // scale font size with Y
            }}
            className="text-black"
          >
            {el.text}
          </p>
        );
      case "button":
        return (
          <button
            key={el.id}
            className="btn btn-primary"
            style={scaledStyle}
            onClick={() => setCurrentFrame(el.navigateTo)}
          >
            {el.text}
          </button>
        );
      case "rect":
        return <div key={el.id} style={{ ...scaledStyle, backgroundColor: "lightblue" }} />;
      default:
        return null;
    }
  };

  return (
    <main
      ref={containerRef}
      className="relative w-full h-screen bg-white overflow-hidden border flex items-center justify-center"
    >
      <div
        className="relative bg-gray-50"
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
      >
        {frames[currentFrame].map(renderElement)}
      </div>
    </main>
  );
}

