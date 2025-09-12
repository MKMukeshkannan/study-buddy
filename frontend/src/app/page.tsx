'use client'
import "./globals.css";
import React, { useRef, useState, useEffect, Dispatch } from 'react';

interface Character {
    id: string;
    file_name: string;
    pos_x: number;
    pos_y: number;
}

interface Text {
    id: string;
    content: string;
    pos_x: number;
    pos_y: number;
}

interface Button {
    id: string;
    content: string;
    navigate_to: number;
    pos_x: number;
    pos_y: number;
}

interface Pages {
    characters: Character[];
    texts: Text[];
    buttons: Button[];
}

interface CanvasPageProps {
    pageData: Pages;
    set_current_page: Dispatch<React.SetStateAction<number>>;
    width?: number;
    height?: number;
}

const CanvasPage: React.FC<CanvasPageProps> = ({ pageData, width = 640, height = 400, set_current_page }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF'; // Color to clear with
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        pageData.characters.forEach((char) => {
            const img = new Image();
            img.src = char.file_name; 
            img.onload = () => {
                ctx.drawImage(img, char.pos_x, char.pos_y);
            };
            img.onerror = () => {
                console.error(`Image failed to load: ${char.file_name}`);
            };
        });

        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        pageData.texts.forEach((text) => {
            ctx.fillText(text.content, text.pos_x, text.pos_y);
        });

    }, [pageData]);

    return (
        <section className="relative">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ border: '1px solid #000' }}
            />
            {pageData.buttons.map((val, ind) => {
                return <button key={ind} onClick={() => { set_current_page(val.navigate_to) }} style={{position: 'absolute', top: `${val.pos_x}px`, left: `${val.pos_y}px`,}} className="bg-blue-500 cursor-pointer text-white px-4 py-1 select-none">{val.content}</button> 
            })}
        </section>
    );
};


