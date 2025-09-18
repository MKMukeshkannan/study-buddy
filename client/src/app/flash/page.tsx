"use client";

import React, { useEffect, useState } from "react";
import { useFlashCardStore, FlashCard, useUserStore } from "../../utils/store";
import { v4 as uuidv4 } from "uuid";

const Page = () => {
  const {getId} = useUserStore();
  const studentId = getId(); // replace with logged-in studentId
  const { addCard, removeCard, getCards } = useFlashCardStore();
  const cards = getCards(studentId);

  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const nextCard = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleAddCard = () => {
    if (!question.trim() || !answer.trim()) return;
    const newCard: FlashCard = { id: uuidv4(), question, answer };
    addCard(studentId, newCard);
    setQuestion("");
    setAnswer("");
  };

  const handleRemove = (id: string) => {
    removeCard(studentId, id);
    setCurrentIndex(0);
    setFlipped(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-base-200 p-4 flex flex-col border-r">
        <h2 className="text-xl font-bold mb-4">Flashcards</h2>

        {/* List of flashcards */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {cards.map((c, idx) => (
            <div
              key={c.id}
              className={`card card-compact shadow cursor-pointer p-2 ${
                idx === currentIndex ? "bg-primary text-white" : "bg-base-100"
              }`}
              onClick={() => {
                setCurrentIndex(idx);
                setFlipped(false);
              }}
            >
              <div className="flex justify-between items-center">
                <p className="truncate">{c.question}</p>
                <button
                  className="btn btn-xs btn-error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(c.id);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Card Form */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Question"
            className="input input-bordered w-full"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <input
            type="text"
            placeholder="Answer"
            className="input input-bordered w-full"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button className="btn btn-success w-full" onClick={handleAddCard}>
            ➕ Add Card
          </button>
        </div>
      </aside>

      {/* Main Viewer */}
      <main className="flex-1 flex flex-col items-center justify-center space-y-6 bg-gray-100">
        {cards.length > 0 ? (
          <div
            className={`card w-96 h-60 bg-base-100 shadow-xl cursor-pointer transition-transform duration-500 ${
              flipped ? "bg-green-50" : "bg-red-50"
            }`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="card-body flex items-center justify-center text-center">
              {flipped
                ? cards[currentIndex].answer
                : cards[currentIndex].question}
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-600">No flashcards yet. Add one!</p>
        )}

        {cards.length > 0 && (
          <div className="space-x-4">
            <button className="btn btn-primary" onClick={prevCard}>
              ◀ Previous
            </button>
            <button className="btn btn-secondary" onClick={nextCard}>
              Next ▶
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;

