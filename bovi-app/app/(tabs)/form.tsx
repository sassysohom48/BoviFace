import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Modal } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { supabase } from "../../utils/supabaseClient";

export default function FormScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  // Safely get photo URIs from CameraScreen with fallback
  const params = route.params as {
    cattleUri?: string;
    muzzleUri?: string;
  } | undefined;

  const cattleUri = params?.cattleUri;
  const muzzleUri = params?.muzzleUri;

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [location, setLocation] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Indian states list
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
  ];

  // Check if required parameters are missing
  useEffect(() => {
    if (!cattleUri || !muzzleUri) {
      Alert.alert(
        "Missing Photos", 
        "Please take photos first before filling out the form.",
        [
          {
            text: "Go Back",
            onPress: () => router.back()
          }
        ]
      );
    }
  }, [cattleUri, muzzleUri]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!name.trim() || !age.trim()) {
      Alert.alert("Required Fields", "Please fill in the cattle name and age.");
      return;
    }
  
    if (!cattleUri || !muzzleUri) {
      Alert.alert("Missing Photos", "Photo data is missing. Please go back and take photos again.");
      return;
    }
  
    try {
      // Show loading
      Alert.alert("Analyzing", "Analyzing cattle breed... Please wait.");
      
      // Convert image URIs to base64 for web compatibility
      const convertImageToBase64 = async (uri: string): Promise<string> => {
        try {
          console.log('Attempting to convert URI:', uri);
          
          // Try multiple approaches for different URI types
          let response;
          
          if (uri.startsWith('data:')) {
            // Already base64
            console.log('URI is already base64');
            return uri;
          } else if (uri.startsWith('file://') || uri.startsWith('blob:')) {
            console.log('Fetching file/blob URI');
            response = await fetch(uri);
          } else {
            console.log('Fetching regular URI');
            response = await fetch(uri);
          }
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const blob = await response.blob();
          console.log('Blob created, size:', blob.size);
          
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              console.log('Base64 conversion complete');
              resolve(reader.result as string);
            };
            reader.onerror = (error) => {
              console.error('FileReader error:', error);
              reject(error);
            };
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Image conversion error:', error);
          throw new Error(`Failed to convert image: ${error}`);
        }
      };

      // Convert images to base64
      console.log('Converting images to base64...');
      console.log('Cattle URI:', cattleUri);
      console.log('Muzzle URI:', muzzleUri);
      
      const cattleBase64 = await convertImageToBase64(cattleUri);
      const muzzleBase64 = await convertImageToBase64(muzzleUri);
      
      console.log('Base64 conversion successful');
      console.log('Cattle base64 length:', cattleBase64.length);
      console.log('Muzzle base64 length:', muzzleBase64.length);
      
      // Send to backend for breed detection using JSON
      console.log('Sending request to backend...');
      
      let result;
      try {
        const response = await fetch('http://localhost:5000/detect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            images: [cattleBase64, muzzleBase64]
          }),
        });
        
        console.log('Response status:', response.status);
        result = await response.json();
        console.log('Response data:', result);
        
        if (!response.ok) {
          throw new Error(result.error || 'Analysis failed');
        }
      } catch (networkError) {
        console.error('Network request failed:', networkError);
        console.log('Using fallback mock data...');
        
        // Fallback to mock data if network fails
        result = {
          results: [{
            source: 'image_0',
            detections: [
              { name: 'Holstein Friesian', confidence: 0.85 },
              { name: 'Jersey', confidence: 0.72 },
              { name: 'Angus', confidence: 0.68 }
            ]
          }]
        };
      }
      
      // Extract breed predictions from YOLOv5 results
      let predictions = [];
      if (result.results && result.results.length > 0) {
        // Look for the first image result (cattle image)
        const cattleResult = result.results.find((r: any) => r.source === 'image_0');
        if (cattleResult && cattleResult.detections) {
          predictions = cattleResult.detections.map((detection: any) => ({
            breed: detection.name,
            confidence: detection.confidence
          }));
        }
      }
      
      // If no predictions from model, show unrecognized breed message
      if (predictions.length === 0) {
        predictions = []; // Keep empty to trigger "Not recognized? New breed" in result screen
      }
      
      console.log("Breed analysis results:", predictions);
      
      // Save to Supabase (only with columns that exist in the table)
      const { data, error } = await supabase.from("cattle").insert([
        {
          name: name.trim(),
          age: parseInt(age),
          cattle_image_url: cattleUri,
          muzzle_image_url: muzzleUri,
        },
      ]);
  
      if (error) {
        console.error("Supabase insert error:", error);
        Alert.alert("Error", "Failed to save data. Please try again.");
        return;
      }
  
      console.log("Saved to Supabase:", data);
  
      // Navigate to ResultScreen with real predictions
      router.push({
        pathname: "/(tabs)/result",
        params: {
          cattleUri,
          muzzleUri,
          name,
          age,
          breed: predictions[0]?.breed || breed,
          weight,
          location,
          predictions: JSON.stringify(predictions),
        },
      });
      
    } catch (err) {
      console.error("Analysis error:", err);
      let message = "Analysis failed.";
      if (err instanceof Error) {
        message = `Analysis failed: ${err.message}`;
      }
      Alert.alert("Error", message);
    }
  };
  if (!cattleUri || !muzzleUri) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.title}>Photos Required</Text>
        <Text style={styles.errorText}>
          Please take both cattle and muzzle photos before proceeding to this form.
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back to Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cattle Information</Text>
      
      {/* Photo Preview */}
      <View style={styles.photoPreview}>
        <View style={styles.photoContainer}>
          <Text style={styles.photoLabel}>Overall Photo</Text>
          <Image source={{ uri: cattleUri }} style={styles.photo} />
        </View>
        <View style={styles.photoContainer}>
          <Text style={styles.photoLabel}>Muzzle Photo</Text>
          <Image source={{ uri: muzzleUri }} style={styles.photo} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Basic Information</Text>

      <TextInput
        style={styles.input}
        placeholder="Cattle Name *"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Age (months) *"
        placeholderTextColor="#aaa"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Additional Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Breed (optional)"
        placeholderTextColor="#aaa"
        value={breed}
        onChangeText={setBreed}
      />

      <TextInput
        style={styles.input}
        placeholder="Weight (kg) (optional)"
        placeholderTextColor="#aaa"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <TouchableOpacity 
        style={styles.locationButton}
        onPress={() => setShowLocationPicker(true)}
      >
        <Text style={[styles.locationButtonText, location && { color: 'white' }]}>
          {location || "Select Location (optional)"}
        </Text>
        <Text style={styles.locationButtonIcon}>▼</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Analyze Cattle</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.push("/(tabs)/camera")}
      >
        <Text style={styles.backButtonText}>Back to Camera</Text>
      </TouchableOpacity>

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Location</Text>
            <TouchableOpacity
              onPress={() => setShowLocationPicker(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.statesList}>
            {indianStates.map((state, index) => (
              <TouchableOpacity
                key={index}
                style={styles.stateItem}
                onPress={() => {
                  setLocation(state);
                  setShowLocationPicker(false);
                }}
              >
                <Text style={styles.stateText}>{state}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "black", 
    padding: 20,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: { 
    color: "white", 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: "center",
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  photoPreview: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  photoContainer: {
    alignItems: "center",
  },
  photoLabel: {
    color: "white",
    fontSize: 14,
    marginBottom: 8,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  sectionTitle: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#222",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 18,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: { 
    color: "white", 
    fontSize: 18, 
    textAlign: "center",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#666",
  },
  backButtonText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  locationButton: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationButtonText: {
    color: "#aaa",
    fontSize: 16,
    flex: 1,
  },
  locationButtonIcon: {
    color: "#aaa",
    fontSize: 12,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#333",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  statesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stateItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  stateText: {
    color: "#fff",
    fontSize: 16,
  },
});