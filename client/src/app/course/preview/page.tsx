'use client'
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
  const [frames] = useState<Element[][]>([
    [
      {
        height: 250,
        id: "teacher_intro_f0",
        src: "teacher_1.svg",
        type: "image",
        width: 150,
        x: 325,
        y: 200,
      } as ImageElement,
      {
        fontSize: 24,
        height: 50,
        id: "text_intro_f0",
        text: "Welcome! Today, we'll learn about chemical bonding.",
        type: "text",
        width: 500,
        x: 150,
        y: 80,
      } as TextElement,
      {
        id: "btn_next",
        type: "button",
        text: "Next",
        navigateTo: 1,
        x: 400,
        y: 420,
        width: 100,
        height: 40,
      } as ButtonElement,
    ],
    [
      {
        fontSize: 24,
        height: 50,
        id: "text_frame2",
        text: "Frame 2: Let's dive deeper!",
        type: "text",
        width: 400,
        x: 200,
        y: 100,
      } as TextElement,
    ],
  ]);
 console.log(frames)

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

