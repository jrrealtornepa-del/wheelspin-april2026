import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, form, wheel, result
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    zipcode: '',
    phone: ''
  });
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [prizes, setPrizes] = useState([]);
  const wheelRef = useRef(null);

  // Prize colors for the wheel
  const prizeColors = [
    '#fbbf24', // gold for $500
    '#60a5fa', // blue for Kalahari
    '#4ade80', // green for T-shirt
    '#f9a8d4', // pink for 25% off
    '#a78bfa', // purple for BOGO
    '#ef4444'  // red for no win
  ];

  useEffect(() => {
    fetchPrizes();
  }, []);

  const fetchPrizes = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/prizes`);
      setPrizes(response.data.prizes);
    } catch (err) {
      console.error('Error fetching prizes:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.zipcode) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Zipcode validation
    if (formData.zipcode.length !== 5) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }

    setCurrentView('wheel');
    setTimeout(() => performSpin(), 500);
  };

  const performSpin = async () => {
    setSpinning(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/spin`, formData);
      
      if (response.data.success) {
        // Spin animation
        if (wheelRef.current) {
          const randomRotation = 1800 + Math.random() * 360;
          wheelRef.current.style.transform = `rotate(${randomRotation}deg)`;
        }

        // Wait for animation to complete
        setTimeout(() => {
          setResult(response.data);
          setSpinning(false);
          setCurrentView('result');
          
          // Show confetti for winners
          if (response.data.prize !== 'Better Luck Next Time') {
            createConfetti();
          }
        }, 4000);
      } else {
        setError(response.data.message);
        setSpinning(false);
        setCurrentView('form');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An error occurred. Please try again.';
      setError(errorMessage);
      setSpinning(false);
      setCurrentView('form');
    }
  };

  const createConfetti = () => {
    const colors = ['#fbbf24', '#60a5fa', '#4ade80', '#f9a8d4', '#a78bfa', '#ef4444'];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
      }, i * 30);
    }
  };

  const resetApp = () => {
    setCurrentView('home');
    setFormData({ name: '', email: '', zipcode: '', phone: '' });
    setResult(null);
    setError('');
    if (wheelRef.current) {
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  };

  // Home View
  const HomeView = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-pink-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl animate-float">🌸</div>
      <div className="absolute top-20 right-20 text-6xl animate-float" style={{ animationDelay: '1s' }}>🌼</div>
      <div className="absolute bottom-20 left-20 text-6xl animate-float" style={{ animationDelay: '2s' }}>🌷</div>
      <div className="absolute bottom-10 right-10 text-6xl animate-float" style={{ animationDelay: '1.5s' }}>🌻</div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-2xl shadow-2xl p-4 mb-6">
            <img 
              src="https://customer-assets.emergentagent.com/job_spring-giveaway-pa/artifacts/u7ldiwd6_1000025311.jpg" 
              alt="J.R. Initiated - Real vs Fake Estate" 
              className="max-w-md w-full h-auto rounded-xl"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-green-700 mb-4 drop-shadow-lg">
            🌸 Spring Giveaway Wheel 🌸
          </h1>
          <p className="text-2xl md:text-3xl text-green-600 font-semibold mb-2">
            Northeast Pennsylvania
          </p>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Spin the wheel for a chance to win amazing prizes! One spin per person.
          </p>
        </div>

        {/* Prizes Display */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
            🎁 Amazing Prizes Available! 🎁
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-xl shadow-lg">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="font-bold text-white text-xl">$500 Cash Grand Prize!</h3>
              <p className="text-yellow-100 text-sm">Ultra rare - 5% chance</p>
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-xl shadow-lg">
              <div className="text-4xl mb-2">🏊</div>
              <h3 className="font-bold text-white text-xl">2 Kalahari Swim Park Tickets</h3>
              <p className="text-blue-100 text-sm">20% chance</p>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-xl shadow-lg">
              <div className="text-4xl mb-2">👕</div>
              <h3 className="font-bold text-white text-xl">Free T-Shirt</h3>
              <p className="text-green-100 text-sm">Great chance!</p>
            </div>
            <div className="bg-gradient-to-r from-pink-400 to-pink-600 p-4 rounded-xl shadow-lg">
              <div className="text-4xl mb-2">🧹</div>
              <h3 className="font-bold text-white text-xl">25% Off Full House Cleaning</h3>
              <p className="text-pink-100 text-sm">Good chance!</p>
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-xl shadow-lg">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="font-bold text-white text-xl">BOGO Room Cleaning</h3>
              <p className="text-purple-100 text-sm">Good chance!</p>
            </div>
            <div className="bg-gradient-to-r from-gray-400 to-gray-600 p-4 rounded-xl shadow-lg">
              <div className="text-4xl mb-2">🍀</div>
              <h3 className="font-bold text-white text-xl">Better Luck Next Time</h3>
              <p className="text-gray-100 text-sm">Small chance</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => setCurrentView('form')}
            data-testid="spin-now-button"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-2xl md:text-3xl font-bold py-6 px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            🎡 SPIN NOW! 🎡
          </button>
          <p className="mt-4 text-gray-600">
            Open to Northeast Pennsylvania residents only
          </p>
        </div>
      </div>
    </div>
  );

  // Form View
  const FormView = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-pink-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Enter Your Information
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" data-testid="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              data-testid="name-input"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              data-testid="email-input"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Northeast PA Zip Code *
            </label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleInputChange}
              data-testid="zipcode-input"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="18201"
              maxLength="5"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              data-testid="phone-input"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="(570) 123-4567"
            />
          </div>

          <button
            type="submit"
            data-testid="submit-spin-button"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl font-bold py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Spin the Wheel! 🎡
          </button>
        </form>

        <button
          onClick={resetApp}
          className="mt-4 w-full text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );

  // Wheel View
  const WheelView = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-pink-100 flex flex-col items-center justify-center px-4">
      <h2 className="text-4xl font-bold text-green-700 mb-8 animate-pulse">
        Spinning...
      </h2>
      
      <div className="relative">
        <div 
          ref={wheelRef}
          className="wheel-container w-80 h-80 rounded-full border-8 border-yellow-400 shadow-2xl"
          style={{ 
            transition: 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
            transform: 'rotate(0deg)'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {prizes.map((prize, index) => {
              const segments = prize.segments;
              const startAngle = prizes.slice(0, index).reduce((sum, p) => sum + (p.segments * 360 / 20), 0);
              const segmentAngle = (segments * 360) / 20;
              
              return (
                <g key={index}>
                  <path
                    d={describeArc(50, 50, 45, startAngle, startAngle + segmentAngle)}
                    fill={prizeColors[index % prizeColors.length]}
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </g>
              );
            })}
            <circle cx="50" cy="50" r="8" fill="white" stroke="#fbbf24" strokeWidth="2" />
          </svg>
        </div>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-16 border-l-transparent border-r-transparent border-t-red-600"></div>
        </div>
      </div>

      <p className="mt-8 text-xl text-gray-700">
        Good luck, {formData.name}! 🍀
      </p>
    </div>
  );

  // Result View
  const ResultView = () => {
    const isWinner = result?.prize !== 'Better Luck Next Time';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-pink-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
          {isWinner ? (
            <>
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-green-600 mb-4" data-testid="result-title">
                Congratulations!
              </h2>
              <p className="text-2xl text-gray-700 mb-6">
                You won:
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-2xl shadow-lg mb-6">
                <p className="text-3xl font-bold text-white" data-testid="prize-result">
                  {result?.prize}
                </p>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                We'll contact you at <strong>{formData.email}</strong> with details on how to claim your prize!
              </p>
            </>
          ) : (
            <>
              <div className="text-8xl mb-4">😊</div>
              <h2 className="text-4xl font-bold text-gray-700 mb-4" data-testid="result-title">
                Better Luck Next Time!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Thanks for participating in our Northeast PA Spring Giveaway!
              </p>
            </>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-gray-700">
              <strong>Remember:</strong> Each person gets only one spin. Thanks for being part of our community!
            </p>
          </div>

          <button
            onClick={resetApp}
            data-testid="back-home-button"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl font-bold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  };

  // Helper function for drawing wheel segments
  function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', x, y,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  }

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  return (
    <div>
      {currentView === 'home' && <HomeView />}
      {currentView === 'form' && <FormView />}
      {currentView === 'wheel' && <WheelView />}
      {currentView === 'result' && <ResultView />}
    </div>
  );
}

export default App;
