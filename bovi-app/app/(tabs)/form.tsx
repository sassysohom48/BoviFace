import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

export default function FormScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  // get photo URIs from CameraScreen
  const { cattleUri, muzzleUri } = route.params as {
    cattleUri: string;
    muzzleUri: string;
  };

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    // Validate required fields
    if (!name.trim() || !age.trim()) {
      Alert.alert("Required Fields", "Please fill in the cattle name and age.");
      return;
    }

    console.log("Submitting:", { name, age, breed, weight, location, cattleUri, muzzleUri });

    // Mock predictions for frontend demo (replace with actual API call)
    const mockPredictions = [
      { breed: "Holstein Friesian", confidence: 0.85 },
      { breed: "Jersey", confidence: 0.72 },
      { breed: "Angus", confidence: 0.68 },
    ];

    // Navigate to ResultScreen with all data
    router.push({
      pathname: "/(tabs)/result",
      params: {
        cattleUri,
        muzzleUri,
        name,
        age,
        breed,
        weight,
        location,
        predictions: JSON.stringify(mockPredictions),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🐄 Cattle Information</Text>
      
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

      <TextInput
        style={styles.input}
        placeholder="Location (optional)"
        placeholderTextColor="#aaa"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>🔍 Analyze Cattle</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back to Camera</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "black", 
    padding: 20,
  },
  title: { 
    color: "white", 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: "center",
    fontWeight: "bold",
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
});
