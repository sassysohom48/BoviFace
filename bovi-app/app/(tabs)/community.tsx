import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import HomeIcon from '@/assets/images/home.svg';
import HomeGreyIcon from '@/assets/images/home grey.svg';
import JournalIcon from '@/assets/images/journal.svg';
import JournalGreyIcon from '@/assets/images/journal-grey.svg';
import CommunityIcon from '@/assets/images/comunity.svg';
import CommunityGreyIcon from '@/assets/images/comunity-grey.svg';
import ProfileIcon from '@/assets/images/Profile.svg';
import ProfileGreyIcon from '@/assets/images/Profile-grey.svg';

export default function CommunityScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Welcome To Community
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Have a nice day
          </ThemedText>
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={{ uri: 'https://via.placeholder.com/40x40/8B4513/FFFFFF?text=👤' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Weekly Tips Card */}
        <TouchableOpacity style={styles.weeklyTipsCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/300x150/8B4513/FFFFFF?text=Vet+Examining+Animal' }}
            style={styles.weeklyTipsImage}
          />
          <View style={styles.weeklyTipsOverlay}>
            <ThemedText style={styles.weeklyTipsTitle}>Weekly Tips</ThemedText>
            <ThemedText style={styles.weeklyTipsSubtitle}>
              How to prevent mastitis in monsoon.
            </ThemedText>
          </View>
        </TouchableOpacity>

        {/* Category Buttons */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity style={[styles.categoryButton, styles.activeCategory]}>
            <Text style={[styles.categoryText, styles.activeCategoryText]}>Feeding</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Gov Schemes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Breeds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Health</Text>
          </TouchableOpacity>
        </View>

        {/* Catch Up With Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Catch Up With
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.showAllText}>Show All</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <TouchableOpacity style={styles.catchUpCard}>
              <Image
                source={{ uri: 'https://via.placeholder.com/120x80/8B4513/FFFFFF?text=Buffalo+Milk' }}
                style={styles.catchUpImage}
              />
              <ThemedText style={styles.catchUpTitle}>
                My Murrah has low milk yield, what should I feed?
              </ThemedText>
              <ThemedText style={styles.catchUpMeta}>⏱️ 6h ago</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.catchUpCard}>
              <Image
                source={{ uri: 'https://via.placeholder.com/120x80/228B22/FFFFFF?text=Vaccination' }}
                style={styles.catchUpImage}
              />
              <ThemedText style={styles.catchUpTitle}>
                Govt vaccination drive subsidy deadlines.
              </ThemedText>
              <ThemedText style={styles.catchUpMeta}>⏱️ 1d ago</ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Recommended Article Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Recommended Article
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.showAllText}>Show All</ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.recommendedCard}>
            <Image
              source={{ uri: 'https://via.placeholder.com/80x60/FF8C00/FFFFFF?text=Weather' }}
              style={styles.recommendedImage}
            />
            <View style={styles.recommendedContent}>
              <ThemedText style={styles.recommendedTitle}>
                Weather based advisories
              </ThemedText>
              <ThemedText style={styles.recommendedSubtitle}>
                "Heatwave alert provide shade and water continuously"
              </ThemedText>
              <ThemedText style={styles.recommendedMeta}>📖 READ</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/community')}
        >
          <HomeGreyIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/journal')}
        >
          <JournalGreyIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/camera')}
        >
          <Image source={require('@/assets/images/cam.png')} style={styles.pngIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, styles.activeTab]}
          onPress={() => router.push('/(tabs)/community')}
        >
          <CommunityIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <ProfileGreyIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#888888',
    fontSize: 14,
    marginTop: 4,
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    right: 0,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  apiTestButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  apiTestButtonDisabled: {
    opacity: 0.6,
  },
  apiTestButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  weeklyTipsCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  weeklyTipsImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  weeklyTipsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  weeklyTipsTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weeklyTipsSubtitle: {
    color: '#cccccc',
    fontSize: 14,
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  activeCategory: {
    backgroundColor: '#4a4a4a',
  },
  categoryText: {
    color: '#888888',
    fontSize: 14,
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
  },
  showAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  catchUpCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
  },
  catchUpImage: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    marginBottom: 8,
  },
  catchUpTitle: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  catchUpMeta: {
    color: '#888888',
    fontSize: 10,
  },
  recommendedCard: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
  },
  recommendedImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  recommendedContent: {
    flex: 1,
  },
  recommendedTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendedSubtitle: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  recommendedMeta: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 80,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
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
  activeTabIcon: {
    color: '#ffffff',
  },
});