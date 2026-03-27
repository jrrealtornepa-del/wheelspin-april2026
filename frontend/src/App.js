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
      // Use fallback prizes if API fails
      setPrizes([
        {"name": "$500 Cash Grand Prize", "weight": 5, "segments": 1},
        {"name": "2 Tickets to Kalahari Swim Park", "weight": 20, "segments": 4},
        {"name": "Free T-Shirt", "weight": 25, "segments": 5},
        {"name": "25% Off Full House Cleaning", "weight": 20, "segments": 4},
        {"name": "BOGO Room Cleaning", "weight": 20, "segments": 4},
        {"name": "Better Luck Next Time", "weight": 10, "segments": 2}
      ]);
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
    <div className="min-h-screen relative overflow-hidden">
      <div className="animated-bg"></div>
      
      {/* Animated Celebratory elements - Giveaway Theme */}
      <div className="absolute top-10 left-10 text-6xl z-10 celebration-float-diagonal">🎁</div>
      <div className="absolute top-20 right-20 text-6xl z-10 celebration-bounce-horizontal" style={{ animationDelay: '1s' }}>🎉</div>
      <div className="absolute bottom-20 left-20 text-6xl z-10 celebration-float-wave" style={{ animationDelay: '2s' }}>🎊</div>
      <div className="absolute bottom-10 right-10 text-6xl z-10 celebration-spin-move" style={{ animationDelay: '1.5s' }}>✨</div>
      <div className="absolute top-1/3 left-5 text-5xl z-10 celebration-float-diagonal" style={{ animationDelay: '0.5s' }}>🎈</div>
      <div className="absolute top-1/2 right-10 text-5xl z-10 celebration-twinkle" style={{ animationDelay: '1.8s' }}>💝</div>
      <div className="absolute bottom-1/3 left-1/4 text-4xl z-10 celebration-bounce-vertical" style={{ animationDelay: '0.8s' }}>🌟</div>
      <div className="absolute top-1/4 right-1/4 text-4xl z-10 celebration-float-wave" style={{ animationDelay: '2.2s' }}>🎀</div>
      <div className="absolute top-1/2 left-1/3 text-5xl z-10 celebration-spin-move" style={{ animationDelay: '1.2s' }}>🏆</div>
      <div className="absolute bottom-1/4 right-1/3 text-5xl z-10 celebration-float-diagonal" style={{ animationDelay: '0.3s' }}>🎪</div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-block mb-6 transform hover:scale-105 transition-all duration-300">
            <img 
              src="/logo.jpg" 
              alt="J.R. Initiated - Community Giveaway" 
              className="max-w-sm w-full h-auto rounded-3xl shadow-2xl mx-auto"
              style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))' }}
            />
            <div className="mt-3 flex justify-center items-center gap-3 text-2xl">
              <span className="animate-bounce">👨‍👦</span>
              <span className="animate-pulse">❤️</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</span>
            </div>
          </div>
          
          {/* Modern Title with Animated Elements */}
          <div className="relative inline-block mb-4">
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 text-4xl celebration-spin-move">🎁</div>
            <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-4xl celebration-spin-move" style={{ animationDelay: '0.5s' }}>🎁</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-pink-600 mb-2 drop-shadow-2xl px-20">
              J.R. Spring Cleaning
            </h1>
          </div>
          <div className="relative inline-block mb-6">
            <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 text-3xl celebration-twinkle">✨</div>
            <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 text-3xl celebration-twinkle" style={{ animationDelay: '0.3s' }}>✨</div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-green-600 px-16">
              Wheel of Gifts!
            </h2>
          </div>
          
          <p className="text-xl md:text-2xl text-green-700 font-bold mb-2 bg-white/80 backdrop-blur-sm inline-block px-6 py-2 rounded-full shadow-lg">
            Northeast Pennsylvania Community
          </p>
          <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto font-semibold mt-3 bg-white/70 backdrop-blur-sm inline-block px-6 py-2 rounded-full">
            Spin once for FREE amazing prizes! 🎉
          </p>
        </div>

        {/* HUGE CTA BUTTON - Stand Out */}
        <div className="text-center mb-10">
          <button
            onClick={() => setCurrentView('form')}
            data-testid="spin-now-button"
            className="relative group"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-500 via-blue-600 to-pink-600 text-white text-3xl md:text-5xl lg:text-6xl font-black py-8 px-16 md:px-24 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white">
              <span className="flex items-center justify-center gap-4">
                <span className="text-5xl md:text-6xl animate-bounce">🎡</span>
                <span>SPIN NOW!</span>
                <span className="text-5xl md:text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</span>
              </span>
              <div className="text-xl md:text-2xl font-normal mt-2 opacity-90">
                Click to Win Prizes! 🏆
              </div>
            </div>
          </button>
          <p className="mt-6 text-lg md:text-xl text-gray-800 font-bold bg-yellow-200/80 backdrop-blur-sm inline-block px-8 py-3 rounded-full shadow-lg animate-pulse">
            ⚡ Limited Time: One Spin Per Person! ⚡
          </p>
        </div>

        {/* Prizes Display */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 max-w-4xl mx-auto">
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
          <p className="mt-4 text-gray-700 font-semibold">
            Open to Northeast Pennsylvania residents only
          </p>
        </div>
      </div>
    </div>
  );

  // Form View
  const FormView = () => (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      <div className="animated-bg"></div>
      
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10">
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
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4">
      <div className="animated-bg"></div>
      
      <h2 className="text-4xl font-bold text-green-700 mb-8 animate-pulse relative z-10">
        Spinning...
      </h2>
      
      <div className="relative z-10">
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

      <p className="mt-8 text-xl text-gray-700 font-semibold relative z-10 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full">
        Good luck, {formData.name}! 🍀
      </p>
    </div>
  );

  // Result View
  const ResultView = () => {
    const isWinner = result?.prize !== 'Better Luck Next Time';
    
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
        <div className="animated-bg"></div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center relative z-10">
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
