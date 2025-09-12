'use client'

import React from 'react';
import { useForm } from 'react-hook-form';

type QuizQuestion = {
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
};

type FormData = {
  [key: string]: string; // Dynamic keys for each question (question0, question1, etc.)
};

interface QuizProps {
  questions?: QuizQuestion[];
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FormData>();

  // Default questions if none provided
  const defaultQuestions: QuizQuestion[] = [
    {
      question: "What is the capital of France?",
      options: {
        a: "London",
        b: "Berlin", 
        c: "Paris",
        d: "Madrid"
      }
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: {
        a: "Venus",
        b: "Mars",
        c: "Jupiter",
        d: "Saturn"
      }
    },
    {
      question: "What is the largest ocean on Earth?",
      options: {
        a: "Atlantic Ocean",
        b: "Indian Ocean",
        c: "Arctic Ocean",
        d: "Pacific Ocean"
      }
    }
  ];

  const quizQuestions = questions || defaultQuestions;
  const watchedValues = watch();

  const onSubmit = (data: FormData) => {
    console.log('Quiz answers:', data);
    
    const results = quizQuestions.map((question, index) => {
      const questionKey = `question${index}`;
      const selectedOption = data[questionKey];
      return {
        question: question.question,
        selectedAnswer: selectedOption,
        selectedText: selectedOption ? question.options[selectedOption as keyof typeof question.options] : 'No answer'
      };
    });
    
    console.log('Formatted results:', results);
    
    // Display results
    const resultsText = results
      .map((result, index) => 
        `Q${index + 1}: ${result.selectedAnswer?.toUpperCase() || 'No answer'} - ${result.selectedText}`
      )
      .join('\n');
    
    alert(`Quiz Results:\n${resultsText}`);
  };

  const resetForm = () => {
    reset();
  };

  const getAnsweredCount = () => {
    return Object.keys(watchedValues).filter(key => watchedValues[key]).length;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quiz</h1>
        <div className="text-sm text-gray-600">
          Progress: {getAnsweredCount()} / {quizQuestions.length} questions answered
        </div>
      </div>
      
      <div className="space-y-8">
        {quizQuestions.map((question, questionIndex) => {
          const questionKey = `question${questionIndex}`;
          
          return (
            <div key={questionIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  <span className="text-blue-600 mr-2">Q{questionIndex + 1}.</span>
                  {question.question}
                </h2>
              </div>
              
              <div className="space-y-3 ml-8">
                {Object.entries(question.options).map(([optionKey, optionValue]) => (
                  <label
                    key={`${questionIndex}-${optionKey}`}
                    className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-white cursor-pointer transition-colors bg-white"
                  >
                    <input
                      type="radio"
                      value={optionKey}
                      {...register(questionKey, {
                        required: `Please select an answer for question ${questionIndex + 1}`
                      })}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="font-medium text-gray-600 mr-2">
                      {optionKey.toUpperCase()}.
                    </span>
                    <span className="text-gray-800">{optionValue}</span>
                  </label>
                ))}
              </div>
              
              {errors[questionKey] && (
                <p className="mt-3 ml-8 text-red-600 text-sm">
                  {errors[questionKey]?.message}
                </p>
              )}
            </div>
          );
        })}
        
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Submit Quiz
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-lg"
          >
            Reset All
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-500 pt-2">
          Make sure to answer all questions before submitting
        </div>
      </div>
    </div>
  );
};

export default Quiz;
