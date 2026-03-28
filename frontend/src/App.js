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
      
      {/* Urban Street Elements - Animated and Dynamic */}
      <div className="absolute top-20 text-7xl z-10 urban-slide-left">🏙️</div>
      <div className="absolute top-40 text-6xl z-10 urban-slide-right" style={{ animationDelay: '2s' }}>🏢</div>
      <div className="absolute top-60 text-5xl z-10 urban-slide-left" style={{ animationDelay: '5s' }}>🚕</div>
      <div className="absolute bottom-40 text-6xl z-10 urban-slide-right" style={{ animationDelay: '8s' }}>🚦</div>
      <div className="absolute bottom-20 text-7xl z-10 urban-slide-left" style={{ animationDelay: '12s' }}>🏗️</div>
      
      {/* Giveaway Elements - Floating */}
      <div className="absolute top-10 left-10 text-6xl z-10 celebration-float-diagonal">🎁</div>
      <div className="absolute top-20 right-20 text-6xl z-10 celebration-bounce-horizontal" style={{ animationDelay: '1s' }}>🎉</div>
      <div className="absolute bottom-20 left-20 text-6xl z-10 celebration-float-wave" style={{ animationDelay: '2s' }}>🎊</div>
      <div className="absolute bottom-10 right-10 text-6xl z-10 celebration-spin-move" style={{ animationDelay: '1.5s' }}>✨</div>
      
      {/* Additional Urban Elements */}
      <div className="absolute top-1/3 left-5 text-5xl z-10 urban-float-diagonal-slow">🏪</div>
      <div className="absolute top-1/2 right-10 text-5xl z-10 urban-zoom-pulse" style={{ animationDelay: '1.8s' }}>🌆</div>
      <div className="absolute bottom-1/3 left-1/4 text-4xl z-10 urban-bounce-up" style={{ animationDelay: '0.8s' }}>🚌</div>
      <div className="absolute top-1/4 right-1/4 text-4xl z-10 celebration-float-wave" style={{ animationDelay: '2.2s' }}>🎀</div>
      <div className="absolute top-1/2 left-1/3 text-5xl z-10 celebration-spin-move" style={{ animationDelay: '1.2s' }}>🏆</div>
      <div className="absolute bottom-1/4 right-1/3 text-5xl z-10 urban-float-diagonal-slow" style={{ animationDelay: '0.3s' }}>🚧</div>
      <div className="absolute top-3/4 left-10 text-4xl z-10 urban-zoom-pulse" style={{ animationDelay: '3s' }}>🏘️</div>
      <div className="absolute top-1/6 right-1/3 text-5xl z-10 urban-bounce-up" style={{ animationDelay: '1.5s' }}>🛣️</div>
      
      {/* More Dynamic Elements */}
      <div className="absolute top-1/2 left-10 text-6xl z-10 celebration-twinkle" style={{ animationDelay: '0.5s' }}>💎</div>
      <div className="absolute bottom-1/2 right-20 text-5xl z-10 urban-slide-left" style={{ animationDelay: '15s' }}>🏬</div>
      <div className="absolute top-2/3 right-10 text-4xl z-10 celebration-bounce-vertical" style={{ animationDelay: '2.5s' }}>🎪</div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* New Logo - Circular Badge (Smaller & Animated) */}
        <div className="text-center mb-6">
          <div className="inline-block mb-6 transform hover:scale-110 transition-all duration-300 hover:rotate-6 animate-pulse">
            <img 
              src="/logo-badge.png" 
              alt="J.R. The Realtor - Drop the L's, Take the W - Spring Cleaning 2026" 
              className="max-w-xs md:max-w-sm w-full h-auto mx-auto"
              style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))' }}
            />
          </div>
          
          {/* Modern Title with Animated Elements */}
          <div className="relative inline-block mb-4">
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 text-4xl celebration-spin-move">🎁</div>
            <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-4xl celebration-spin-move" style={{ animationDelay: '0.5s' }}>🎁</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-pink-600 mb-2 drop-shadow-2xl px-20">
              J.R. Spring Cleaning
            </h1>
          </div>
          
          {/* Enhanced "Wheel of Gifts" with Special Effect */}
          <div className="relative inline-block mb-6">
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 text-4xl celebration-twinkle">✨</div>
            <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-4xl celebration-twinkle" style={{ animationDelay: '0.3s' }}>✨</div>
            
            {/* Glowing animated background effect */}
            <div className="absolute inset-0 blur-3xl opacity-60 animate-pulse">
              <div className="w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500"></div>
            </div>
            
            {/* Main text with multiple effects */}
            <h2 className="relative text-5xl md:text-7xl lg:text-8xl font-black px-20 wheel-title-effect">
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600 animate-pulse blur-sm">
                Wheel of Gifts!
              </span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-pink-500">
                Wheel of Gifts!
              </span>
            </h2>
          </div>
          
          <p className="text-xl md:text-2xl text-green-700 font-bold mb-2 bg-white/80 backdrop-blur-sm inline-block px-6 py-2 rounded-full shadow-lg">
            Northeast Pennsylvania Community
          </p>
          <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto font-semibold mt-3 bg-white/70 backdrop-blur-sm inline-block px-6 py-2 rounded-full">
            Spin once for FREE amazing prizes! 🎉
          </p>
        </div>

        {/* CENTERED, SLIGHTLY SMALLER BUT HIGHLY ANIMATED BUTTON */}
        <div className="text-center mb-10 flex justify-center">
          <button
            onClick={() => setCurrentView('form')}
            data-testid="spin-now-button"
            className="relative group animate-bounce"
            style={{ animationDuration: '2s' }}
          >
            {/* Glowing animated ring */}
            <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full blur-2xl opacity-75 group-hover:opacity-100 animate-pulse group-hover:animate-spin" style={{ animationDuration: '3s' }}></div>
            
            {/* Button content */}
            <div className="relative bg-gradient-to-r from-green-500 via-blue-600 to-pink-600 text-white text-2xl md:text-4xl lg:text-5xl font-black py-6 px-12 md:px-20 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-yellow-300 animate-pulse">
              <span className="flex items-center justify-center gap-3">
                <span className="text-4xl md:text-5xl animate-spin" style={{ animationDuration: '3s' }}>🎡</span>
                <span className="prize-button-text">SPIN NOW!</span>
                <span className="text-4xl md:text-5xl animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>🎁</span>
              </span>
              <div className="text-lg md:text-xl font-normal mt-2 opacity-90 animate-pulse">
                Click to Win Prizes! 🏆
              </div>
            </div>
            
            {/* Sparkle effects around button */}
            <div className="absolute -top-2 -right-2 text-3xl animate-bounce">✨</div>
            <div className="absolute -bottom-2 -left-2 text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>✨</div>
          </button>
        </div>
        <div className="text-center mb-8">
          <p className="text-lg md:text-xl text-gray-800 font-bold bg-yellow-200/80 backdrop-blur-sm inline-block px-8 py-3 rounded-full shadow-lg animate-pulse">
            ⚡ Limited Time: One Spin Per Person! ⚡
          </p>
        </div>

        {/* Prizes Display - Modern Giveaway Style */}
        <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-10 mb-8 max-w-5xl mx-auto border-4 border-white/50">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500">
              🎁 AMAZING PRIZES UP FOR GRABS! 🎁
            </span>
          </h2>
          <p className="text-center text-lg md:text-xl font-bold text-gray-700 mb-6">
            Every spin is a chance to WIN! 🏆
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="relative group bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-4 border-yellow-300">
              <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                RARE! 5%
              </div>
              <div className="text-5xl mb-3 text-center">💰</div>
              <h3 className="font-black text-white text-2xl text-center mb-1">$500 CASH!</h3>
              <p className="text-yellow-50 text-center font-bold">Grand Prize Winner!</p>
            </div>
            <div className="relative group bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-2xl shadow-xl transform hover:scale-105 hover:-rotate-1 transition-all duration-300 border-4 border-blue-300">
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                20% CHANCE
              </div>
              <div className="text-5xl mb-3 text-center">🏊</div>
              <h3 className="font-black text-white text-xl text-center mb-1">2 Kalahari Tickets</h3>
              <p className="text-blue-50 text-center font-bold">Water Park Fun!</p>
            </div>
            <div className="relative group bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-2xl shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-4 border-green-300">
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                25% CHANCE
              </div>
              <div className="text-5xl mb-3 text-center">👕</div>
              <h3 className="font-black text-white text-xl text-center mb-1">Free T-Shirt</h3>
              <p className="text-green-50 text-center font-bold">Best odds!</p>
            </div>
            <div className="relative group bg-gradient-to-br from-pink-400 to-pink-600 p-6 rounded-2xl shadow-xl transform hover:scale-105 hover:-rotate-1 transition-all duration-300 border-4 border-pink-300">
              <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                20% CHANCE
              </div>
              <div className="text-5xl mb-3 text-center">🧹</div>
              <h3 className="font-black text-white text-xl text-center mb-1">25% Off Cleaning</h3>
              <p className="text-pink-50 text-center font-bold">Full House Service!</p>
            </div>
            <div className="relative group bg-gradient-to-br from-purple-400 to-purple-600 p-6 rounded-2xl shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-4 border-purple-300">
              <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                20% CHANCE
              </div>
              <div className="text-5xl mb-3 text-center">✨</div>
              <h3 className="font-black text-white text-xl text-center mb-1">BOGO Cleaning</h3>
              <p className="text-purple-50 text-center font-bold">2 Rooms for 1!</p>
            </div>
            <div className="relative group bg-gradient-to-br from-gray-500 to-gray-700 p-6 rounded-2xl shadow-xl transform hover:scale-105 hover:-rotate-1 transition-all duration-300 border-4 border-gray-400">
              <div className="absolute -top-3 -right-3 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                10% CHANCE
              </div>
              <div className="text-5xl mb-3 text-center">🍀</div>
              <h3 className="font-black text-white text-xl text-center mb-1">Try Again!</h3>
              <p className="text-gray-50 text-center font-bold">Better luck next time</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-green-500/90 to-blue-500/90 backdrop-blur-sm text-white px-8 py-4 rounded-2xl shadow-xl inline-block">
            <p className="text-lg md:text-xl font-bold">
              📍 Exclusive for Northeast Pennsylvania Residents
            </p>
            <p className="text-sm md:text-base mt-1 opacity-90">
              Valid zip codes only • One spin per person
            </p>
          </div>
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
