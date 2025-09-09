import React, { useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { storageService } from '../../utils/storageService';

export default function ResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  // data from FormScreen + backend predictions
  const { 
    cattleUri, 
    muzzleUri, 
    name, 
    age, 
    breed, 
    weight, 
    location, 
    predictions 
  } = route.params as {
    cattleUri: string;
    muzzleUri: string;
    name: string;
    age: string;
    breed: string;
    weight: string;
    location: string;
    predictions: string; // JSON string
  };

  // Parse predictions from JSON string
  const parsedPredictions = JSON.parse(predictions || "[]") as { breed: string; confidence: number }[];

  // Modal state for breed info
  const [selectedBreed, setSelectedBreed] = useState<{ breed: string; confidence: number } | null>(null);

  const handleSaveResult = async () => {
    Alert.alert(
      "Save Result", 
      "Would you like to save this cattle identification result to your journal?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Save", 
          onPress: async () => {
            try {
              await storageService.saveAnalysis({
                cattleInfo: {
                  name,
                  age,
                  breed,
                  weight,
                  location
                },
                images: {
                  cattleUri,
                  muzzleUri
                },
                predictions: parsedPredictions
              });
              
              Alert.alert(
                "Success", 
                "Cattle identification result saved to your journal!",
                [
                  {
                    text: "View Journal",
                    onPress: () => router.push("/(tabs)/journal")
                  },
                  {
                    text: "OK",
                    style: "default"
                  }
                ]
              );
            } catch (error) {
              Alert.alert("Error", "Failed to save analysis. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analysis Complete!</Text>

      {/* Cattle Information */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Cattle Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{age} months</Text>
        </View>
        {breed && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Breed:</Text>
            <Text style={styles.infoValue}>{breed}</Text>
          </View>
        )}
        {weight && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weight:</Text>
            <Text style={styles.infoValue}>{weight} kg</Text>
          </View>
        )}
        {location && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{location}</Text>
          </View>
        )}
      </View>

      {/* Photos */}
      <View style={styles.photoSection}>
        <Text style={styles.sectionTitle}>Captured Photos</Text>
        <View style={styles.images}>
          <View style={styles.photoContainer}>
            <Text style={styles.photoLabel}>Overall</Text>
            <Image source={{ uri: cattleUri }} style={styles.photo} />
          </View>
          <View style={styles.photoContainer}>
            <Text style={styles.photoLabel}>Muzzle</Text>
            <Image source={{ uri: muzzleUri }} style={styles.photo} />
          </View>
        </View>
      </View>

      {/* Predictions */}
      <View style={styles.predictionsSection}>
        <Text style={styles.sectionTitle}>Breed Identification Results</Text>
        <Text style={styles.subtitle}>Top Predictions</Text>

        {parsedPredictions.map((item, index) => (
          <View key={index} style={styles.prediction}>
            <View style={styles.predictionHeader}>
              <Text style={styles.predictionRank}>#{index + 1}</Text>
              <Text style={styles.predictionBreed}>{item.breed}</Text>
            </View>
            <View style={styles.confidenceBar}>
              <View 
                style={[
                  styles.confidenceFill, 
                  { width: `${item.confidence * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.confidenceText}>
              {(item.confidence * 100).toFixed(1)}% confidence
            </Text>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setSelectedBreed(item)}
            >
              <Text style={styles.infoText}>More Info</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveResult}>
          <Text style={styles.saveButtonText}>Save Result</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.newAnalysisButton} 
          onPress={() => router.push("/(tabs)/camera")}
        >
          <Text style={styles.newAnalysisText}>New Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => router.push("/(tabs)")}
        >
          <Text style={styles.homeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
      {/* Breed Info Modal */}
      <Modal
        visible={!!selectedBreed}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBreed(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedBreed?.breed}</Text>
              <TouchableOpacity onPress={() => setSelectedBreed(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Confidence: {(selectedBreed?.confidence ? selectedBreed.confidence * 100 : 0).toFixed(1)}%
            </Text>
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                • Origin: Details about typical origin and distribution.
              </Text>
              <Text style={styles.modalText}>
                • Traits: Coat, horns, temperament, and productivity.
              </Text>
              <Text style={styles.modalText}>
                • Care: Feeding, housing, and common health considerations.
              </Text>
            </View>
            <TouchableOpacity style={styles.modalPrimary} onPress={() => setSelectedBreed(null)}>
              <Text style={styles.modalPrimaryText}>Close</Text>
            </TouchableOpacity>
          </View>
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
  title: { 
    color: "white", 
    fontSize: 24, 
    textAlign: "center", 
    marginBottom: 20,
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardTitle: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLabel: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "600",
  },
  infoValue: {
    color: "white",
    fontSize: 16,
  },
  photoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  images: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginBottom: 15,
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
    width: 120, 
    height: 120, 
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  predictionsSection: {
    marginBottom: 20,
  },
  subtitle: { 
    color: "#ccc", 
    fontSize: 16, 
    marginBottom: 15,
    textAlign: "center",
  },
  prediction: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  predictionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  predictionRank: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  predictionBreed: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    marginBottom: 8,
  },
  confidenceFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  confidenceText: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 10,
  },
  infoButton: { 
    backgroundColor: "#4CAF50", 
    padding: 10, 
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  infoText: { 
    color: "white", 
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  newAnalysisButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  newAnalysisText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  homeButton: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#666",
  },
  homeText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: {
    color: "#4CAF50",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  modalSubtitle: {
    color: "#ccc",
    marginBottom: 12,
  },
  modalBody: {
    gap: 6,
    marginBottom: 16,
  },
  modalText: {
    color: "#eee",
    fontSize: 14,
  },
  modalPrimary: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalPrimaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
