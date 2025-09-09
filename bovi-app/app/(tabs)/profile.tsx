import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  TextInput,
  Modal
} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../utils/supabaseClient';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic: string;
  farmName: string;
  location: string;
  joinDate: string;
  cattleCount: number;
  totalAnalyses: number;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile>({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    profilePic: "https://i.pravatar.cc/150",
    farmName: "Green Valley Farm",
    location: "California, USA",
    joinDate: "2024-01-15",
    cattleCount: 12,
    totalAnalyses: 45
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    farmName: user.farmName,
    location: user.location,
    phone: user.phone
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // In real app, fetch from Supabase/backend
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select('*')
      //   .eq('user_id', currentUser.id)
      //   .single();
      
      // For now, using mock data
      console.log("Loading user profile...");
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImageUri = result.assets[0].uri;
        setUser(prev => ({ ...prev, profilePic: newImageUri }));
        
        // Upload to Supabase Storage
        await uploadProfilePicture(newImageUri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadProfilePicture = async (imageUri: string) => {
    try {
      // Convert image to blob and upload to Supabase
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const fileName = `profile_${user.id}_${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, blob);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      setUser(prev => ({ ...prev, profilePic: publicUrl }));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setUser(prev => ({
        ...prev,
        name: editData.name,
        farmName: editData.farmName,
        location: editData.location,
        phone: editData.phone
      }));

      // Update in Supabase
      // await supabase
      //   .from('profiles')
      //   .update(editData)
      //   .eq('user_id', user.id);

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => {
          // Handle logout logic
          console.log("User logged out");
        }}
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        {/* Profile Image */}
        <TouchableOpacity onPress={handleImagePicker}>
          <Image source={{ uri: user.profilePic }} style={styles.avatar} />
          <View style={styles.editIcon}>
            <Text style={styles.editIconText}>📷</Text>
          </View>
        </TouchableOpacity>

        {/* User Info */}
        <ThemedText type="title" style={styles.name}>{user.name}</ThemedText>
        <ThemedText style={styles.farmName}>{user.farmName}</ThemedText>
        <ThemedText style={styles.location}>📍 {user.location}</ThemedText>
      </ThemedView>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText type="title" style={styles.statNumber}>{user.cattleCount}</ThemedText>
          <ThemedText style={styles.statLabel}>Cattle Registered</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText type="title" style={styles.statNumber}>{user.totalAnalyses}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Analyses</ThemedText>
        </View>
      </View>

      {/* Profile Details */}
      <ThemedView style={styles.detailsCard}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Profile Details</ThemedText>
        
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Name:</ThemedText>
          <ThemedText style={styles.detailValue}>{user.name}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Phone:</ThemedText>
          <ThemedText style={styles.detailValue}>{user.phone}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Farm:</ThemedText>
          <ThemedText style={styles.detailValue}>{user.farmName}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Location:</ThemedText>
          <ThemedText style={styles.detailValue}>{user.location}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Member Since:</ThemedText>
          <ThemedText style={styles.detailValue}>{new Date(user.joinDate).toLocaleDateString()}</ThemedText>
        </View>
      </ThemedView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setIsEditing(true)}
        >
          <ThemedText style={styles.buttonText}>✏️ Edit Profile</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.logout]} 
          onPress={handleLogout}
        >
          <ThemedText style={styles.buttonText}>🚪 Logout</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} animationType="slide" presentationStyle="pageSheet">
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title" style={styles.modalTitle}>Edit Profile</ThemedText>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={editData.name}
            onChangeText={(text) => setEditData(prev => ({ ...prev, name: text }))}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Farm Name"
            value={editData.farmName}
            onChangeText={(text) => setEditData(prev => ({ ...prev, farmName: text }))}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={editData.location}
            onChangeText={(text) => setEditData(prev => ({ ...prev, location: text }))}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={editData.phone}
            onChangeText={(text) => setEditData(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setIsEditing(false)}
            >
              <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={handleSaveProfile}
            >
              <ThemedText style={styles.modalButtonText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4CAF50",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
    marginBottom: 15,
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  editIconText: {
    fontSize: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  farmName: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
    opacity: 0.9,
  },
  location: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  detailsCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 15,
  },
  button: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  logout: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 30,
    gap: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
