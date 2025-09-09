import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");

  // 🔹 Step state
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

  // 🔹 Capture photo depending on step
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

  // 🔹 Pick image from gallery depending on step
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

  // 🔹 When both photos are done → show preview
  if (cattleUri && muzzleUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.previewTitle}>Both Photos Captured!</Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 }}>
          <View style={{ alignItems: 'center', flex: 1, marginHorizontal: 8 }}>
            <Text style={styles.previewTitle}>Cattle Overall Photo</Text>
            <Image source={{ uri: cattleUri }} style={{ width: 140, height: 105, borderRadius: 8, marginVertical: 8 }} />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#f44336', marginTop: 8 }]}
              onPress={() => {
                setCattleUri(null);
                setStep(1);
              }}
            >
              <Text style={styles.retakeText}>Retake Cattle Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewItem}>
            <Text style={styles.previewSubtitle}>Muzzle Photo</Text>
            <Image source={{ uri: muzzleUri }} style={styles.preview} />
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => {
                setMuzzleUri(null);
                setStep(2);
              }}
            >
              <Text style={styles.retakeText}>Retake Muzzle Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.previewButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setCattleUri(null);
              setMuzzleUri(null);
              setStep(1);
            }}
          >
            <Text style={styles.text}>↩ Start Over</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.useButton}
            onPress={() => {
              // Navigate to form screen with photo data
              router.push({
                pathname: "/(tabs)/form",
                params: {
                  cattleUri,
                  muzzleUri,
                },
              });
            }}
          >
            <Text style={styles.useText}>📝 Continue to Form</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        {step === 1 ? "📸 Step 1: Take Cattle Overall Photo" : "📸 Step 2: Take Muzzle Photo"}
      </Text>
      
      <Text style={styles.subInstruction}>
        {step === 1 
          ? "Capture the full body of the cattle" 
          : "Focus on the cattle's muzzle/nose area"
        }
      </Text>

      <TouchableOpacity
        style={styles.flip}
        onPress={() => setFacing((prev) => (prev === "back" ? "front" : "back"))}
      >
        <Text style={styles.text}>🔄 Flip Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.capture} onPress={takePicture}>
        <Text style={{ fontSize: 22 }}>📸</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.gallery} onPress={pickImage}>
        <Text style={styles.text}>🖼️ From Gallery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },
  text: { color: "white", fontSize: 16 },
  button: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 8,
    margin: 8,
  },
  capture: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 50,
  },
  flip: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 25,
  },
  gallery: {
    position: "absolute",
    bottom: 40,
    left: 30,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 25,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  preview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  previewTitle: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
  },
  previewSubtitle: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  previewContainer: {
    flex: 1,
    padding: 20,
  },
  previewItem: {
    marginBottom: 20,
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  retakeButton: {
    backgroundColor: "rgba(255,0,0,0.7)",
    padding: 8,
    borderRadius: 15,
    marginTop: 8,
  },
  retakeText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
  },
  useButton: {
    backgroundColor: "rgba(0,255,0,0.7)",
    padding: 12,
    borderRadius: 8,
    margin: 8,
  },
  useText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  instruction: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  subInstruction: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    color: "white",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  progressContainer: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressStepActive: {
    backgroundColor: "#4CAF50",
  },
  progressText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  progressTextActive: {
    color: "white",
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 10,
  },
});
