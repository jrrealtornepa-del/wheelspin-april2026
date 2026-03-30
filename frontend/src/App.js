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
  const [audioEnabled, setAudioEnabled] = useState(false);
  const wheelRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const clickSoundRef = useRef(null);
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);

  // Prize colors for the wheel
  const prizeColors = [
    '#fbbf24', // gold for $500
    '#60a5fa', // blue for Kalahari
    '#4ade80', // green for House Analysis
    '#fb923c', // orange for Junk Removal
    '#f9a8d4', // pink for 50% off
    '#a78bfa', // purple for BOGO
    '#ef4444'  // red for no win
  ];

  useEffect(() => {
    fetchPrizes();
    initializeAudio();
  }, []);

  const initializeAudio = () => {
    // Create audio context and sounds
    clickSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    spinSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    winSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    
    // Background music - upbeat urban
    backgroundMusicRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2470/2470-preview.mp3');
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.3;
  };

  const enableAudio = () => {
    if (!audioEnabled) {
      setAudioEnabled(true);
      backgroundMusicRef.current?.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const playClickSound = () => {
    if (audioEnabled && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(e => console.log('Click sound failed:', e));
    }
  };

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
    playClickSound();
    
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
        // Play spinning sound
        if (audioEnabled && spinSoundRef.current) {
          spinSoundRef.current.currentTime = 0;
          spinSoundRef.current.play().catch(e => console.log('Spin sound failed:', e));
        }
        
        // Slower spin animation - 7 seconds
        if (wheelRef.current) {
          const randomRotation = 2520 + Math.random() * 360; // More rotations for dramatic effect
          wheelRef.current.style.transform = `rotate(${randomRotation}deg)`;
          wheelRef.current.style.transition = 'transform 7s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        }

        // Wait for animation to complete
        setTimeout(() => {
          // Play celebration sound for winners
          if (response.data.prize !== 'Better Luck Next Time') {
            if (audioEnabled && winSoundRef.current) {
              winSoundRef.current.currentTime = 0;
              winSoundRef.current.play().catch(e => console.log('Win sound failed:', e));
            }
          }
          
          setResult(response.data);
          setSpinning(false);
          setCurrentView('result');
          
          // Show confetti for winners
          if (response.data.prize !== 'Better Luck Next Time') {
            createConfetti();
          }
        }, 7000); // 7 seconds to match slower animation
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
    playClickSound();
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
      
      {/* Header */}
      <div className="relative z-20 bg-gradient-to-r from-green-600 via-blue-600 to-pink-600 text-white py-2 px-4 text-center shadow-lg">
        <p className="text-xs md:text-sm font-bold">
          Drop the L's, & Take the W: Presented by J.R. Griffith 🏆
        </p>
        {!audioEnabled && (
          <button
            onClick={enableAudio}
            className="mt-1 bg-yellow-400 text-gray-900 text-xs font-bold py-1 px-3 rounded-full hover:bg-yellow-300 transition animate-pulse"
          >
            🔊 Enable Sound & Music
          </button>
        )}
      </div>
      
      {/* Spring Cleaning & Prize-themed Elements - Animated and Dynamic */}
      <div className="absolute top-20 text-7xl z-10 urban-slide-left">🧹</div>
      <div className="absolute top-40 text-6xl z-10 urban-slide-right" style={{ animationDelay: '2s' }}>🧼</div>
      <div className="absolute top-60 text-5xl z-10 urban-slide-left" style={{ animationDelay: '5s' }}>💰</div>
      <div className="absolute bottom-40 text-6xl z-10 urban-slide-right" style={{ animationDelay: '8s' }}>🏊‍♂️</div>
      <div className="absolute bottom-20 text-7xl z-10 urban-slide-left" style={{ animationDelay: '12s' }}>🧽</div>
      
      {/* Keep the W Poster - Animated Floating Element */}
      <div className="absolute top-1/4 left-1/3 z-10 urban-float-diagonal-slow" style={{ animationDelay: '3s' }}>
        <img 
          src="/keep-the-w.jpg" 
          alt="Keep the W Drop the L" 
          className="w-32 md:w-40 h-auto rounded-xl shadow-2xl transform hover:scale-125 transition-all duration-300 opacity-80 hover:opacity-100"
        />
      </div>
      
      {/* Additional Keep the W posters in different positions */}
      <div className="absolute bottom-1/3 right-1/4 z-10 celebration-spin-move" style={{ animationDelay: '7s' }}>
        <img 
          src="/keep-the-w.jpg" 
          alt="Keep the W Drop the L" 
          className="w-28 md:w-36 h-auto rounded-xl shadow-2xl transform hover:scale-125 transition-all duration-300 opacity-70 hover:opacity-100"
        />
      </div>
      
      {/* Giveaway & Cleaning Elements - Floating */}
      <div className="absolute top-10 left-10 text-6xl z-10 celebration-float-diagonal">💵</div>
      <div className="absolute top-20 right-20 text-6xl z-10 celebration-bounce-horizontal" style={{ animationDelay: '1s' }}>🎁</div>
      <div className="absolute bottom-20 left-20 text-6xl z-10 celebration-float-wave" style={{ animationDelay: '2s' }}>🏆</div>
      <div className="absolute bottom-10 right-10 text-6xl z-10 celebration-spin-move" style={{ animationDelay: '1.5s' }}>✨</div>
      
      {/* Additional Prize & Cleaning Elements */}
      <div className="absolute top-1/3 left-5 text-5xl z-10 urban-float-diagonal-slow">🧴</div>
      <div className="absolute top-1/2 right-10 text-5xl z-10 urban-zoom-pulse" style={{ animationDelay: '1.8s' }}>🎫</div>
      <div className="absolute bottom-1/3 left-1/4 text-4xl z-10 urban-bounce-up" style={{ animationDelay: '0.8s' }}>🪣</div>
      <div className="absolute top-1/4 right-1/4 text-4xl z-10 celebration-float-wave" style={{ animationDelay: '2.2s' }}>💎</div>
      <div className="absolute top-1/2 left-1/3 text-5xl z-10 celebration-spin-move" style={{ animationDelay: '1.2s' }}>🚿</div>
      <div className="absolute bottom-1/4 right-1/3 text-5xl z-10 urban-float-diagonal-slow" style={{ animationDelay: '0.3s' }}>🪟</div>
      <div className="absolute top-3/4 left-10 text-4xl z-10 urban-zoom-pulse" style={{ animationDelay: '3s' }}>🧺</div>
      <div className="absolute top-1/6 right-1/3 text-5xl z-10 urban-bounce-up" style={{ animationDelay: '1.5s' }}>🎊</div>
      
      {/* More Prize & Cleaning themed elements */}
      <div className="absolute top-1/2 left-10 text-6xl z-10 celebration-twinkle" style={{ animationDelay: '0.5s' }}>🧽</div>
      <div className="absolute bottom-1/2 right-20 text-5xl z-10 urban-slide-left" style={{ animationDelay: '15s' }}>🧹</div>
      <div className="absolute top-2/3 right-10 text-4xl z-10 celebration-bounce-vertical" style={{ animationDelay: '2.5s' }}>💸</div>
      <div className="absolute bottom-1/5 left-1/4 text-5xl z-10 urban-slide-right" style={{ animationDelay: '18s' }}>🏊</div>
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Larger Logo with Music Rhythm Animation */}
        <div className="text-center mb-4">
          <div className="inline-block mb-4 logo-music-beat">
            <img 
              src="/logo-badge.png" 
              alt="J.R. The Realtor - Drop the L's, Take the W - Spring Cleaning 2026" 
              className="max-w-[320px] md:max-w-[400px] w-full h-auto mx-auto"
              style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))' }}
            />
          </div>
          
          {/* Title with Animated Spinning Prize Wheel Behind */}
          <div className="relative inline-block mb-4">
            {/* Animated Spinning Prize Wheel Behind Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
              <div className="prize-wheel-background"></div>
            </div>
            
            {/* Decorative spinning gift boxes */}
            <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 text-3xl celebration-spin-move z-10">🎁</div>
            <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 text-3xl celebration-spin-move z-10" style={{ animationDelay: '0.5s' }}>🎁</div>
            
            {/* Stars on sides */}
            <div className="absolute -left-20 top-1/4 text-3xl celebration-twinkle z-10">🌟</div>
            <div className="absolute -right-20 top-1/4 text-3xl celebration-twinkle z-10" style={{ animationDelay: '0.3s' }}>🌟</div>
            
            {/* Main Title Text */}
            <h2 className="relative text-4xl md:text-6xl lg:text-7xl font-black px-24 spring-wheel-title z-20">
              Spin the Spring Clean Wheel!
            </h2>
          </div>
          
          <p className="text-base md:text-lg text-gray-800 max-w-2xl mx-auto font-semibold mt-2 bg-white/70 backdrop-blur-sm inline-block px-5 py-2 rounded-full">
            Spin once for FREE amazing prizes! 🎉
          </p>
        </div>

        {/* Prizes Display - Compact Modern Giveaway Style */}
        <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 md:p-6 mb-6 max-w-4xl mx-auto border-4 border-white/50">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500">
              🎁 AMAZING PRIZES UP FOR GRABS! 🎁
            </span>
          </h2>
          <p className="text-center text-base md:text-lg font-bold text-gray-700 mb-4">
            Every spin is a chance to WIN! 🏆
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="relative group bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-xl shadow-lg transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-3 border-yellow-300">
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                RARE! 5%
              </div>
              <div className="text-4xl mb-2 text-center">💰</div>
              <h3 className="font-black text-white text-lg text-center mb-1">$500 CASH!</h3>
              <p className="text-yellow-50 text-center text-sm font-bold">Grand Prize!</p>
            </div>
            <div className="relative group bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-xl shadow-lg transform hover:scale-105 hover:-rotate-1 transition-all duration-300 border-3 border-blue-300">
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                15% CHANCE
              </div>
              <div className="text-4xl mb-2 text-center">🏊</div>
              <h3 className="font-black text-white text-lg text-center mb-1">2 Kalahari Tickets</h3>
              <p className="text-blue-50 text-center text-sm font-bold">Water Park Fun!</p>
            </div>
            <div className="relative group bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-xl shadow-lg transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-3 border-green-300">
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                20% CHANCE
              </div>
              <div className="text-4xl mb-2 text-center">📋</div>
              <h3 className="font-black text-white text-lg text-center mb-1">Free House Analysis</h3>
              <p className="text-green-50 text-center text-sm font-bold">Complete Breakdown!</p>
            </div>
            <div className="relative group bg-gradient-to-br from-orange-400 to-orange-600 p-4 rounded-xl shadow-lg transform hover:scale-105 hover:-rotate-1 transition-all duration-300 border-3 border-orange-300">
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                15% CHANCE
              </div>
              <div className="text-4xl mb-2 text-center">🗑️</div>
              <h3 className="font-black text-white text-base text-center mb-1">FREE Junk Removal</h3>
              <p className="text-orange-50 text-center text-sm font-bold">Declutter Cleanout!</p>
            </div>
            <div className="relative group bg-gradient-to-br from-pink-400 to-pink-600 p-4 rounded-xl shadow-lg transform hover:scale-105 hover:-rotate-1 transition-all duration-300 border-3 border-pink-300">
              <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                15% CHANCE
              </div>
              <div className="text-4xl mb-2 text-center">🧹</div>
              <h3 className="font-black text-white text-base text-center mb-1">50% Off Top Tier</h3>
              <p className="text-pink-50 text-center text-sm font-bold">Bath or Kitchen!</p>
            </div>
            <div className="relative group bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-xl shadow-lg transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-3 border-purple-300">
              <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                15% CHANCE
              </div>
              <div className="text-4xl mb-2 text-center">✨</div>
              <h3 className="font-black text-white text-lg text-center mb-1">BOGO Cleaning</h3>
              <p className="text-purple-50 text-center text-sm font-bold">2 Rooms for 1!</p>
            </div>
            <div className="relative group bg-gradient-to-br from-gray-500 to-gray-700 p-4 rounded-xl shadow-lg transform hover:scale-105 hover:-rotate-1 transition-all duration-300 border-3 border-gray-400">
              <div className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                5% CHANCE
              </div>
              <div className="text-4xl mb-2 text-center">🍀</div>
              <h3 className="font-black text-white text-lg text-center mb-1">Try Again!</h3>
              <p className="text-gray-50 text-center text-sm font-bold">Better luck next time</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <div className="bg-gradient-to-r from-green-500/90 to-blue-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg inline-block">
            <p className="text-base md:text-lg font-bold">
              📍 Exclusive for Northeast Pennsylvania Residents
            </p>
            <p className="text-xs md:text-sm mt-1 opacity-90">
              Valid zip codes only • One spin per person
            </p>
          </div>
        </div>

        {/* BUTTON AT BOTTOM - NO FLASH/PULSE, Visible hint */}
        <div className="text-center mb-4">
          <div className="mb-3">
            <p className="text-base md:text-lg text-gray-800 font-bold bg-yellow-200/80 backdrop-blur-sm inline-block px-6 py-2 rounded-full shadow-lg">
              ⚡ Limited Time: One Spin Per Person! ⚡
            </p>
          </div>
          
          {/* Scroll indicator */}
          <div className="mb-2 animate-bounce" style={{ animationDuration: '2s' }}>
            <span className="text-3xl">👇</span>
          </div>
          
          <button
            onClick={() => {
              playClickSound();
              enableAudio();
              setCurrentView('form');
            }}
            data-testid="spin-now-button"
            className="relative group inline-block"
          >
            {/* Glowing ring - no pulse */}
            <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
            
            {/* Button content - no animations */}
            <div className="relative bg-gradient-to-r from-green-500 via-blue-600 to-pink-600 text-white text-2xl md:text-4xl font-black py-5 px-10 md:px-16 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-yellow-300">
              <span className="flex items-center justify-center gap-3">
                <span className="text-3xl md:text-4xl">🎡</span>
                <span className="text-white">SPIN NOW!</span>
                <span className="text-3xl md:text-4xl">🎁</span>
              </span>
              <div className="text-base md:text-lg font-normal mt-1 opacity-90">
                Click to Win Prizes! 🏆
              </div>
            </div>
          </button>
        </div>
      </div>
      
      {/* Volunteer & Book Event Section */}
      <div className="relative z-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white py-8 px-4 text-center shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-black mb-4">
            🤝 Join Us at the Event! 🤝
          </h3>
          <p className="text-lg md:text-xl mb-6 font-semibold">
            Be part of the Drop the L's & Take the W Spring Cleaning Event!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-5xl mb-3">📅</div>
              <h4 className="text-xl font-bold mb-2">Add to Calendar</h4>
              <p className="text-sm mb-4">Don't miss out! Save the date.</p>
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Drop+the+L's+%26+Take+the+W+Spring+Cleaning+Event&dates=20260426T140000Z/20260426T170000Z&details=Join+J.R.+Griffith+for+an+exciting+spring+cleaning+giveaway+event!+Spin+the+wheel+for+amazing+prizes.&location=Kirby+Park,+Wilkes-Barre,+PA`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="inline-block bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-blue-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                📆 Add to Google Calendar
              </a>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-5xl mb-3">🙋</div>
              <h4 className="text-xl font-bold mb-2">Volunteer With Us</h4>
              <p className="text-sm mb-4">Help make a difference in our community!</p>
              <a
                href="mailto:jrrealtornepa@gmail.com?subject=Volunteer%20for%20Spring%20Cleaning%20Event&body=Hi%20J.R.,%0A%0AI%20would%20like%20to%20volunteer%20at%20the%20Drop%20the%20L's%20%26%20Take%20the%20W%20Spring%20Cleaning%20Event%20on%20April%2026th,%202026.%0A%0AName:%20%0APhone:%20%0AEmail:%20%0A%0AThank%20you!"
                onClick={playClickSound}
                className="inline-block bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                ✉️ Sign Up to Volunteer
              </a>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl inline-block">
            <p className="text-sm md:text-base font-bold">
              📍 <strong>Location:</strong> Kirby Park, Wilkes-Barre, PA<br/>
              🕒 <strong>Date & Time:</strong> April 26th, 2026 | 10:00 AM - 1:00 PM<br/>
              🎁 <strong>Free Event</strong> - Prizes, Fun, & Community Spirit!
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="relative z-20 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-4 px-4 text-center shadow-lg mt-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm md:text-base font-bold mb-2">
            ⭐ Over 40 ☆☆☆☆☆ Reviews & 10K Followers ⭐
          </p>
          <p className="text-xs md:text-sm mb-2">
            <strong>J.R. The Realtor</strong> | Northeast Pennsylvania
          </p>
          <p className="text-xs md:text-sm mb-2">
            📞 <a href="tel:570-846-5349" className="hover:text-yellow-300 transition">570-846-5349</a> | 
            ✉️ <a href="mailto:jrrealtornepa@gmail.com" className="hover:text-yellow-300 transition ml-2">jrrealtornepa@gmail.com</a>
          </p>
          <p className="text-xs md:text-sm mb-2">
            📱 <a href="https://www.Facebook.com/JRNEPA" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">Facebook.com/JRNEPA</a>
          </p>
          <p className="text-sm md:text-base font-bold mt-3 bg-green-600 inline-block px-6 py-2 rounded-full">
            📅 April 26th 2026 | 10am-1pm | 📍 Kirby Park, Wilkes-Barre PA
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
  const WheelView = () => {
    const prizeEmojis = ['💰', '🏊', '📋', '🗑️', '🧹', '✨', '🍀'];
    
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4">
        <div className="animated-bg"></div>
        
        <h2 className="text-4xl font-bold text-green-700 mb-8 animate-pulse relative z-10">
          Spinning... 🎡
        </h2>
        
        <div className="relative z-10">
          <div 
            ref={wheelRef}
            className="wheel-container w-80 h-80 md:w-96 md:h-96 rounded-full border-8 border-yellow-400 shadow-2xl"
            style={{ 
              transition: 'transform 7s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
              transform: 'rotate(0deg)'
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {prizes.map((prize, index) => {
                const segments = prize.segments;
                const totalSegments = prizes.reduce((sum, p) => sum + p.segments, 0);
                const startAngle = prizes.slice(0, index).reduce((sum, p) => sum + (p.segments * 360 / totalSegments), 0);
                const segmentAngle = (segments * 360) / totalSegments;
                const midAngle = startAngle + segmentAngle / 2;
                const textRadius = 30;
                const textX = 50 + textRadius * Math.cos((midAngle - 90) * Math.PI / 180);
                const textY = 50 + textRadius * Math.sin((midAngle - 90) * Math.PI / 180);
                
                return (
                  <g key={index}>
                    <path
                      d={describeArc(50, 50, 45, startAngle, startAngle + segmentAngle)}
                      fill={prizeColors[index % prizeColors.length]}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fontSize="8"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                    >
                      {prizeEmojis[index]}
                    </text>
                  </g>
                );
              })}
              <circle cx="50" cy="50" r="8" fill="white" stroke="#fbbf24" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-20">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-16 border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg"></div>
          </div>
        </div>

        <p className="mt-8 text-xl text-gray-700 font-semibold relative z-10 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full">
          Good luck, {formData.name}! 🍀
        </p>
      </div>
    );
  };

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
