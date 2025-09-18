import React, { useState } from 'react';

interface SimpleFormProps {
  externalSetState: (data: any) => void; // Accept external state setter function
}

const SimpleForm: React.FC<SimpleFormProps> = ({ externalSetState }) => {
  const [inputText, setInputText] = useState<string>(''); // Type the inputText as string
  const [loading, setLoading] = useState<boolean>(false); // Type the loading state as boolean
  const [error, setError] = useState<string | null>(null); // Type the error state as string or null

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form behavior (page refresh)

    if (!inputText) {
      alert('Please enter some text!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Replace the URL with your backend API endpoint
      const response = await fetch('http://localhost:8080/gen-vnovel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      const data = await response.json();

      externalSetState(data.canvasContent); // Update the external state with the response data

    } catch (error: any) {
      setError(error.message); // Set error state if something went wrong
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col mt-4 text-xl'>
      <h1 className=''>Simple Form</h1>
      <form className='flex flex-col' onSubmit={handleSubmit}>
        <textarea
          className='textarea mb-2'
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter some text"
        />
        <button type="submit" className='btn' disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SimpleForm;
