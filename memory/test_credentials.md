# Northeast PA Spring Giveaway Wheel - Test Credentials

## Test Users

### Test User 1 (Already Spun)
- **Name**: Test User
- **Email**: test@example.com
- **Zip Code**: 18201
- **Phone**: 570-123-4567
- **Status**: Already used spin
- **Prize Won**: Free T-Shirt

### Available Test Zip Codes (Northeast PA)
- 18201, 18202, 18210, 18301, 18501, 18701
- Full list available in backend/server.py

### Invalid Zip Codes (for testing)
- 90210 (California - should be rejected)
- 10001 (NYC - should be rejected)

## API Endpoints

### Backend (http://localhost:8001)
- GET /api/health - Health check
- GET /api/prizes - Get all available prizes
- POST /api/spin - Perform a spin (requires: name, email, zipcode)
- GET /api/winners - Get all winners
- GET /api/stats - Get spin statistics

### Frontend (http://localhost:3000)
- Main application with spin wheel interface

## Prize Configuration
1. $500 Cash Grand Prize - 5% chance (1 segment)
2. 2 Tickets to Kalahari Swim Park - 20% chance (4 segments)
3. Free T-Shirt - 25% chance (5 segments)
4. 25% Off Full House Cleaning - 20% chance (4 segments)
5. BOGO Room Cleaning - 20% chance (4 segments)
6. Better Luck Next Time - 10% chance (2 segments)

Total: 20 segments on the wheel
