#!/usr/bin/env python3
"""
Test script for BoviFace Backend API
Run this script to test the API endpoints
"""

import requests
import json
from pathlib import Path

API_BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test the health check endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/api/v1/health")
        if response.status_code == 200:
            print("✅ Health check passed!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API. Make sure the server is running on localhost:8000")
        return False
    return True

def test_breeds_endpoint():
    """Test the breeds endpoint"""
    print("\n🔍 Testing breeds endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/api/v1/breeds")
        if response.status_code == 200:
            data = response.json()
            print("✅ Breeds endpoint working!")
            print(f"Available breeds: {len(data['breeds'])}")
            print(f"First 5 breeds: {data['breeds'][:5]}")
        else:
            print(f"❌ Breeds endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing breeds endpoint: {e}")

def test_analyze_endpoint():
    """Test the analyze endpoint with mock data"""
    print("\n🔍 Testing analyze endpoint...")
    
    # Create mock image files for testing
    mock_cattle_path = "test_cattle.jpg"
    mock_muzzle_path = "test_muzzle.jpg"
    
    # Create simple test images (1x1 pixel)
    from PIL import Image
    Image.new('RGB', (1, 1), color='red').save(mock_cattle_path)
    Image.new('RGB', (1, 1), color='blue').save(mock_muzzle_path)
    
    try:
        with open(mock_cattle_path, 'rb') as cattle_file, open(mock_muzzle_path, 'rb') as muzzle_file:
            files = {
                'cattle_image': ('cattle.jpg', cattle_file, 'image/jpeg'),
                'muzzle_image': ('muzzle.jpg', muzzle_file, 'image/jpeg')
            }
            data = {
                'name': 'Test Cow',
                'age': '24',
                'breed': 'Holstein',
                'weight': '500',
                'location': 'Test Farm'
            }
            
            response = requests.post(f"{API_BASE_URL}/api/v1/analyze", files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Analyze endpoint working!")
                print(f"Analysis ID: {result.get('analysis_id')}")
                print(f"Predictions: {len(result.get('predictions', []))}")
                for i, pred in enumerate(result.get('predictions', [])[:3]):
                    print(f"  {i+1}. {pred['breed']} - {pred['confidence']:.2f}")
            else:
                print(f"❌ Analyze endpoint failed: {response.status_code}")
                print(f"Error: {response.text}")
                
    except Exception as e:
        print(f"❌ Error testing analyze endpoint: {e}")
    finally:
        # Clean up test files
        Path(mock_cattle_path).unlink(missing_ok=True)
        Path(mock_muzzle_path).unlink(missing_ok=True)

def main():
    print("🐄 BoviFace Backend API Test")
    print("=" * 40)
    
    # Test basic connectivity
    if not test_health_endpoint():
        print("\n❌ Server is not running. Please start the backend server first:")
        print("   cd bovi-backend")
        print("   python main.py")
        return
    
    # Test other endpoints
    test_breeds_endpoint()
    test_analyze_endpoint()
    
    print("\n🎉 API testing completed!")
    print("\nTo test with the mobile app:")
    print("1. Make sure the backend is running on localhost:8000")
    print("2. Update the API_BASE_URL in your mobile app if needed")
    print("3. Run the mobile app and try the camera → form → result flow")

if __name__ == "__main__":
    main()
