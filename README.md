# 🌸 Northeast PA Spring Giveaway Wheel 🌸

A community giveaway spin-the-wheel application for Northeast Pennsylvania residents. Participants can spin once for a chance to win amazing prizes including cash, swim park tickets, cleaning services, and more!

## 🎁 Features

- **Interactive Spin Wheel**: Beautiful animated wheel with spring cleaning theme
- **One Spin Per Person**: Email-based tracking to ensure fairness
- **Location Verification**: Restricted to Northeast PA zip codes
- **Multiple Prizes**: 6 different prize tiers with weighted probabilities
- **Winner Tracking**: Admin endpoint to view all winners
- **Responsive Design**: Works on desktop and mobile devices
- **Spring Theme**: Fresh, colorful design with spring elements

## 🏆 Available Prizes

1. **$500 Cash Grand Prize** - 5% chance (Ultra rare!)
2. **2 Tickets to Kalahari Swim Park** - 20% chance
3. **Free T-Shirt** - 25% chance
4. **25% Off Full House Cleaning** - 20% chance
5. **BOGO Room Cleaning** - 20% chance
6. **Better Luck Next Time** - 10% chance

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **MongoDB**: NoSQL database for storing spins and winners
- **Pydantic**: Data validation
- **Python 3.x**

### Frontend
- **React 18**: Modern UI library
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP requests
- **Custom SVG Wheel**: Interactive animated wheel

## 📁 Project Structure

```
/app/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Component styles
│   │   ├── index.js      # Entry point
│   │   └── index.css     # Global styles
│   ├── public/
│   │   └── index.html    # HTML template
│   ├── package.json      # Node dependencies
│   ├── tailwind.config.js
│   └── .env             # Environment variables
└── memory/
    └── test_credentials.md

## 🚀 Getting Started

### Prerequisites
- Python 3.x
- Node.js & Yarn
- MongoDB

### Installation

1. **Install Backend Dependencies**
```bash
cd /app/backend
pip install -r requirements.txt
```

2. **Install Frontend Dependencies**
```bash
cd /app/frontend
yarn install
```

3. **Start Services**
```bash
sudo supervisorctl restart all
```

### Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## 🔌 API Endpoints

### Health Check
```bash
GET /api/health
```

### Get Available Prizes
```bash
GET /api/prizes
```

### Spin the Wheel
```bash
POST /api/spin
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "zipcode": "18201",
  "phone": "570-123-4567" (optional)
}
```

### Get Winners (Admin)
```bash
GET /api/winners
```

### Get Statistics
```bash
GET /api/stats
```

## 🎯 How It Works

1. **User visits** the landing page showing all available prizes
2. **Clicks "SPIN NOW"** to proceed to entry form
3. **Enters information**: name, email, Northeast PA zip code
4. **Spin validation**: System checks:
   - Email hasn't been used before
   - Zip code is valid Northeast PA area
5. **Wheel spins**: Animated 4-second spin with weighted random selection
6. **Result displayed**: User sees their prize (or "Better Luck Next Time")
7. **Winner notification**: Winners are contacted via provided email

## 🗺️ Northeast PA Coverage

The application validates zip codes for the following Northeast PA areas:
- Scranton/Wilkes-Barre
- Poconos region
- Hazleton area
- And more (200+ zip codes)

See `backend/server.py` for the complete list.

## 🎨 Customization

### Modify Prize Probabilities
Edit the `PRIZES` array in `/app/backend/server.py`:

```python
PRIZES = [
    {"name": "Prize Name", "weight": 20, "segments": 4},
    # weight: affects probability
    # segments: number of wheel segments
]
```

### Change Color Scheme
Edit colors in `/app/frontend/tailwind.config.js` and `/app/frontend/src/App.js`

### Update Zip Codes
Modify `NORTHEAST_PA_ZIPCODES` list in `/app/backend/server.py`

## 📊 Admin Features

View all winners and statistics:
```bash
curl http://localhost:8001/api/winners
curl http://localhost:8001/api/stats
```

## 🧪 Testing

Test the backend API:
```bash
# Test valid spin
curl -X POST http://localhost:8001/api/spin \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","zipcode":"18201"}'

# Test duplicate spin prevention
curl -X POST http://localhost:8001/api/spin \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","zipcode":"18201"}'

# Test invalid zip code
curl -X POST http://localhost:8001/api/spin \
  -H "Content-Type: application/json" \
  -d '{"name":"Out","email":"out@example.com","zipcode":"90210"}'
```

## 🔒 Security Features

- Email-based duplicate prevention
- Geographic restriction (Northeast PA only)
- Input validation with Pydantic
- CORS protection
- MongoDB injection prevention

## 📝 License

Community project for Northeast Pennsylvania residents.

## 🤝 Credits

**Branding**: J.R. Initiated - Real vs Fake Estate
**Region**: Northeast Pennsylvania
**Theme**: Spring Cleaning 2026

---

Built with ❤️ for the Northeast PA community!