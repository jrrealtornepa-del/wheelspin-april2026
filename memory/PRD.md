# Product Requirements Document (PRD)
## Northeast PA Spring Giveaway Wheel

### 1. Overview
A web-based spin-the-wheel giveaway application for the Northeast Pennsylvania community, featuring J.R. Initiated branding. The application allows local residents to spin once for a chance to win various prizes as part of a spring cleaning initiative.

### 2. Objectives
- Engage Northeast PA community with an interactive giveaway
- Promote J.R. Initiated / Real vs Fake Estate brand
- Distribute prizes fairly with weighted probabilities
- Ensure one spin per person to maintain fairness
- Collect participant information for prize distribution

### 3. Target Audience
- Northeast Pennsylvania residents (verified by zip code)
- All ages
- Community members interested in spring cleaning services and prizes

### 4. Core Features

#### 4.1 Landing Page
- Display J.R. Initiated branding image
- Show all available prizes with visual appeal
- Spring cleaning themed design (greens, blues, florals)
- Clear call-to-action: "SPIN NOW"
- Indicate "one spin per person" rule

#### 4.2 Entry Form
- **Required Fields**:
  - Full Name
  - Email Address (used for duplicate prevention)
  - Northeast PA Zip Code (validated against approved list)
- **Optional Fields**:
  - Phone Number
- Form validation with error messages
- Location verification before allowing spin

#### 4.3 Spin Wheel Interface
- Visual wheel divided into colored segments
- Smooth 4-second spinning animation
- Random prize selection based on weighted probabilities
- Visual feedback during spin

#### 4.4 Prize System
**Prize Configuration** (20 total segments):

| Prize | Probability | Segments | Color |
|-------|------------|----------|-------|
| $500 Cash Grand Prize | 5% | 1 | Gold |
| 2 Kalahari Swim Park Tickets | 20% | 4 | Blue |
| Free T-Shirt | 25% | 5 | Green |
| 25% Off Full House Cleaning | 20% | 4 | Pink |
| BOGO Room Cleaning | 20% | 4 | Purple |
| Better Luck Next Time | 10% | 2 | Red |

#### 4.5 Result Display
- Animated result reveal
- Winner: Show confetti animation and prize details
- Non-winner: Friendly "Better Luck Next Time" message
- Inform user about next steps (email contact)
- "Back to Home" button

#### 4.6 Duplicate Prevention
- Track spins by email address
- Prevent multiple spins from same email
- Clear error message if already spun

#### 4.7 Geographic Restriction
- Validate zip codes against Northeast PA list
- 200+ approved zip codes covering:
  - Scranton/Wilkes-Barre area
  - Poconos region
  - Hazleton area
  - Surrounding communities
- Reject non-NE PA zip codes with clear message

### 5. Technical Requirements

#### 5.1 Backend (FastAPI + MongoDB)
- RESTful API endpoints
- MongoDB for data persistence
- Email-based duplicate tracking
- Weighted random prize selection
- Input validation and sanitization

#### 5.2 Frontend (React + Tailwind CSS)
- Single Page Application (SPA)
- Responsive design (mobile + desktop)
- Smooth animations and transitions
- Accessible UI components
- Spring theme with custom colors

#### 5.3 Data Storage
**Spins Collection**:
- name, email, phone, zipcode
- prize, timestamp
- Used for duplicate prevention

**Winners Collection**:
- name, email, phone, zipcode
- prize, claimed status, timestamp
- Excludes "Better Luck Next Time"

### 6. User Flow

```
1. User lands on home page
   ↓
2. Views prizes and branding
   ↓
3. Clicks "SPIN NOW"
   ↓
4. Fills entry form (name, email, zip)
   ↓
5. System validates:
   - Email not previously used ✓
   - Zip code is Northeast PA ✓
   ↓
6. Wheel spins (4 seconds)
   ↓
7. Prize selected (weighted random)
   ↓
8. Result displayed with animation
   ↓
9. Winner info stored in database
   ↓
10. User receives confirmation
```

### 7. Admin Features
- `/api/winners` - View all winners
- `/api/stats` - View spin statistics
- Prize distribution analytics

### 8. Design Specifications

#### 8.1 Color Palette
- **Primary**: Green (#4ade80) - Spring theme
- **Secondary**: Blue (#60a5fa) - Fresh, clean
- **Accent**: Pink (#f9a8d4) - Vibrant, fun
- **Warning**: Yellow (#fbbf24) - Grand prize
- **Neutral**: Grays for text and backgrounds

#### 8.2 Typography
- Headings: Bold, large (3xl-7xl)
- Body: Clean, readable
- Buttons: Bold, prominent

#### 8.3 Animations
- Wheel spin: 4s cubic-bezier easing
- Confetti: For winners only
- Float: Decorative elements
- Smooth transitions throughout

### 9. Success Metrics
- Number of total spins
- Number of winners per prize category
- Geographic distribution of participants
- User engagement time
- Completion rate (form → spin → result)

### 10. Future Enhancements (Out of Scope for MVP)
- Social media sharing
- Leaderboard or recent winners display
- Multi-language support
- Email automation for winners
- Admin dashboard UI
- Prize claiming workflow
- Multiple concurrent campaigns

### 11. Constraints
- One spin per email (lifetime)
- Northeast PA residents only
- No purchase necessary
- No account creation required

### 12. Security Considerations
- Input validation on all fields
- Email format verification
- Zip code whitelist validation
- MongoDB injection prevention
- CORS configuration
- No sensitive data exposure in frontend

### 13. Performance Requirements
- Page load time: < 3 seconds
- Spin animation: Smooth 60fps
- API response time: < 500ms
- Mobile responsive: All screen sizes
- Browser support: Modern browsers (Chrome, Firefox, Safari, Edge)

### 14. Launch Checklist
- ✅ Backend API implemented and tested
- ✅ Frontend UI completed with all views
- ✅ Database configured and connected
- ✅ Prize probabilities configured correctly
- ✅ Zip code validation working
- ✅ Duplicate prevention working
- ✅ Animations smooth and appealing
- ✅ Mobile responsiveness verified
- ✅ Error handling implemented
- ✅ Branding image integrated

### 15. Support & Maintenance
- Monitor database for issues
- Review winner distributions
- Update zip codes if needed
- Adjust prize probabilities based on inventory
- Handle winner inquiries via provided contact info
