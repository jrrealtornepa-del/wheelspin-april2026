from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import random
import asyncio
import resend
from datetime import datetime
from typing import Optional

load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/spring_giveaway')
client = MongoClient(MONGO_URL)
db = client.spring_giveaway

# Resend configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
resend.api_key = RESEND_API_KEY

# Collections
spins_collection = db.spins
winners_collection = db.winners

# Northeast PA zip codes (sample list - add more as needed)
NORTHEAST_PA_ZIPCODES = [
    '18201', '18202', '18210', '18211', '18212', '18216', '18218', '18219', '18220',
    '18221', '18222', '18223', '18224', '18229', '18230', '18231', '18232', '18234',
    '18235', '18237', '18239', '18240', '18241', '18242', '18243', '18244', '18245',
    '18246', '18247', '18248', '18249', '18250', '18251', '18252', '18254', '18255',
    '18256', '18301', '18302', '18320', '18321', '18322', '18323', '18324', '18325',
    '18326', '18327', '18328', '18330', '18331', '18332', '18333', '18334', '18335',
    '18336', '18337', '18340', '18341', '18342', '18343', '18344', '18346', '18347',
    '18348', '18349', '18350', '18351', '18352', '18353', '18354', '18355', '18356',
    '18357', '18360', '18370', '18371', '18372', '18399', '18403', '18405', '18407',
    '18410', '18411', '18413', '18414', '18415', '18417', '18419', '18421', '18424',
    '18425', '18426', '18427', '18428', '18430', '18431', '18433', '18434', '18435',
    '18436', '18437', '18438', '18439', '18440', '18441', '18443', '18444', '18445',
    '18446', '18447', '18448', '18451', '18452', '18453', '18454', '18455', '18456',
    '18457', '18458', '18459', '18460', '18461', '18462', '18463', '18464', '18465',
    '18466', '18469', '18470', '18471', '18472', '18473', '18501', '18502', '18503',
    '18504', '18505', '18507', '18508', '18509', '18510', '18512', '18515', '18517',
    '18518', '18519', '18540', '18577', '18601', '18602', '18603', '18610', '18611',
    '18612', '18613', '18614', '18615', '18616', '18617', '18618', '18619', '18621',
    '18622', '18623', '18624', '18625', '18626', '18627', '18628', '18629', '18630',
    '18631', '18632', '18634', '18635', '18636', '18640', '18641', '18642', '18643',
    '18644', '18651', '18655', '18656', '18660', '18661', '18690', '18701', '18702',
    '18703', '18704', '18705', '18706', '18707', '18708', '18709', '18710', '18711',
    '18762', '18764', '18765', '18766', '18767', '18768', '18769', '18801', '18810',
    '18812', '18813', '18814', '18815', '18816', '18817', '18818', '18821', '18822',
    '18823', '18824', '18825', '18826', '18828', '18829', '18830', '18831', '18832',
    '18833', '18834', '18837', '18839', '18840', '18842', '18843', '18844', '18845',
    '18846', '18847', '18848', '18850', '18851', '18853', '18854', '18901', '18902',
]

# Prize configuration with weighted probabilities
PRIZES = [
    {"name": "$500 Cash Grand Prize", "weight": 5, "segments": 1},
    {"name": "2 Tickets to Kalahari Swim Park", "weight": 15, "segments": 3},
    {"name": "One Free House Analysis Breakdown", "weight": 20, "segments": 4},
    {"name": "ONE FREE House Declutter/Items Removal Clean out (Junk Removal)", "weight": 15, "segments": 3},
    {"name": "50% Off Bathroom or Kitchen Top Tier Cleaning Services", "weight": 15, "segments": 3},
    {"name": "BOGO Room Cleaning", "weight": 15, "segments": 3},
    {"name": "Better Luck Next Time", "weight": 15, "segments": 3},
]

# Models
class SpinRequest(BaseModel):
    name: str
    email: EmailStr
    zipcode: str
    phone: Optional[str] = None

class SpinResponse(BaseModel):
    success: bool
    prize: Optional[str] = None
    message: str
    already_spun: bool = False

@app.get("/")
def read_root():
    return {"message": "Northeast PA Spring Giveaway Wheel API", "status": "active"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

@app.post("/api/verify-zipcode")
def verify_zipcode(data: dict):
    zipcode = data.get("zipcode", "")
    is_valid = zipcode in NORTHEAST_PA_ZIPCODES
    return {"valid": is_valid, "zipcode": zipcode}

@app.post("/api/spin", response_model=SpinResponse)
def spin_wheel(request: SpinRequest):
    """
    Perform a spin on the wheel
    - Checks if user has already spun (by email)
    - Verifies Northeast PA zipcode
    - Randomly selects a prize based on weighted probabilities
    - Stores the result
    """
    
    # Check if email has already spun
    existing_spin = spins_collection.find_one({"email": request.email.lower()})
    if existing_spin:
        return SpinResponse(
            success=False,
            message="You've already spun the wheel! Only one spin per person.",
            already_spun=True
        )
    
    # Verify zipcode is from Northeast PA
    if request.zipcode not in NORTHEAST_PA_ZIPCODES:
        raise HTTPException(
            status_code=400,
            detail="Sorry, this giveaway is only available to Northeast Pennsylvania residents."
        )
    
    # Select prize based on weighted probabilities
    prizes_pool = []
    for prize in PRIZES:
        prizes_pool.extend([prize["name"]] * prize["weight"])
    
    selected_prize = random.choice(prizes_pool)
    
    # Store spin record
    spin_record = {
        "name": request.name,
        "email": request.email.lower(),
        "phone": request.phone,
        "zipcode": request.zipcode,
        "prize": selected_prize,
        "timestamp": datetime.utcnow(),
        "ip_address": None  # Can be added if needed
    }
    
    spins_collection.insert_one(spin_record)
    
    # If won something (not "Better Luck Next Time"), store in winners collection
    if selected_prize != "Better Luck Next Time":
        winner_record = {
            "name": request.name,
            "email": request.email.lower(),
            "phone": request.phone,
            "zipcode": request.zipcode,
            "prize": selected_prize,
            "claimed": False,
            "timestamp": datetime.utcnow()
        }
        winners_collection.insert_one(winner_record)
    
    return SpinResponse(
        success=True,
        prize=selected_prize,
        message=f"Congratulations! You won: {selected_prize}" if selected_prize != "Better Luck Next Time" 
                else "Better luck next time! Thanks for participating!",
        already_spun=False
    )

@app.get("/api/winners")
def get_winners():
    """Get all winners (for admin view)"""
    winners = list(winners_collection.find({}, {"_id": 0}).sort("timestamp", -1))
    
    # Convert datetime to string for JSON serialization
    for winner in winners:
        if "timestamp" in winner:
            winner["timestamp"] = winner["timestamp"].isoformat()
    
    return {"winners": winners, "total_winners": len(winners)}

@app.get("/api/stats")
def get_stats():
    """Get statistics about spins"""
    total_spins = spins_collection.count_documents({})
    total_winners = winners_collection.count_documents({})
    
    # Count prizes
    prize_counts = {}
    for prize in PRIZES:
        count = spins_collection.count_documents({"prize": prize["name"]})
        prize_counts[prize["name"]] = count
    
    return {
        "total_spins": total_spins,
        "total_winners": total_winners,
        "prize_distribution": prize_counts
    }

@app.get("/api/prizes")
def get_prizes():
    """Get list of all available prizes with their configuration"""
    return {"prizes": PRIZES}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
