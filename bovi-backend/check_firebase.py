#!/usr/bin/env python3
"""
Firebase Setup Helper Script
Run this script to check your Firebase configuration
"""

import os
import sys

def check_firebase_setup():
    """Check if Firebase is properly configured"""
    print("🔍 Checking Firebase Setup...")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("services/firebase_service.py"):
        print("❌ Please run this script from the bovi-backend directory")
        return False
    
    # Check for service account file
    if os.path.exists("firebase-service-account.json"):
        print("✅ Firebase service account file found")
    else:
        print("⚠️ Firebase service account file not found")
        print("   Download from: Firebase Console → Project Settings → Service Accounts")
        print("   Save as: firebase-service-account.json")
    
    # Check for environment file
    if os.path.exists(".env"):
        print("✅ Environment file found")
        with open(".env", "r") as f:
            content = f.read()
            if "FIREBASE_STORAGE_BUCKET" in content:
                print("✅ Firebase storage bucket configured")
            else:
                print("⚠️ Firebase storage bucket not configured in .env")
    else:
        print("⚠️ Environment file not found")
        print("   Create .env file with:")
        print("   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com")
        print("   FIREBASE_PROJECT_ID=your-project-id")
    
    # Check Python dependencies
    try:
        import firebase_admin
        print("✅ Firebase Admin SDK installed")
    except ImportError:
        print("❌ Firebase Admin SDK not installed")
        print("   Run: pip install firebase-admin")
    
    print("\n" + "=" * 50)
    print("📋 Next Steps:")
    print("1. Create Firebase project at https://console.firebase.google.com/")
    print("2. Download service account key")
    print("3. Create .env file with your project details")
    print("4. Install dependencies: pip install firebase-admin")
    print("5. Test: python main.py")

if __name__ == "__main__":
    check_firebase_setup()