export default function Page() {
  const teacher_paths = [ 'teacher_1.svg', 'teacher_2.svg', 'teacher_3.svg', ];
  const student_paths = [ 'student_1.svg', 'student_2.svg', ];

  const [current_page, set_current_page] = useState<number>(0);
  useEffect(() => {console.log(current_page)}, [current_page])

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [pages, set_pages] = useState<Pages[]>([
      {
        characters: [
            { id: 'teach1', file_name: 'teacher_1.svg', pos_x: 50, pos_y: 180 },
            { id: 'teach2', file_name: 'student_1.svg', pos_x: 500, pos_y: 300 },
        ],
        texts: [
            { id: 'c1', content: 'What is Photosynthesis??', pos_x: 50, pos_y: 50 },
            { id: 'c2', content: 'Sriman, Do you how plants eat?', pos_x: 100, pos_y: 150 },
        ],
        buttons: [
            { id: 'b1', content: 'Next', navigate_to: 1, pos_x: 170, pos_y: 330 },
        ],
    },
    {
      characters: [
          { id: 'teach1', file_name: 'teacher_1.svg', pos_x: 50, pos_y: 180 },
          { id: 'teach2', file_name: 'student_1.svg', pos_x: 500, pos_y: 300 },
      ],
      texts: [
          { id: 'c1', content: 'What is Photosynthesis??', pos_x: 50, pos_y: 50 },
          { id: 'c2', content: "I don't know", pos_x: 100, pos_y: 150 },
      ],
      buttons: [
          { id: 'b1', content: 'Next', navigate_to: 0, pos_x: 170, pos_y: 330 },
      ],
    },
  ]);

  const update_button_field = (
      index: number,
      field: keyof Button,
      value: string | number
  ) => {
      set_pages(prevPages => {
          const updatedPages = [...prevPages];
          const updatedButtons = [...updatedPages[current_page].buttons];

          updatedButtons[index] = {
              ...updatedButtons[index],
              [field]: value
          };

          updatedPages[current_page] = {
              ...updatedPages[current_page],
              buttons: updatedButtons
          };

          return updatedPages;
      });
  };

  const update_character_field = (
      index: number,
      field: keyof Character,
      value: string | number
    ) => {
      set_pages(prevPages => {
        const updatedPages = [...prevPages];
        const updatedCharacters = [...updatedPages[current_page].characters];
    
        updatedCharacters[index] = {
          ...updatedCharacters[index],
          [field]: value
        };
    
        updatedPages[current_page] = {
          ...updatedPages[current_page],
          characters: updatedCharacters
        };
    
        return updatedPages;
      });
    };

    const update_text_field = (
      index: number,
      field: keyof Text,
      value: string | number
    ) => {
      set_pages(prevPages => {
        const updatedPages = [...prevPages];
        const updatedTexts = [...updatedPages[current_page].texts];
    
        updatedTexts[index] = {
          ...updatedTexts[index],
          [field]: value
        };
    
        updatedPages[current_page] = {
          ...updatedPages[current_page],
          texts: updatedTexts
        };
    
        return updatedPages;
      });
    };

    const addEmptyButton = (currentPageIndex: number) => {
      set_pages(prevPages => {
        if (!prevPages) return prevPages; // handle null case
    
        const newPages = [...prevPages];
        const currentPage = { ...newPages[currentPageIndex] };
    
        const newButton: Button = {
          id: `button_${pages[current_page].buttons.length + 1}`,
          content: '',
          navigate_to: 0,
          pos_x: 0,
          pos_y: 0
        };
    
        currentPage.buttons = [...currentPage.buttons, newButton];
        newPages[currentPageIndex] = currentPage;
    
        return newPages;
      });
    };

    const addEmptyCharacter = (currentPageIndex: number, file_name: string) => {
      set_pages(prevPages => {
        if (!prevPages) return prevPages;
    
        const newPages = [...prevPages];
        const currentPage = { ...newPages[currentPageIndex] };
    
        const newCharacter: Character = {
          id: `char_${pages[current_page].characters.length + 1}`,
          file_name: file_name,
          pos_x: 0,
          pos_y: 0
        };
    
        currentPage.characters = [...currentPage.characters, newCharacter];
        newPages[currentPageIndex] = currentPage;
    
        return newPages;
      });
    };

    const addEmptyText = (currentPageIndex: number) => {
      set_pages(prevPages => {
        if (!prevPages) return prevPages;
    
        const newPages = [...prevPages];
        const currentPage = { ...newPages[currentPageIndex] };
    
        const newText: Text = {
          id: `text_${pages[current_page].texts.length + 1}`,
          content: '',
          pos_x: 0,
          pos_y: 0
        };
    
        currentPage.texts = [...currentPage.texts, newText];
        newPages[currentPageIndex] = currentPage;
    
        return newPages;
      });
    };

    const downloadJSON = () => {
        const jsonString = JSON.stringify(pages, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pages.json'; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
      };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File could not be read as text.");
                }
                const parsedData = JSON.parse(text);
    
                if (Array.isArray(parsedData) && parsedData.every(page =>
                    typeof page === 'object' && page !== null &&
                    Array.isArray(page.characters) &&
                    Array.isArray(page.texts) &&
                    Array.isArray(page.buttons)
                )) {
                    set_pages(parsedData);
                    set_current_page(0);
                } else {
                    console.error("Invalid JSON format.");
                }
            } catch (error) {
                console.error("Error parsing JSON file:", error);
            }
        };
        reader.readAsText(file);
    };
  
    const deleteButton = (buttonIndex: number) => {
        set_pages(prevPages => {
            const newPages = [...prevPages];
            const pageToUpdate = { ...newPages[current_page] };
            pageToUpdate.buttons = pageToUpdate.buttons.filter((_, index) => index !== buttonIndex);
            newPages[current_page] = pageToUpdate;
            return newPages;
        });
    };
    
    const deleteCharacter = (charIndex: number) => {
        set_pages(prevPages => {
            const newPages = [...prevPages];
            const pageToUpdate = { ...newPages[current_page] };
            pageToUpdate.characters = pageToUpdate.characters.filter((_, index) => index !== charIndex);
            newPages[current_page] = pageToUpdate;
            return newPages;
        });
    };
    
    const deleteText = (textIndex: number) => {
        set_pages(prevPages => {
            const newPages = [...prevPages];
            const pageToUpdate = { ...newPages[current_page] };
            pageToUpdate.texts = pageToUpdate.texts.filter((_, index) => index !== textIndex);
            newPages[current_page] = pageToUpdate;
            return newPages;
        });
    };

    // Delete Page
    const deletePage = (pageIndex: number) => {
        if (pages.length <= 1) {
            alert("You cannot delete the last page.");
            return;
        }
        set_pages(prevPages => prevPages.filter((_, index) => index !== pageIndex));
        set_current_page(prev => {
            if (prev === pageIndex) {
                return Math.max(0, prev - 1);
            } else if (prev > pageIndex) {
                return prev - 1;
            }
            return prev;
        });
    };

  return (
    <main className="flex h-screen ">
        <aside className="h-full bg-accent-black w-full max-w-[250px] p-10 overflow-scroll drop-shadow-xs text-white">
            <div className="space-y-2 mb-6">
              <button onClick={downloadJSON} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md mb-6 transition-colors">
                Download JSON
              </button>
              <button onClick={handleUploadClick} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Upload JSON
              </button>
            </div>

            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              style={{ display: 'none' }}
            />

            <h1 className="text-4xl font-black mb-4">Elements</h1>

            <h1 onClick={() => {addEmptyText(current_page)}} className="text-2xl font-black cursor-pointer">Text</h1>
            <h1 onClick={() => {addEmptyButton(current_page)}} className="text-2xl font-black cursor-pointer">Button</h1>

            <h1 className="text-2xl font-black">Teachers</h1>
            <section className="flex flex-col items-center justify-center space-y-5 pt-3 ">
                { teacher_paths.map((val, ind) => { return <div onClick={() => addEmptyCharacter(current_page, val)} key={ind} className="w-full border flex items-center justify-center p-5 bg-accent-beige hover:bg-secondary-beige cursor-pointer rounded-xl"><img key={ind} src={val} className="h-60" /></div>; }) }
            </section>

            <h1 className="text-2xl  font-black  pt-10">Children</h1>
            <section className="flex flex-col items-center justify-center space-y-5 pt-3">
                { student_paths.map((val, ind) => { return <div onClick={() => addEmptyCharacter(current_page, val)} key={ind} className="w-full border flex items-center justify-center p-5 bg-accent-beige hover:bg-secondary-beige cursor-pointer rounded-xl"><img key={ind} src={val} className="h-60" /></div>; }) }
            </section>
        </aside>

        <aside className="h-full border-r border-r-gray-100 w-full max-w-[350px] overflow-scroll drop-shadow-xs rounded-r-2xl bg-[#202636] text-accent-beige p-6">
                <h1 className=" text-4xl  font-black">Properties</h1>
                <div className="">
                    <h1 className="text-2xl pt-4 ">Buttons</h1>
                {
                    pages[current_page].buttons.map((val, ind) => { 
                        return <div key={ind} className="">
                            <CollapsedCard name={val.id} onDelete={() => deleteButton(ind)}>
                                <div className="flex items-center justify-between">
                                  <label className="font-medium pr-5"> Content: </label>
                                  <input type="text" value={val.content} onChange={(e) => update_button_field(ind, 'content', e.target.value)} />
                                </div>

                                <div className="flex items-center justify-between">
                                  <label className="font-medium pr-5"> To: </label>
                                  <input type="number" value={val.navigate_to} onChange={(e) => update_button_field(ind, 'navigate_to', e.target.value)} />
                                </div>

                                <div className="flex items-center justify-between">
                                  <label className=" font-medium"> X: </label>
                                  <input
                                    type="range"
                                    min={0} max={400}
                                    value={val.pos_x}
                                    onChange={(e) => update_button_field(ind, 'pos_x', Number(e.target.value))}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <label className=" font-medium"> Y: </label>
                                  <input
                                    type="range"
                                    min={0}
                                    max={640}
                                    value={val.pos_y}
                                    onChange={(e) => update_button_field(ind, 'pos_y', Number(e.target.value))}
                                  />
                                </div>
                            </CollapsedCard>
                        </div>
                    })
                }

                    <h1 className="text-2xl pt-4 ">Character</h1>
                {
                    pages[current_page].characters.map((val, ind) => (
                      <div key={ind}>
                       <CollapsedCard name={val.id} onDelete={() => deleteCharacter(ind)}>
                          {/* File Name Input */}
                          <div className="flex items-center justify-between">
                            <label className="font-medium ">Name:</label>
                            <select onChange={(e) => update_character_field(ind, 'file_name', e.target.value)} className="bg-pink-400">
                                <option value="teacher_1.svg">Teacher 1</option>
                                <option value="teacher_2.svg">Teacher 2</option>
                                <option value="teacher_3.svg">Teacher 3</option>
                                <option value="student_1.svg">Child 1</option>
                                <option value="student_2.svg">Child 2</option>
                            </select>
                          </div>
                        
                          {/* Position X Slider */}
                          <div className="flex items-center justify-between">
                            <label className="font-medium">X:</label>
                            <input
                              type="range"
                              min={0}
                              max={640}
                              value={val.pos_x}
                              onChange={(e) => update_character_field(ind, 'pos_x', Number(e.target.value))}
                            />
                          </div>
                        
                          {/* Position Y Slider */}
                          <div className="flex items-center justify-between">
                            <label className="font-medium">Y:</label>
                            <input
                              type="range"
                              min={0}
                              max={400}
                              value={val.pos_y}
                              onChange={(e) => update_character_field(ind, 'pos_y', Number(e.target.value))}
                            />
                          </div>
                        </CollapsedCard>

                      </div>
                    ))}

                    <h1 className="text-2xl pt-4 ">Text</h1>
                    {
                    pages[current_page].texts.map((val, ind) => (
                       <div key={ind}>
                       <CollapsedCard name={val.id} onDelete={() => deleteText(ind)}>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="font-medium pr-5">Content:</label>
                              <input
                                type="text"
                                value={val.content}
                                onChange={(e) => update_text_field(ind, 'content', e.target.value)}
                              />
                            </div>
                        
                            <div className="flex items-center justify-between">
                              <label className="font-medium ">X:</label>
                              <input
                                type="range"
                                min={0}
                                max={640}
                                value={val.pos_x}
                                onChange={(e) => update_text_field(ind, 'pos_x', Number(e.target.value))}
                              />
                            </div>
                        
                            <div className="flex items-center justify-between">
                              <label className="font-medium ">Y:</label>
                              <input
                                type="range"
                                min={0}
                                max={400}
                                value={val.pos_y}
                                onChange={(e) => update_text_field(ind, 'pos_y', Number(e.target.value))}
                              />
                            </div>
                          </div>
                        </CollapsedCard>

                       </div>
                     ))}

                </div>
        </aside>

        <section className="h-full bg-accent-beige w-full flex items-center justify-center ">
            <CanvasPage set_current_page={set_current_page} pageData={pages[current_page]} />
        </section>

        {/* PAGE */}
        <section className="w-24 h-full bg-gray-50 rounded-l-2xl border-l border-l-gray-100 flex flex-col items-center py-10 space-y-3">
            {pages.map((_, ind) => (
                <div key={ind} className="relative group">
                    <h1 
                        onClick={() => set_current_page(ind)} 
                        className={`w-10 h-10 cursor-pointer rounded-full flex font-black items-center justify-center transition-colors ${current_page === ind ? 'bg-neutral-800 text-white' : 'bg-neutral-300 text-black'}`}
                    >
                        {ind + 1}
                    </h1>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); 
                            deletePage(ind);
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Delete page ${ind + 1}`}
                    >
                        X
                    </button>
                </div>
            ))}
            
            <h1 onClick={() => set_pages([...pages, { buttons: [], texts: [], characters: [] }])} className={`w-10 h-10 cursor-pointer rounded-full flex font-black items-center justify-center text-white bg-neutral-400`}>
                +
            </h1>
        </section>
    </main>
  );
};

interface CollapsedCardProps {
    name: string;
    children?: React.ReactNode;
    onDelete: () => void; 
};

function CollapsedCard({ name, children, onDelete }: CollapsedCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        onDelete();
    };

    return (
        <div className="w-full border-b border-gray-600 py-2">
            <div className="flex items-center justify-between cursor-pointer" onClick={toggleCollapse}>
                <span className="font-bold">{name}</span>
                <div className="flex items-center space-x-3">
                    <span onClick={handleDelete} className="cursor-pointer hover:text-red-500 text-lg">
                        🗑️
                    </span>
                    <span>{isOpen ? '▲' : '▼'}</span>
                </div>
            </div>

            {
                isOpen && <div className="p-4 mt-2 bg-gray-700 rounded-md space-y-3">{children}</div>
            }

        </div>
    );
}
