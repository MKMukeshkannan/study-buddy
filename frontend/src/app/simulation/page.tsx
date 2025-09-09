"use client"
import { Montserrat } from 'next/font/google';
import React, { useState, useRef, useEffect } from 'react';

declare global {
  interface Window {
    Desmos: any;
  }
}

const font = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700']
})

const simulationExamples = [
  { name: 'Linear Equation', latex: 'y = mx + c' },
  { name: 'Quadratic Equation', latex: 'y = ax^2 + bx + c' },
  { name: 'Sine Wave', latex: 'y = a \\sin(bx + c)' },
  { name: 'Circle', latex: 'x^2 + y^2 = r^2' },
  { name: 'Exponential Growth', latex: 'y = a * b^x' },
  { name: 'Tangent Function', latex: 'y = a \\tan(bx)' },
];


export default function Page(){
  const [expression, setExpression] = useState(simulationExamples[0].latex);
  const calculatorContainerRef = useRef<HTMLDivElement | null>(null);
  const calculatorInstanceRef = useRef<any | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // MOUNTING DESMOS
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.desmos.com/api/v1.8/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    document.title = 'Desmos Graphical Simulations';

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // MOUNTING GRAPHING CALCULATOR
  useEffect(() => {
    if (isScriptLoaded && calculatorContainerRef.current) {
      if (!calculatorInstanceRef.current) {
        const calculator = window.Desmos.GraphingCalculator(calculatorContainerRef.current, {
            keypad: true,
            expressions: true,
            settingsMenu: true,
            zoomButtons: true,
        });
        calculator.setExpression({ id: 'initial-graph', latex: simulationExamples[0].latex });
        calculatorInstanceRef.current = calculator;
      }
    }
    return () => {
      if (calculatorInstanceRef.current) {
        calculatorInstanceRef.current.destroy();
        calculatorInstanceRef.current = null;
      }
    };
  }, [isScriptLoaded]);


  const handleUpdateGraph = (e: React.FormEvent) => {
    e.preventDefault();
    if (calculatorInstanceRef.current && expression) {
      calculatorInstanceRef.current.setExpression({ id: 'user-graph', latex: expression });
    }
  };

  const handleSimulationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLatex = e.target.value;
    if (newLatex) {
      setExpression(newLatex);
      if (calculatorInstanceRef.current) {
        calculatorInstanceRef.current.setBlank();
        calculatorInstanceRef.current.setExpression({ id: 'simulation-graph', latex: newLatex });
      }
    }
  };

  return (
    <>
      <main className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans p-4 sm:p-6 md:p-8 ${font.className}`}>
        <div className="w-full max-w-9xl mx-auto">
          <header className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-medium text-gray-800">
              Interactive Graphical Simulations
            </h1>
            <p className="text-md text-gray-600 mt-2">
              Powered by Desmos and React
            </p>
          </header>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-6">
              <div>
                <label htmlFor="simulation-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Choose a Simulation
                </label>
                <select
                  id="simulation-select"
                  onChange={handleSimulationChange}
                  className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  {simulationExamples.map((sim) => (
                    <option key={sim.name} value={sim.latex}>
                      {sim.name}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleUpdateGraph} className="flex items-end gap-2">
                <div className="flex-grow">
                  <label htmlFor="expression-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Or Enter Your Own
                  </label>
                  <input
                    id="expression-input"
                    type="text"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="e.g., y = sin(x)"
                    className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    aria-label="Mathematical Expression"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 h-[42px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
                >
                  Update
                </button>
              </form>
            </div>

            <div
              ref={calculatorContainerRef}
              className="w-full h-[650px] rounded-lg border border-gray-300 overflow-hidden"
              aria-label="Desmos Graphing Calculator"
            >
              {!isScriptLoaded && (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Loading Calculator...
                </div>
              )}
            </div>
          </div>

          <footer className="text-center mt-8 text-sm text-gray-500">
            <p>
              Choose a simulation or enter your own expression to visualize it. Use the sliders to see how parameters affect the graph.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
};
