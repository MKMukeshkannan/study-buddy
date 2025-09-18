'use client'

import React, { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';

// Simplified Canva-like React component (no undo/redo)

export default function CanvaLikeApp() {
  const canvasRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const pushChange = (updater) => {
    setElements(old => {
      const next = typeof updater === 'function' ? updater(old) : updater;
      return next;
    });
  };

  // Basic element creators
  const addRect = () => {
    const e = {
      id: uuidv4(),
      type: 'rect',
      x: 40,
      y: 40,
      width: 160,
      height: 100,
    };
    pushChange(prev => [...prev, e]);
    setSelectedId(e.id);
  };

  const addText = () => {
    const e = {
      id: uuidv4(),
      type: 'text',
      x: 60,
      y: 60,
      width: 240,
      height: 60,
      text: 'Double-click to edit',
      fontSize: 18,
    };
    pushChange(prev => [...prev, e]);
    setSelectedId(e.id);
  };

  const addImage = (file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const e = {
        id: uuidv4(),
        type: 'image',
        x: 80,
        y: 80,
        width: 220,
        height: 140,
        src: ev.target.result,
      };
      pushChange(prev => [...prev, e]);
      setSelectedId(e.id);
    };
    reader.readAsDataURL(file);
  };

  const updateElement = (id, props) => {
    pushChange(prev => prev.map(el => el.id === id ? { ...el, ...props } : el));
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    pushChange(prev => prev.filter(e => e.id !== selectedId));
    setSelectedId(null);
  };

  const exportPNG = async () => {
    if (!canvasRef.current) return;
    const node = canvasRef.current;
    const canvas = await html2canvas(node, { useCORS: true });
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'canvas-export.png';
    a.click();
  };

  return (
    <div className="h-screen flex gap-4 p-4 bg-gray-100">
      {/* Left toolbar */}
      <aside className="w-56 bg-white rounded-2xl shadow p-3 flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Tools</h3>
        <div className="flex flex-col gap-2">
          <button onClick={addRect} className="btn">Add Rectangle</button>
          <button onClick={addText} className="btn">Add Text</button>
          <label className="btn cursor-pointer">
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && addImage(e.target.files[0])}
            />
          </label>
          <button onClick={exportPNG} className="btn">Export PNG</button>
          <button onClick={deleteSelected} className="btn-danger">Delete</button>
        </div>

        <div className="mt-3">
          <h4 className="text-sm font-medium">Layers</h4>
          <div className="max-h-48 overflow-auto mt-2 border rounded p-2">
            {elements.slice().reverse().map(el => (
              <div
                key={el.id}
                className={`p-2 rounded flex items-center justify-between cursor-pointer ${selectedId === el.id ? 'bg-indigo-50' : ''}`}
                onClick={() => setSelectedId(el.id)}
              >
                <div className="text-sm">{el.type} — {el.id.slice(0, 6)}</div>
                <div className="text-xs opacity-60">{Math.round(el.x)},{Math.round(el.y)}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Canvas area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 bg-white rounded-2xl shadow relative p-4">
          <div
            ref={canvasRef}
            className="relative bg-white w-full h-full border border-dashed border-gray-200"
            style={{ minHeight: 480 }}
            onClick={() => setSelectedId(null)}
          >
            {elements.map(el => (
              <Rnd
                key={el.id}
                size={{ width: el.width, height: el.height }}
                position={{ x: el.x, y: el.y }}
                onDragStop={(e, d) => updateElement(el.id, { x: d.x, y: d.y })}
                onResizeStop={(e, direction, ref, delta, position) => {
                  updateElement(el.id, {
                    width: parseFloat(ref.style.width),
                    height: parseFloat(ref.style.height),
                    ...position,
                  });
                }}
                bounds="parent"
                onClick={(ev) => { ev.stopPropagation(); setSelectedId(el.id); }}
                style={{ zIndex: selectedId === el.id ? 999 : 1 }}
                enableResizing={{ top:true, right:true, bottom:true, left:true, topRight:true, bottomRight:true, bottomLeft:true, topLeft:true }}
              >
                <div className={`w-full h-full overflow-hidden rounded ${selectedId === el.id ? 'ring-2 ring-indigo-300' : ''}`}>
                  {el.type === 'rect' && (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }}>
                    </div>
                  )}

                  {el.type === 'text' && (
                    <div
                      className="w-full h-full p-2"
                    >
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => updateElement(el.id, { text: e.currentTarget.textContent })}
                        onDoubleClick={(e) => e.currentTarget.focus()}
                        style={{ fontSize: el.fontSize }}
                      >{el.text}</div>
                    </div>
                  )}

                  {el.type === 'image' && (
                    <img src={el.src} alt="uploaded" className="w-full h-full object-cover" />
                  )}
                </div>
              </Rnd>
            ))}

            {selectedId && (
              <div className="absolute right-2 bottom-2 text-xs text-gray-500 bg-white/80 rounded px-2 py-1">Selected: {selectedId.slice(0,6)}</div>
            )}
          </div>
        </div>

        {/* Bottom inspector for editing selected */}
        <div className="mt-3 bg-white rounded-2xl shadow p-3">
          <h4 className="font-medium">Inspector</h4>
          {selectedId ? (
            (() => {
              const el = elements.find(x => x.id === selectedId);
              if (!el) return <div className="text-sm text-gray-500">Element not found</div>;
              return (
                <div className="flex gap-4 items-center mt-2">
                  <div className="flex flex-col">
                    <label className="text-xs">X</label>
                    <input value={Math.round(el.x)} onChange={(e) => updateElement(el.id, { x: parseInt(e.target.value || 0) })} className="input" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs">Y</label>
                    <input value={Math.round(el.y)} onChange={(e) => updateElement(el.id, { y: parseInt(e.target.value || 0) })} className="input" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs">W</label>
                    <input value={Math.round(el.width)} onChange={(e) => updateElement(el.id, { width: parseInt(e.target.value || 0) })} className="input" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs">H</label>
                    <input value={Math.round(el.height)} onChange={(e) => updateElement(el.id, { height: parseInt(e.target.value || 0) })} className="input" />
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-sm text-gray-500">Select an element to edit its properties.</div>
          )}
        </div>
      </main>

      <style>{`
        .btn{ @apply px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium; }
        .btn:hover{ @apply bg-indigo-700; }
        .btn-danger{ @apply px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium; }
        .input{ @apply w-20 rounded border px-2 py-1 text-sm; }
      `}</style>
    </div>
  );
}

