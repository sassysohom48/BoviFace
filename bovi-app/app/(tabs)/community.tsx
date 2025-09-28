import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
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
  const [activeTab, setActiveTab] = useState('Feed');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecommendedExpanded, setIsRecommendedExpanded] = useState(false);

  // Tab data
  const tabs = ['Feed', 'Gov Schemes', 'Breeds', 'Health'];

  // Sample data for different tabs
  const feedData = [
    {
      id: 1,
      title: "My Murrah has low milk yield, what should I feed?",
      image: "https://tse3.mm.bing.net/th/id/OIP.YwPoCVb7SRXvNpyOrGF9vQHaF2?pid=Api&P=0&h=180",
      time: "6h ago",
      category: "Feed"
    },
    {
      id: 2,
      title: "Best feeding schedule for dairy cattle",
      image: "https://tse3.mm.bing.net/th/id/OIP.W9-dqORWYMnQukQGcwKfngHaE7?pid=Api&P=0&h=180",
      time: "2h ago",
      category: "Feed"
    },
    {
      id: 3,
      title: "Organic feed vs commercial feed comparison",
      image: "https://tse2.mm.bing.net/th/id/OIP.e_ReURKuhhWzzC9mM5mqRQHaE8?pid=Api&P=0&h=180",
      time: "1d ago",
      category: "Feed"
    },
    {
      id: 4,
      title: "Winter feeding tips for cattle",
      image: "https://static.toiimg.com/photo/107232722.cms",
      time: "3d ago",
      category: "Feed"
    },
    {
      id: 5,
      title: "Supplement feeding for pregnant cows",
      image: "https://tse3.mm.bing.net/th/id/OIP.YwPoCVb7SRXvNpyOrGF9vQHaF2?pid=Api&P=0&h=180",
      time: "5d ago",
      category: "Feed"
    },
    {
      id: 6,
      title: "Cost-effective feeding strategies",
      image: "https://tse3.mm.bing.net/th/id/OIP.W9-dqORWYMnQukQGcwKfngHaE7?pid=Api&P=0&h=180",
      time: "1w ago",
      category: "Feed"
    }
  ];

  const govSchemesData = [
    {
      id: 1,
      title: "Govt vaccination drive subsidy deadlines",
      image: "https://tse2.mm.bing.net/th/id/OIP.e_ReURKuhhWzzC9mM5mqRQHaE8?pid=Api&P=0&h=180",
      time: "1d ago",
      category: "Government"
    },
    {
      id: 2,
      title: "New livestock insurance scheme launched",
      image: "https://static.toiimg.com/photo/107232722.cms",
      time: "3d ago",
      category: "Government"
    },
    {
      id: 3,
      title: "Subsidy for cattle feed purchase",
      image: "https://tse3.mm.bing.net/th/id/OIP.YwPoCVb7SRXvNpyOrGF9vQHaF2?pid=Api&P=0&h=180",
      time: "5d ago",
      category: "Government"
    },
    {
      id: 4,
      title: "Digital cattle registration benefits",
      image: "https://tse3.mm.bing.net/th/id/OIP.W9-dqORWYMnQukQGcwKfngHaE7?pid=Api&P=0&h=180",
      time: "1w ago",
      category: "Government"
    },
    {
      id: 5,
      title: "Livestock development fund applications",
      image: "https://tse2.mm.bing.net/th/id/OIP.e_ReURKuhhWzzC9mM5mqRQHaE8?pid=Api&P=0&h=180",
      time: "2w ago",
      category: "Government"
    }
  ];

  const breedsData = [
    {
      id: 1,
      title: "Holstein vs Jersey milk production",
      image: "https://tse3.mm.bing.net/th/id/OIP.W9-dqORWYMnQukQGcwKfngHaE7?pid=Api&P=0&h=180",
      time: "4h ago",
      category: "Breeds"
    },
    {
      id: 2,
      title: "Best indigenous cattle breeds for India",
      image: "https://tse2.mm.bing.net/th/id/OIP.e_ReURKuhhWzzC9mM5mqRQHaE8?pid=Api&P=0&h=180",
      time: "8h ago",
      category: "Breeds"
    }
  ];

  const healthData = [
    {
      id: 1,
      title: "Common cattle diseases and prevention",
      image: "https://static.toiimg.com/photo/107232722.cms",
      time: "2h ago",
      category: "Health"
    },
    {
      id: 2,
      title: "Vaccination schedule for dairy cattle",
      image: "https://tse3.mm.bing.net/th/id/OIP.YwPoCVb7SRXvNpyOrGF9vQHaF2?pid=Api&P=0&h=180",
      time: "6h ago",
      category: "Health"
    }
  ];

  // Recommended articles data
  const recommendedArticles = [
    {
      id: 1,
      title: "Weather based advisories",
      subtitle: "Heatwave alert provide shade and water continuously",
      image: "https://tse3.mm.bing.net/th/id/OIP.W9-dqORWYMnQukQGcwKfngHaE7?pid=Api&P=0&h=180",
      category: "Weather"
    },
    {
      id: 2,
      title: "Cattle breeding best practices",
      subtitle: "Optimal breeding seasons and genetic selection tips",
      image: "https://tse2.mm.bing.net/th/id/OIP.e_ReURKuhhWzzC9mM5mqRQHaE8?pid=Api&P=0&h=180",
      category: "Breeding"
    },
    {
      id: 3,
      title: "Dairy farm management",
      subtitle: "Essential tips for efficient dairy farm operations",
      image: "https://static.toiimg.com/photo/107232722.cms",
      category: "Management"
    },
    {
      id: 4,
      title: "Cattle housing design",
      subtitle: "Proper shelter design for different weather conditions",
      image: "https://tse3.mm.bing.net/th/id/OIP.YwPoCVb7SRXvNpyOrGF9vQHaF2?pid=Api&P=0&h=180",
      category: "Housing"
    }
  ];

  // Get current tab data
  const getCurrentTabData = () => {
    switch (activeTab) {
      case 'Feed': return feedData;
      case 'Gov Schemes': return govSchemesData;
      case 'Breeds': return breedsData;
      case 'Health': return healthData;
      default: return feedData;
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Handle See All button
  const handleSeeAll = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle Recommended See All button
  const handleRecommendedSeeAll = () => {
    setIsRecommendedExpanded(!isRecommendedExpanded);
  };

  // Handle card press
  const handleCardPress = (item: any) => {
    Alert.alert(
      item.title,
      `This would open detailed view for: ${item.title}`,
      [{ text: 'OK' }]
    );
  };

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
        <TouchableOpacity 
          style={styles.weeklyTipsCard}
          onPress={() => Alert.alert('Weekly Tips', 'This would open the full article about preventing mastitis in monsoon season.')}
        >
          <Image
            source={{ uri: 'https://tse2.mm.bing.net/th/id/OIP.Bwp8fPcA811J3tR2tmgTdQHaFS?pid=Api&P=0&h=180' }}
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
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[
                styles.categoryButton, 
                activeTab === tab && styles.activeCategory
              ]}
              onPress={() => handleTabChange(tab)}
            >
              <Text style={[
                styles.categoryText, 
                activeTab === tab && styles.activeCategoryText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dynamic Content Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              {activeTab} Content
            </ThemedText>
            <TouchableOpacity onPress={handleSeeAll}>
              <ThemedText style={styles.showAllText}>
                {isExpanded ? 'Show Less' : 'See All'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {isExpanded ? (
            // Expanded view - show all items in a grid
            <View style={styles.expandedGrid}>
              {getCurrentTabData().map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.expandedCard}
                  onPress={() => handleCardPress(item)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.expandedImage}
                  />
                  <ThemedText style={styles.expandedTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.expandedMeta}>⏱️ {item.time}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            // Collapsed view - horizontal scroll
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {getCurrentTabData().slice(0, 3).map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.catchUpCard}
                  onPress={() => handleCardPress(item)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.catchUpImage}
                  />
                  <ThemedText style={styles.catchUpTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.catchUpMeta}>⏱️ {item.time}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Recommended Article Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Recommended Article
            </ThemedText>
            <TouchableOpacity onPress={handleRecommendedSeeAll}>
              <ThemedText style={styles.showAllText}>
                {isRecommendedExpanded ? 'Show Less' : 'See All'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {isRecommendedExpanded ? (
            // Expanded view - show all recommended articles
            <View style={styles.expandedGrid}>
              {recommendedArticles.map((article) => (
                <TouchableOpacity 
                  key={article.id}
                  style={styles.expandedRecommendedCard}
                  onPress={() => Alert.alert(article.title, `This would open: ${article.subtitle}`)}
                >
                  <Image
                    source={{ uri: article.image }}
                    style={styles.expandedRecommendedImage}
                  />
                  <View style={styles.expandedRecommendedContent}>
                    <ThemedText style={styles.expandedRecommendedTitle}>
                      {article.title}
                    </ThemedText>
                    <ThemedText style={styles.expandedRecommendedSubtitle}>
                      {article.subtitle}
                    </ThemedText>
                    <ThemedText style={styles.expandedRecommendedMeta}>READ</ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            // Collapsed view - show only first article
            <TouchableOpacity 
              style={styles.recommendedCard}
              onPress={() => Alert.alert('Weather Advisory', 'This would open the full weather advisory article')}
            >
              <Image
                source={{ uri: recommendedArticles[0].image }}
                style={styles.recommendedImage}
              />
              <View style={styles.recommendedContent}>
                <ThemedText style={styles.recommendedTitle}>
                  {recommendedArticles[0].title}
                </ThemedText>
                <ThemedText style={styles.recommendedSubtitle}>
                  {recommendedArticles[0].subtitle}
                </ThemedText>
                <ThemedText style={styles.recommendedMeta}>READ</ThemedText>
              </View>
            </TouchableOpacity>
          )}
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
  // Expanded view styles
  expandedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  expandedCard: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  expandedImage: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    marginBottom: 8,
  },
  expandedTitle: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  expandedMeta: {
    color: '#888888',
    fontSize: 10,
  },
  // Expanded recommended articles styles
  expandedRecommendedCard: {
    width: '48%',
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  expandedRecommendedImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 8,
  },
  expandedRecommendedContent: {
    flex: 1,
  },
  expandedRecommendedTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  expandedRecommendedSubtitle: {
    color: '#cccccc',
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 4,
  },
  expandedRecommendedMeta: {
    color: '#007AFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});