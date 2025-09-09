import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createClient } from "@supabase/supabase-js";

// supabase config
const supabaseUrl = "https://lghjqmxssgrzeumechud.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnaGpxbXhzc2dyemV1bWVjaHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTA5ODYsImV4cCI6MjA3Mjk4Njk4Nn0.5KrEkHXM5Z8RnjqEUJZvL6txJ0GardQDxc78YL5v8mk";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");

  // Step state
  const [step, setStep] = useState<1 | 2>(1);
  const [cattleUri, setCattleUri] = useState<string | null>(null);
  const [muzzleUri, setMuzzleUri] = useState<string | null>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Capture photo depending on step
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (step === 1) {
        setCattleUri(photo.uri);
        setStep(2); // move to muzzle step
      } else {
        setMuzzleUri(photo.uri);
      }
    }
  };

  // Pick image from gallery depending on step
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        if (step === 1) {
          setCattleUri(result.assets[0].uri);
          setStep(2);
        } else {
          setMuzzleUri(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const uploadImage = async (uri: string, fileName: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from("cow-images") // bucket name (make sure you create this in Supabase)
        .upload(`photos/${fileName}`, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) {
        console.error("Upload error:", error.message);
        Alert.alert("Upload Error", error.message);
        return null;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("cow-images")
        .getPublicUrl(`photos/${fileName}`);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Upload failed", err);
      return null;
    }
  };

  // Card-style preview when both photos exist
  if (cattleUri && muzzleUri) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.dot} />
            <Text style={styles.brand}>BoviFace</Text>
          </View>

          <View style={styles.thumbRow}>
            <View style={styles.thumbCol}>
              <Image source={{ uri: muzzleUri }} style={styles.thumb} />
              <Text style={styles.thumbLabel}>Muzzle photo</Text>
              <TouchableOpacity
                style={styles.smallDanger}
                onPress={() => {
                  setMuzzleUri(null);
                  setStep(2);
                }}
              >
                <Text style={styles.smallDangerText}>Retake</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.thumbCol}>
              <Image source={{ uri: cattleUri }} style={styles.thumb} />
              <Text style={styles.thumbLabel}>Cow Photo</Text>
              <TouchableOpacity
                style={styles.smallDanger}
                onPress={() => {
                  setCattleUri(null);
                  setStep(1);
                }}
              >
                <Text style={styles.smallDangerText}>Retake</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.primaryCta}
              onPress={async () => {
                const cattleUrl = await uploadImage(cattleUri, `cattle_${Date.now()}.jpg`);
                const muzzleUrl = await uploadImage(muzzleUri, `muzzle_${Date.now()}.jpg`);

                if (cattleUrl && muzzleUrl) {
                  router.push({
                    pathname: "/(tabs)/form",
                    params: { cattleUri, muzzleUri },
                  });
                } else {
                  Alert.alert("Upload Failed!", "Please Try Again.");
                }
              }}
            >
              <Text style={styles.primaryText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={() => router.push("/(tabs)/community")}> 
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressStep, step === 1 && styles.progressStepActive]}>
          <Text style={[styles.progressText, step === 1 && styles.progressTextActive]}>1</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={[styles.progressStep, step === 2 && styles.progressStepActive]}>
          <Text style={[styles.progressText, step === 2 && styles.progressTextActive]}>2</Text>
        </View>
      </View>

      <Text style={styles.instruction}>
        {step === 1 ? "Step 1: Take Cattle Overall Photo" : "Step 2: Take Muzzle Photo"}
      </Text>

      <Text style={styles.subInstruction}>
        {step === 1 ? "Capture the full body of the cattle" : "Focus on the cattle's muzzle/nose area"}
      </Text>

      <TouchableOpacity
        style={styles.flip}
        onPress={() => setFacing((prev) => (prev === "back" ? "front" : "back"))}
      >
        <Text style={styles.text}>Flip Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.capture} onPress={takePicture}>
        <Text style={{ fontSize: 22 }}></Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.gallery} onPress={pickImage}>
        <Text style={styles.text}> From Gallery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B0D" },
  center: { justifyContent: "center", alignItems: "center" },
  camera: { flex: 1 },
  text: { color: "#EAEAEA", fontSize: 16 },

  // Modern card preview
  card: {
    backgroundColor: "#111311",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#252825",
    margin: 0,
    padding: 16,
    position: "relative",
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#4ADE80" },
  brand: { color: "#EAEAEA", fontSize: 18, fontWeight: "700" },

  thumbRow: { flexDirection: "column", justifyContent: "flex-start", marginTop: 8, gap: 16 },
  thumbCol: { width: "100%", alignItems: "center" },
  thumb: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#2A2D2A",
    borderWidth: 1,
    borderColor: "#2F322F",
  },
  thumbLabel: { color: "#69C37E", fontSize: 12, marginTop: 8 },

  smallDanger: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  smallDangerText: { color: "#FFFFFF", fontWeight: "600", fontSize: 12 },

  ctaRow: { marginTop: 20, gap: 12 },
  primaryCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#22C55E",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  primaryText: { color: "#0B0B0D", fontWeight: "800", letterSpacing: 0.5 },


  // Buttons/UI on camera
  button: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    margin: 8,
    borderWidth: 1,
    borderColor: "#2A2A2E",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },

  capture: {
    position: "absolute",
    bottom: 36,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },

  flip: {
    position: "absolute",
    bottom: 36,
    right: 24,
    backgroundColor: "rgba(255,255,255,0.10)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2E",
  },

  gallery: {
    position: "absolute",
    bottom: 36,
    left: 24,
    backgroundColor: "rgba(255,255,255,0.10)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2E",
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0B0D",
  },

  instruction: {
    position: "absolute",
    top: 72,
    alignSelf: "center",
    color: "#EAEAEA",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2E",
  },
  subInstruction: {
    position: "absolute",
    top: 110,
    alignSelf: "center",
    color: "#D1D1D6",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A2A2E",
  },

  progressContainer: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A2A2E",
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressStepActive: { backgroundColor: "#22C55E" },
  progressText: { color: "#EAEAEA", fontSize: 16, fontWeight: "bold" },
  progressTextActive: { color: "#FFFFFF" },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 10,
  },
  close: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2E",
  },
  closeText: { color: "#EAEAEA", fontSize: 16, fontWeight: "700" },
});