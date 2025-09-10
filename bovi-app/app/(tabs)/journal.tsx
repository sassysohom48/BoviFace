import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { storageService, SavedAnalysis } from '../../utils/storageService';
import { router, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import HomeIcon from '@/assets/images/home.svg';
import HomeGreyIcon from '@/assets/images/home grey.svg';
import JournalIcon from '@/assets/images/journal.svg';
import JournalGreyIcon from '@/assets/images/journal-grey.svg';
import CommunityIcon from '@/assets/images/comunity.svg';
import CommunityGreyIcon from '@/assets/images/comunity-grey.svg';
import ProfileIcon from '@/assets/images/Profile.svg';
import ProfileGreyIcon from '@/assets/images/Profile-grey.svg';

export default function JournalScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);

  useEffect(() => {
    loadAnalyses();
  }, []);

  // Add focus listener to refresh when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Journal screen focused, refreshing data...');
      loadAnalyses();
    });

    return unsubscribe;
  }, [navigation]);

  const loadAnalyses = async () => {
    try {
      console.log('Loading analyses from storage...');
      const savedAnalyses = await storageService.getAllAnalyses();
      console.log('Loaded analyses:', savedAnalyses);
      console.log('Analyses count:', savedAnalyses.length);
      setAnalyses(savedAnalyses);
    } catch (error) {
      console.error('Error loading analyses:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalyses();
    setRefreshing(false);
  };

  const deleteAnalysis = async (analysisId: string) => {
    Alert.alert(
      'Delete Analysis',
      'Are you sure you want to delete this analysis?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await storageService.deleteAnalysis(analysisId);
              if (success) {
                await loadAnalyses(); // Reload the list
                Alert.alert('Success', 'Analysis deleted successfully');
              } else {
                Alert.alert('Error', 'Failed to delete analysis');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete analysis');
            }
          }
        }
      ]
    );
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAnalysisItem = ({ item }: { item: SavedAnalysis }) => {
    const topPrediction = item.predictions[0];
    
    return (
      <TouchableOpacity
        style={styles.analysisCard}
        onPress={() => setSelectedAnalysis(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cattleInfo}>
            <Text style={styles.cattleName}>{item.cattleInfo.name}</Text>
            <Text style={styles.cattleDetails}>
              {item.cattleInfo.age} months • {item.cattleInfo.location || 'Unknown location'}
            </Text>
          </View>
          <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.images.cattleUri }} style={styles.thumbnail} />
            <Text style={styles.imageLabel}>Overall</Text>
          </View>
          
          <View style={styles.predictionInfo}>
            <Text style={styles.predictionLabel}>Top Prediction</Text>
            <Text style={styles.predictionBreed}>{topPrediction.breed}</Text>
            <View style={styles.confidenceBar}>
              <View 
                style={[
                  styles.confidenceFill, 
                  { width: `${topPrediction.confidence * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.confidenceText}>
              {(topPrediction.confidence * 100).toFixed(1)}% confidence
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation(); // Prevent card tap when delete is pressed
            deleteAnalysis(item.id);
          }}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderDetailModal = () => {
    if (!selectedAnalysis) return null;

    return (
      <Modal
        visible={!!selectedAnalysis}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title" style={styles.modalTitle}>
              Analysis Details
            </ThemedText>
            <TouchableOpacity
              onPress={() => setSelectedAnalysis(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Cattle Information */}
            <View style={styles.detailSection}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Cattle Information
              </ThemedText>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{selectedAnalysis.cattleInfo.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Age:</Text>
                <Text style={styles.detailValue}>{selectedAnalysis.cattleInfo.age} months</Text>
              </View>
              {selectedAnalysis.cattleInfo.breed && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Breed:</Text>
                  <Text style={styles.detailValue}>{selectedAnalysis.cattleInfo.breed}</Text>
                </View>
              )}
              {selectedAnalysis.cattleInfo.weight && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Weight:</Text>
                  <Text style={styles.detailValue}>{selectedAnalysis.cattleInfo.weight} kg</Text>
                </View>
              )}
              {selectedAnalysis.cattleInfo.location && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{selectedAnalysis.cattleInfo.location}</Text>
                </View>
              )}
            </View>

            {/* Images */}
            <View style={styles.detailSection}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Captured Images
              </ThemedText>
              <View style={styles.imageRow}>
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: selectedAnalysis.images.cattleUri }} 
                    style={styles.detailImage} 
                  />
                  <Text style={styles.imageLabel}>Overall View</Text>
                </View>
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: selectedAnalysis.images.muzzleUri }} 
                    style={styles.detailImage} 
                  />
                  <Text style={styles.imageLabel}>Muzzle View</Text>
                </View>
              </View>
            </View>

            {/* Predictions */}
            <View style={styles.detailSection}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Breed Predictions
              </ThemedText>
              {selectedAnalysis.predictions.map((prediction, index) => (
                <View key={index} style={styles.predictionItem}>
                  <View style={styles.predictionHeader}>
                    <Text style={styles.predictionRank}>#{index + 1}</Text>
                    <Text style={styles.predictionBreed}>{prediction.breed}</Text>
                  </View>
                  <View style={styles.confidenceBar}>
                    <View 
                      style={[
                        styles.confidenceFill, 
                        { width: `${prediction.confidence * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.confidenceText}>
                    {(prediction.confidence * 100).toFixed(1)}% confidence
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </ThemedView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Analysis Journal</ThemedText>
        <ThemedText style={styles.subtitle}>
          {analyses.length} saved analyses
        </ThemedText>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadAnalyses}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {analyses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No Saved Analyses
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Your saved cattle analyses will appear here
          </ThemedText>
          <TouchableOpacity
            style={styles.startAnalysisButton}
            onPress={() => router.push('/(tabs)/camera')}
          >
            <Text style={styles.startAnalysisText}>Start New Analysis</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={analyses}
          renderItem={renderAnalysisItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/community')}
        >
          <HomeGreyIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, styles.activeTab]}
          onPress={() => router.push('/(tabs)/journal')}
        >
          <JournalIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/camera')}
        >
          <Image source={require('@/assets/images/cam.png')} style={styles.pngIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/community')}
        >
          <CommunityGreyIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <ProfileGreyIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      {renderDetailModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  header: {
    backgroundColor: '#1a1a1a',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  refreshButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  refreshButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  listContainer: { padding: 20 },
  analysisCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    borderWidth: 1,
    borderColor: '#333333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  cattleInfo: { flex: 1 },
  cattleName: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  cattleDetails: { fontSize: 14, color: '#cccccc' },
  timestamp: { fontSize: 12, color: '#888888', textAlign: 'right' },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  imageContainer: { alignItems: 'center', marginRight: 15 },
  thumbnail: {
    width: 60, height: 60, borderRadius: 8, borderWidth: 2, borderColor: '#4CAF50',
  },
  imageLabel: { fontSize: 10, color: '#666', marginTop: 4 },
  predictionInfo: { flex: 1 },
  predictionLabel: { fontSize: 12, color: '#888888', marginBottom: 4 },
  predictionBreed: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
  confidenceBar: {
    height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, marginBottom: 4,
  },
  confidenceFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 3 },
  confidenceText: { fontSize: 12, color: '#cccccc' },
  deleteButton: { 
    position: 'absolute', 
    top: 15, 
    right: 15, 
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButtonText: { 
    fontSize: 16,
    color: 'white',
  },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30,
  },
  startAnalysisButton: {
    backgroundColor: '#4CAF50', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12,
  },
  startAnalysisText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalContainer: { 
    flex: 1, 
    paddingTop: 60,
    backgroundColor: '#000000',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: "#ffffff" },
  closeButton: { 
    padding: 8, 
    backgroundColor: '#ffffff', 
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: { fontSize: 16, color: '#000000' },
  modalContent: { flex: 1, padding: 20 },
  detailSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 15 },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  detailLabel: { fontSize: 14, color: '#cccccc', fontWeight: '500' },
  detailValue: { fontSize: 14, color: '#ffffff', fontWeight: '600' },
  imageRow: { flexDirection: 'row', justifyContent: 'space-around' },
  detailImage: {
    width: 120, height: 120, borderRadius: 10, borderWidth: 2, borderColor: '#4CAF50',
  },
  predictionItem: {
    backgroundColor: '#1a1a1a', 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  predictionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  predictionRank: { fontSize: 14, fontWeight: 'bold', color: '#4CAF50', marginRight: 10 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  pngIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
