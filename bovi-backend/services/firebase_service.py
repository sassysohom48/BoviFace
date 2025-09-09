import os
import firebase_admin
from firebase_admin import credentials, firestore, storage
from typing import Optional
import json

class FirebaseService:
    def __init__(self):
        self.db = None
        self.bucket = None
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Check if Firebase is already initialized
            if firebase_admin._apps:
                app = firebase_admin.get_app()
            else:
                # Initialize with service account key
                if os.path.exists("firebase-service-account.json"):
                    cred = credentials.Certificate("firebase-service-account.json")
                    app = firebase_admin.initialize_app(cred, {
                        'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET', 'your-project.appspot.com')
                    })
                else:
                    # For development - use default credentials or environment
                    print("⚠️ No service account file found, using default credentials")
                    app = firebase_admin.initialize_app()
            
            self.db = firestore.client()
            # Initialize bucket with proper bucket name
            bucket_name = os.getenv('FIREBASE_STORAGE_BUCKET', 'your-project.appspot.com')
            self.bucket = storage.bucket(bucket_name)
            print("✅ Firebase initialized successfully")
            
        except Exception as e:
            print(f"⚠️ Firebase initialization failed: {e}")
            print("Running in development mode without Firebase")
            self.db = None
            self.bucket = None
    
    def save_analysis_result(self, analysis_data: dict) -> Optional[str]:
        """Save analysis result to Firestore"""
        if not self.db:
            print("Firebase not available, skipping database save")
            return None
        
        try:
            doc_ref = self.db.collection('cattle_analyses').add(analysis_data)
            doc_id = doc_ref[1].id
            print(f"✅ Analysis saved to Firebase with ID: {doc_id}")
            return doc_id
        except Exception as e:
            print(f"❌ Failed to save to Firebase: {e}")
            return None
    
    def upload_image_to_storage(self, file_path: str, blob_name: str) -> Optional[str]:
        """Upload image to Firebase Storage"""
        if not self.bucket:
            print("Firebase Storage not available, skipping upload")
            return None
        
        try:
            blob = self.bucket.blob(blob_name)
            blob.upload_from_filename(file_path)
            
            # Make the blob publicly accessible
            blob.make_public()
            
            public_url = blob.public_url
            print(f"✅ Image uploaded to Firebase Storage: {public_url}")
            return public_url
        except Exception as e:
            print(f"❌ Failed to upload to Firebase Storage: {e}")
            return None
    
    def get_user_analyses(self, user_id: str) -> list:
        """Get all analyses for a specific user"""
        if not self.db:
            return []
        
        try:
            analyses = self.db.collection('cattle_analyses')\
                .where('user_id', '==', user_id)\
                .order_by('timestamp', direction=firestore.Query.DESCENDING)\
                .stream()
            
            return [doc.to_dict() for doc in analyses]
        except Exception as e:
            print(f"❌ Failed to get user analyses: {e}")
            return []
    
    def delete_analysis(self, analysis_id: str) -> bool:
        """Delete an analysis from Firestore"""
        if not self.db:
            return False
        
        try:
            self.db.collection('cattle_analyses').document(analysis_id).delete()
            print(f"✅ Analysis {analysis_id} deleted from Firebase")
            return True
        except Exception as e:
            print(f"❌ Failed to delete analysis: {e}")
            return False

# Global Firebase service instance
firebase_service = FirebaseService()
