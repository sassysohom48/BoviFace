import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedAnalysis {
  id: string;
  timestamp: string;
  cattleInfo: {
    name: string;
    age: string;
    breed?: string;
    weight?: string;
    location?: string;
  };
  images: {
    cattleUri: string;
    muzzleUri: string;
  };
  predictions: Array<{
    breed: string;
    confidence: number;
  }>;
}

class StorageService {
  private readonly STORAGE_KEY = 'saved_analyses';

  async saveAnalysis(analysis: Omit<SavedAnalysis, 'id' | 'timestamp'>): Promise<string> {
    try {
      const id = this.generateId();
      const timestamp = new Date().toISOString();
      
      const savedAnalysis: SavedAnalysis = {
        id,
        timestamp,
        ...analysis
      };

      const existingAnalyses = await this.getAllAnalyses();
      const updatedAnalyses = [savedAnalysis, ...existingAnalyses];

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedAnalyses));
      
      console.log('Analysis saved successfully:', id);
      return id;
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw new Error('Failed to save analysis');
    }
  }

  async getAllAnalyses(): Promise<SavedAnalysis[]> {
    try {
      const savedAnalyses = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (savedAnalyses) {
        return JSON.parse(savedAnalyses);
      }
      return [];
    } catch (error) {
      console.error('Error loading analyses:', error);
      return [];
    }
  }

  async getAnalysisById(id: string): Promise<SavedAnalysis | null> {
    try {
      const analyses = await this.getAllAnalyses();
      return analyses.find(analysis => analysis.id === id) || null;
    } catch (error) {
      console.error('Error getting analysis by ID:', error);
      return null;
    }
  }

  async deleteAnalysis(id: string): Promise<boolean> {
    try {
      const analyses = await this.getAllAnalyses();
      const updatedAnalyses = analyses.filter(analysis => analysis.id !== id);
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedAnalyses));
      
      console.log('Analysis deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting analysis:', error);
      return false;
    }
  }

  async clearAllAnalyses(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      console.log('All analyses cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing analyses:', error);
      return false;
    }
  }

  async getAnalysesCount(): Promise<number> {
    try {
      const analyses = await this.getAllAnalyses();
      return analyses.length;
    } catch (error) {
      console.error('Error getting analyses count:', error);
      return 0;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const storageService = new StorageService();
