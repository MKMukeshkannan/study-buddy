'use client'

import { v4 as uuidv4 } from 'uuid';
import { IconArrowNarrowDown, IconArrowNarrowUp, IconPlus, IconX } from '@tabler/icons-react'
import React, { useRef, useState } from 'react'
import { Rnd } from 'react-rnd'
import { useUserStore } from '@/utils/store';
import { useRouter } from 'next/navigation';

type BaseElement = {
  id: string
  x: number
  y: number
  width: number
  height: number
}

type RectElement = BaseElement & { type: 'rect' }
type TextElement = BaseElement & { type: 'text'; text: string; fontSize: number }
type ButtonElement = BaseElement & { type: 'button'; text: string; navigateTo: number }
type ImageElement = BaseElement & { type: 'image'; src: string }

export type Element = RectElement | TextElement | ImageElement | ButtonElement

export default function CanvaLikeApp() {
  const canvasRef = useRef<HTMLDivElement>(null)
  
  const router = useRouter();
  const {getId} = useUserStore();
  if (getId == null) {
    router.push("/login")
  }

  const [frames, setFrames] = useState<Element[][]>(
      [
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
    ]
  )
  const [selectedPage, setSelectedPage] = useState<number>(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 800, height: 480, })

  const move = (
      frameIndex: number,
      elementId: string,
      direction: "up" | "down"
    ) => {
      setFrames(prev => {
        const newFrames = prev.slice();
        const sub = newFrames[frameIndex];
        if (!sub) return prev;
    
        const idx = sub.findIndex(el => el.id === elementId);
        if (idx === -1) return prev;
    
        const newSub = sub.slice();
    
        if (direction === "up" && idx > 0) {
          [newSub[idx - 1], newSub[idx]] = [newSub[idx], newSub[idx - 1]];
        } else if (direction === "down" && idx < newSub.length - 1) {
          [newSub[idx + 1], newSub[idx]] = [newSub[idx], newSub[idx + 1]];
        } else {
          return prev; // can't move further
        }
    
        newFrames[frameIndex] = newSub;
        return newFrames;
      });
    };


  const remove = (index: number, elementId: string) => {
      setFrames(prev => {
        const newFrames = prev.slice();
        const sub = newFrames[index];
        if (!sub) return prev;
    
        const filtered = sub.filter(el => el.id !== elementId);
        if (filtered.length === sub.length) return prev; // nothing removed
    
        newFrames[index] = filtered;
        return newFrames;
      });
    };


  const update = (index: number, elementId: string, patch: Partial<Element>) => {
      setFrames(prev => {
        const newFrames = [...prev];
        if (!newFrames[index]) return prev; // nothing to update
    
        newFrames[index] = newFrames[index].map(el =>
          el.id === elementId ? { ...el, ...patch } : el
        ) as Element[];
    
        return newFrames;
      });
    };

  const handleDragStop = (id: string, x: number, y: number) => {
    update(selectedPage, id, { x, y})
  }

  const handleResizeStop = (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => { update(selectedPage, id, { x, y, height, width}) }

  const pushElement = (element: Element, index: number) => {
    setFrames(prev => {
      // Ensure the sub-array exists
      const newFrames = [...prev];
      if (!newFrames[index]) newFrames[index] = [];
      newFrames[index] = [...newFrames[index], element];
      return newFrames;
    });
  };

  console.log(frames[selectedPage])
  return (
    <div className="flex h-screen bg-base-200">

      {/* Sidebar */}
      <aside className="bg-base-100 shadow-md transition-all duration-300 flex flex-col p-5 overflow-scroll">
        <h1 className="text-3xl font-bold">Visual Novel</h1>
        <section className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold mt-4">Baseline Characters</h3>
          {['teacher_1.svg', 'teacher_2.svg', 'teacher_3.svg', 'student_1.svg', 'student_2.svg'].map((val, ind) => (
            <button
              key={ind}
              className="btn w-40 h-40 overflow-hidden rounded-lg border p-2"
              onClick={() =>
                  pushElement({ id: uuidv4(), type: 'image', src: val, x: 100, y: 100, width: 120, height: 120, } as ImageElement, selectedPage)
              }
            >
              <img
                draggable={false}
                src={val}
                alt={`${val} baseline`}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        
          {/* Add Text */}
          <h3 className="text-lg font-semibold mt-6">Insert Elements</h3>
          <button
            className="btn btn-outline w-40"
            onClick={() => pushElement({ id: uuidv4(), type: 'text', text: 'New Text', fontSize: 20, x: 150, y: 150, width: 200, height: 50, } as TextElement, selectedPage)}
          >
            Text
          </button>
        
          {/* Add Button */}
          <button
            className="btn btn-outline w-40"
            onClick={() =>
                pushElement({ id: uuidv4(), type: 'button', text: 'Click Me', navigateTo: 0, x: 200, y: 200, width: 150, height: 50, } as ButtonElement, selectedPage)
            }
          >
            Button
          </button>
        
          {/* Add Rectangle */}
          <button
            className="btn btn-outline w-40"
            onClick={() => pushElement({ id: uuidv4(), type: 'rect', x: 250, y: 250, width: 120, height: 80, }, selectedPage) }
          >
            Rectangle
          </button>
        </section>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 p-6 bg-gray-200 flex flex-col">
          {/* Document size controls 
          <div className="mb-4 flex space-x-4">
            <label className="flex items-center space-x-2">
              <span>Width</span>
              <input
                type="number"
                className="input input-bordered w-24"
                value={canvasSize.width}
                onChange={(e) =>
                  setCanvasSize((s) => ({ ...s, width: Number(e.target.value) }))
                }
              />
            </label>
            <label className="flex items-center space-x-2">
              <span>Height</span>
              <input
                type="number"
                className="input input-bordered w-24"
                value={canvasSize.height}
                onChange={(e) =>
                  setCanvasSize((s) => ({ ...s, height: Number(e.target.value) }))
                }
              />
            </label>
          </div>*/}
        
          {/* Canvas area */}
          <div className="flex-1 flex justify-center items-center overflow-hidden">
            <div
              ref={canvasRef}
              className="relative bg-white border shadow-md"
              style={{
                width: canvasSize.width,
                height: canvasSize.height,
              }}
            >
              {frames[selectedPage].map((el) => (
                <Rnd
                  key={el.id}
                  size={{ width: el.width, height: el.height }}
                  position={{ x: el.x, y: el.y }}
                  onDragStop={(_, d) => handleDragStop(el.id, d.x, d.y)}
                  onResizeStop={(_, __, ref, ___, pos) =>
                    handleResizeStop(
                      el.id,
                      pos.x,
                      pos.y,
                      ref.offsetWidth,
                      ref.offsetHeight
                    )
                  }
                  // bounds="parent"
                  onClick={() => setSelectedId(el.id)}
                  className={`${
                    selectedId === el.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {el.type === 'rect' && (
                    <div className="w-full h-full bg-red-400" />
                  )}
                  {el.type === 'text' && (
                    <div
                      className="flex items-center justify-center w-full h-full"
                      style={{ fontSize: (el as TextElement).fontSize }}
                    >
                      {(el as TextElement).text}
                    </div>
                  )}
                  {el.type === 'button' && (
                    <button className="btn w-full h-full">
                      {(el as ButtonElement).text}
                    </button>
                  )}
                  {el.type === 'image' && (
                    <img
                        draggable="false"
                      src={(el as ImageElement).src}
                      alt="element"
                      className="w-full h-full object-contain"
                    />
                  )}
                </Rnd>
              ))}
            </div>
          </div>
      </main>

      <aside className='w-14 min-h-screen flex flex-col items-center justify-center overflow-auto space-y-3'>
        {frames.map((_, key) => <div key={key} onClick={() => setSelectedPage(key)} className={`w-10 h-10 rounded-full ${key === selectedPage ? 'btn' : 'btn btn-ghost'}  flex items-center justify-center cursor-pointer select-none`}>{key}</div>)}

        <div onClick={()=>{setFrames(prev=>[...prev, []])}} className='w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center cursor-pointer select-none'>
            <IconPlus />
        </div>
      </aside>

      <aside className='max-w-72 flex flex-col justify-between'>
        <section className="w-72 bg-base-100 shadow-md p-4 overflow-y-auto flex-1">
          <h2 className="text-xl font-bold mb-4">Inspector</h2>
    
          {selectedId ? (
            (() => {
              const el = frames[selectedPage].find(e => e.id === selectedId)
              if (!el) return null
    
              return (
                <div className="space-y-3 text-sm">
                  {/* Common Props */}
                  <div>
                    <label className="label">X</label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={el.x}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        update(selectedPage, el.id, { x: Number(e.target.value) })
                      }
                    />
                  </div>
    
                  <div>
                    <label className="label">Y</label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={el.y}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        update(selectedPage, el.id, { y: Number(e.target.value) })
                      }
                    />
                  </div>
    
                  <div>
                    <label className="label">Width</label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={el.width}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        update(selectedPage, el.id, { width: Number(e.target.value) })
                      }
                    />
                  </div>
    
                  <div>
                    <label className="label">Height</label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={el.height}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        update(selectedPage, el.id, { width: Number(e.target.value) })
                      }
                    />
                  </div>
    
                  {/* Type-specific */}
                  {el.type === 'text' && (() => {
                    const t = el as TextElement
                    return (
                      <>
                        <div>
                          <label className="label">Text</label>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            value={t.text}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              update(selectedPage, el.id, { text: e.target.value })
                            }
                          />
                        </div>
    
                        <div>
                          <label className="label">Font Size</label>
                          <input
                            type="number"
                            className="input input-bordered w-full"
                            value={t.fontSize}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                             update(selectedPage, el.id, { fontSize: Number(e.target.value) })
                            }
                          />
                        </div>
                      </>
                    )
                  })()}
    
                  {el.type === 'button' && (() => {
                    const b = el as ButtonElement
                    return (
                      <>
                        <div>
                          <label className="label">Text</label>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            value={b.text}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            update(selectedPage, el.id, { text: e.target.value })
                            }
                          />
                        </div>
    
                        <div>
                          <label className="label">Navigate To (page id)</label>
                          <input
                            type="number"
                            className="input input-bordered w-full"
                            value={b.navigateTo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              update(selectedPage, el.id, { navigateTo: Number(e.target.value) })
                            }
                          />
                        </div>
                      </>
                    )
                  })()}
    
                  {el.type === 'image' && (() => {
                    const img = el as ImageElement
                    return (
                      <div>
                        <label className="label">Source</label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={img.src}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                             update(selectedPage, el.id, { src: e.target.value })
                          }
                        />
                      </div>
                    )
                  })()}
                </div>
              )
            })()
          ) : (
            <p className="text-gray-500">No element selected</p>
          )}
        </section>

        <section className="min-h-48 w-full bg-base-100 shadow-md p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Layers</h2>
          <ul className="space-y-2">
            {frames[selectedPage].map((el, idx) => (
              <li
                key={el.id}
                className={`flex justify-between items-center p-2 border rounded cursor-pointer ${
                  selectedId === el.id ? 'bg-blue-100' : 'bg-white'
                }`}
                onClick={() => setSelectedId(el.id)}
              >
                <span className="truncate">
                  {el.type.toLowerCase().slice(0, 3)}#{el.id}
                </span>
        
                <div className="flex space-x-1">
                  {/* Move Up */}
                  <button
                    className="btn btn-xs"
                    disabled={idx === frames.length - 1}
                    onClick={(e) => {
                      e.stopPropagation()
                      move(selectedPage, el.id, 'down')
                      // setFrames((prev) => {
                      //   const copy = [...prev]
                      //   const [item] = copy.splice(idx, 1)
                      //   copy.splice(idx + 1, 0, item)
                      //   return copy
                      // })
                    }}
                  >
                    <IconArrowNarrowDown size={14}/>
                  </button>
        
                  {/* Move Down */}
                  <button
                    className="btn btn-xs"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation()
                      move(selectedPage, el.id, 'up')
                      // setFrames((prev) => {
                      //   const copy = [...prev]
                      //   const [item] = copy.splice(idx, 1)
                      //   copy.splice(idx - 1, 0, item)
                      //   return copy
                      // })
                    }}
                  >
                    <IconArrowNarrowUp size={14} />
                  </button>
        
                  {/* Delete */}
                  <button
                    className="btn btn-xs btn-error"
                    onClick={(e) => {
                      e.stopPropagation()
                      remove(selectedPage, el.id);
                      if (selectedId === el.id) setSelectedId(null)
                    }}
                  >
                    <IconX size={14}/>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <button 
            className='btn w-full bg-secondary-content text-secondary' 
            onClick={() => {console.log(frames);}}
        >
            Save
        </button>
      </aside>

    </div>
  )
}

