#!/usr/bin/env python3
"""
Backend API Testing for Northeast PA Spring Giveaway Wheel
Tests all endpoints with various scenarios including edge cases
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class SpringGiveawayAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Dict[Any, Any] = None, headers: Dict[str, str] = None) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (expected {expected_status})"
                if response.text:
                    details += f", Response: {response.text[:200]}"
            
            self.log_test(name, success, details)
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}
                
            return success, response_data, response.status_code

        except requests.exceptions.RequestException as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}, 0
        except Exception as e:
            self.log_test(name, False, f"Unexpected error: {str(e)}")
            return False, {}, 0

    def test_health_endpoint(self):
        """Test health check endpoint"""
        success, data, status = self.run_test(
            "Health Check",
            "GET",
            "/api/health",
            200
        )
        
        if success and data.get("status") == "healthy":
            self.log_test("Health Status Content", True, "Status is healthy")
        elif success:
            self.log_test("Health Status Content", False, f"Unexpected status: {data.get('status')}")
        
        return success

    def test_prizes_endpoint(self):
        """Test prizes endpoint"""
        success, data, status = self.run_test(
            "Get Prizes",
            "GET", 
            "/api/prizes",
            200
        )
        
        if success:
            prizes = data.get("prizes", [])
            if len(prizes) == 6:
                self.log_test("Prizes Count", True, f"Found {len(prizes)} prizes")
                
                # Check prize structure
                expected_prizes = [
                    "$500 Cash Grand Prize",
                    "2 Tickets to Kalahari Swim Park", 
                    "Free T-Shirt",
                    "25% Off Full House Cleaning",
                    "BOGO Room Cleaning",
                    "Better Luck Next Time"
                ]
                
                prize_names = [p.get("name") for p in prizes]
                missing_prizes = [p for p in expected_prizes if p not in prize_names]
                
                if not missing_prizes:
                    self.log_test("Prize Names", True, "All expected prizes found")
                else:
                    self.log_test("Prize Names", False, f"Missing prizes: {missing_prizes}")
                    
            else:
                self.log_test("Prizes Count", False, f"Expected 6 prizes, got {len(prizes)}")
        
        return success

    def test_valid_spin(self):
        """Test valid spin with Northeast PA zip code"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_data = {
            "name": "Test User Valid",
            "email": f"test_valid_{timestamp}@example.com",
            "zipcode": "18201",
            "phone": "570-555-0100"
        }
        
        success, data, status = self.run_test(
            "Valid Spin (18201)",
            "POST",
            "/api/spin", 
            200,
            test_data
        )
        
        if success:
            if data.get("success") and data.get("prize"):
                self.log_test("Spin Success Response", True, f"Won: {data.get('prize')}")
                return True, data.get("prize")
            else:
                self.log_test("Spin Success Response", False, f"Unexpected response: {data}")
        
        return False, None

    def test_duplicate_spin(self):
        """Test duplicate spin prevention"""
        # Use the test user from credentials that already spun
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "zipcode": "18201",
            "phone": "570-123-4567"
        }
        
        success, data, status = self.run_test(
            "Duplicate Spin Prevention",
            "POST",
            "/api/spin",
            200,  # Should return 200 but with success=false
            test_data
        )
        
        if success:
            if not data.get("success") and data.get("already_spun"):
                self.log_test("Duplicate Detection", True, "Correctly detected duplicate spin")
            else:
                self.log_test("Duplicate Detection", False, f"Should have detected duplicate: {data}")
        
        return success

    def test_invalid_zipcode(self):
        """Test invalid zip code rejection"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Test California zip code
        test_data = {
            "name": "Test User CA",
            "email": f"test_ca_{timestamp}@example.com", 
            "zipcode": "90210",
            "phone": "310-555-0100"
        }
        
        success, data, status = self.run_test(
            "Invalid Zip Code (90210)",
            "POST",
            "/api/spin",
            400,  # Should return 400 Bad Request
            test_data
        )
        
        if success and "Northeast Pennsylvania" in str(data):
            self.log_test("Zip Code Error Message", True, "Correct error message")
        elif success:
            self.log_test("Zip Code Error Message", False, f"Unexpected error: {data}")
        
        # Test NYC zip code
        test_data["email"] = f"test_nyc_{timestamp}@example.com"
        test_data["zipcode"] = "10001"
        
        success2, data2, status2 = self.run_test(
            "Invalid Zip Code (10001)",
            "POST", 
            "/api/spin",
            400,
            test_data
        )
        
        return success and success2

    def test_winners_endpoint(self):
        """Test winners endpoint"""
        success, data, status = self.run_test(
            "Get Winners",
            "GET",
            "/api/winners",
            200
        )
        
        if success:
            winners = data.get("winners", [])
            total_winners = data.get("total_winners", 0)
            
            if len(winners) == total_winners:
                self.log_test("Winners Count Consistency", True, f"Found {total_winners} winners")
            else:
                self.log_test("Winners Count Consistency", False, 
                            f"Count mismatch: {len(winners)} vs {total_winners}")
        
        return success

    def test_stats_endpoint(self):
        """Test statistics endpoint"""
        success, data, status = self.run_test(
            "Get Statistics", 
            "GET",
            "/api/stats",
            200
        )
        
        if success:
            required_fields = ["total_spins", "total_winners", "prize_distribution"]
            missing_fields = [f for f in required_fields if f not in data]
            
            if not missing_fields:
                self.log_test("Stats Fields", True, "All required fields present")
                
                # Check prize distribution structure
                prize_dist = data.get("prize_distribution", {})
                if isinstance(prize_dist, dict) and len(prize_dist) > 0:
                    self.log_test("Prize Distribution", True, f"Found {len(prize_dist)} prize types")
                else:
                    self.log_test("Prize Distribution", False, "Invalid prize distribution format")
            else:
                self.log_test("Stats Fields", False, f"Missing fields: {missing_fields}")
        
        return success

    def test_form_validation(self):
        """Test form validation scenarios"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Test missing required fields
        test_cases = [
            {
                "name": "Missing Name Field",
                "data": {"email": f"test1_{timestamp}@example.com", "zipcode": "18201"},
                "expected_status": 422
            },
            {
                "name": "Missing Email Field", 
                "data": {"name": "Test User", "zipcode": "18201"},
                "expected_status": 422
            },
            {
                "name": "Missing Zipcode Field",
                "data": {"name": "Test User", "email": f"test2_{timestamp}@example.com"},
                "expected_status": 422
            },
            {
                "name": "Invalid Email Format",
                "data": {"name": "Test User", "email": "invalid-email", "zipcode": "18201"},
                "expected_status": 422
            }
        ]
        
        all_passed = True
        for test_case in test_cases:
            success, _, _ = self.run_test(
                test_case["name"],
                "POST",
                "/api/spin",
                test_case["expected_status"],
                test_case["data"]
            )
            if not success:
                all_passed = False
        
        return all_passed

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🧪 Starting Northeast PA Spring Giveaway Wheel API Tests")
        print("=" * 60)
        
        # Test basic endpoints
        print("\n📡 Testing Basic Endpoints...")
        self.test_health_endpoint()
        self.test_prizes_endpoint()
        
        # Test spin functionality
        print("\n🎡 Testing Spin Functionality...")
        valid_spin_success, prize_won = self.test_valid_spin()
        self.test_duplicate_spin()
        self.test_invalid_zipcode()
        
        # Test data endpoints
        print("\n📊 Testing Data Endpoints...")
        self.test_winners_endpoint()
        self.test_stats_endpoint()
        
        # Test validation
        print("\n✅ Testing Form Validation...")
        self.test_form_validation()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        # Show failed tests
        failed_tests = [t for t in self.test_results if not t["success"]]
        if failed_tests:
            print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        else:
            print("\n🎉 ALL TESTS PASSED!")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    # Use the public endpoint from frontend .env
    backend_url = "http://localhost:8001"
    
    print(f"🎯 Testing backend at: {backend_url}")
    
    tester = SpringGiveawayAPITester(backend_url)
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())