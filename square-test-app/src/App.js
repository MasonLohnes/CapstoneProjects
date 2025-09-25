import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Your existing state
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  
  // Square payment state
  const [card, setCard] = useState(null);
  const [amount, setAmount] = useState('10.00');
  const [isSquareLoaded, setIsSquareLoaded] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  // Replace with your actual credentials
  const SQUARE_APPLICATION_ID = 'sandbox-sq0idb-gwwV3I29GMAzUoJ11FTN7A';
  const SQUARE_LOCATION_ID = 'LX8BEQ4Z0N92H';

  // Initialize Square when component loads
  useEffect(() => {
  const initializeSquare = async () => {
    if (!window.Square) {
      console.error('Square SDK not loaded');
      return;
    }

    try {
      const payments = window.Square.payments(SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID);
      const cardElement = await payments.card();
      await cardElement.attach('#card-container');
      
      setCard(cardElement);
      setIsSquareLoaded(true);
    } catch (error) {
      console.error('Error initializing Square:', error);
    }
  };

  // Only run once when component mounts
  const timer = setTimeout(() => {
    if (window.Square && !card) {
      initializeSquare();
    }
  }, 100);

  // Cleanup function
  return () => {
    clearTimeout(timer);
    if (card) {
      card.destroy();
    }
  };
  }, [card]); // Dependancy Array

  const handlePayment = async () => {
    if (!card) {
      alert('Payment form not ready');
      return;
    }

    try {
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status === 'OK') {
        setPaymentResult(`Payment successful! Token: ${tokenResult.token.substring(0, 20)}...`);
      } else {
        setPaymentResult(`Payment failed: ${tokenResult.errors[0].message}`);
      }
    } catch (error) {
      setPaymentResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React + Square Payment Demo</h1>
        
        {/* Your existing React components */}
        <div style={{ margin: '20px 0', padding: '20px', border: '1px solid white' }}>
          <h3>Your React Components:</h3>
          <button onClick={() => setCount(count + 1)}>Count: {count}</button>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type..." />
          <p>You typed: {text}</p>
          <button onClick={() => setIsVisible(!isVisible)}>
            {isVisible ? 'Hide' : 'Show'}
          </button>
          {isVisible && <p>Toggle message!</p>}
        </div>

        {/* Square Payment Section */}
        <div style={{ margin: '20px 0', padding: '20px', border: '1px solid white' }}>
          <h3>Square Payment:</h3>
          
          <div>
            <label>Amount: $</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
            />
          </div>

          <div 
            id="card-container" 
            style={{ 
              margin: '20px 0', 
              padding: '20px', 
              border: '1px solid #ccc', 
              backgroundColor: 'white',
              color: 'black',
              minHeight: '100px'
            }}
          >
            {!isSquareLoaded && <p>Loading Square payment form...</p>}
          </div>

          <button onClick={handlePayment} disabled={!isSquareLoaded}>
            Pay ${amount}
          </button>

          {paymentResult && (
            <p style={{ color: 'yellow', marginTop: '10px' }}>
              {paymentResult}
            </p>
          )}
        </div>

        <p>Test card: 4111 1111 1111 1111, any CVV, any future date</p>
      </header>
    </div>
  );
}

export default App;