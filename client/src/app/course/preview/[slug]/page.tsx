'use client'

import React, { use, useEffect, useLayoutEffect, useRef, useState } from "react";

type BaseElement = { id: string; x: number; y: number; width: number; height: number; };
type RectElement = BaseElement & { type: "rect" };
type TextElement = BaseElement & { type: "text"; text: string; fontSize: number };
type ButtonElement = BaseElement & { type: "button"; text: string; navigateTo: number };
type ImageElement = BaseElement & { type: "image"; src: string };

export type Element = RectElement | TextElement | ImageElement | ButtonElement;

const BASE_WIDTH = 800;
const BASE_HEIGHT = 480;

const App = ({ params, }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params)
  const [frames, setFrames] = useState<Element[][]>([[]]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`http://localhost:8080/mod/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch items");
        const data: Element[][] = (await res.json()).modules.module_data;
        setFrames(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative w-full h-screen bg-white overflow-hidden border flex items-center justify-center"
    >
      <div
        className="relative bg-gray-50"
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
      >
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {frames[currentFrame].map(renderElement)}
      </div>
    </main>
  );
};

export default App;
