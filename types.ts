
export interface VibeMetrics {
  energy: number;
  flow: number;
  impact: number;
}

export interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  bannerUrl?: string;
  email: string;
  credits: number;
  xp: number;
  level: number;
  activeTheme: string;
  isInfinite: boolean;
  isUltimate: boolean;
  isUltimatePlus: boolean;
  hasPremiumPass?: boolean;
  lastBoosts: number[];
  friends: string[];
  savedPosts: string[];
  unlockedThemes: string[];
  claimedLevelRewards: number[];
  rewardedActions: string[];
  boostLimit: number;
  dailyBoostsCount: number;
  lastBoostReset: number;
  completedQuests: string[];
  vibeScore: number;
  vibeRank: string;
  vibeMetrics: VibeMetrics;
  isCertified?: boolean;
  profileComments?: ProfileComment[];
}

export interface ProfileComment {
  id: string;
  userId: string;
  authorId: string;
  content: string;
  createdAt: number;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  createdAt: number;
  likes: string[];
  boosts: string[];
  reposts: string[]; // User IDs who reposted this
  repostOf?: string; // ID of the original post if this is a repost
  comments: Comment[];
  views: number;
  isPremium?: boolean;
  savedBy: string[]; // User IDs who saved this
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  xpReward: number;
  type: 'post' | 'like' | 'boost' | 'chat' | 'daily';
  goal: number;
  ultimate?: boolean;
}

export interface Trend {
  id: string;
  category: string;
  hashtag: string;
  count: string;
  color: string;
}

export enum AIService {
  CHAT = 'chat',
  LIVE = 'live',
  IMAGE_GEN = 'image_gen',
  VIDEO_GEN = 'video_gen',
  MUSIC_GEN = 'music_gen',
  SEARCH = 'search'
}

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: 'arcade' | 'puzzle' | 'action' | 'strategy';
  tier: 'free' | 'ultimate' | 'ultimate_plus';
  url: string;
  plays: number;
  rating: number;
}

export interface LevelPass {
  level: number;
  xpRequired: number;
  rewardType: 'credits' | 'theme' | 'badge' | 'boost_limit';
  rewardValue: string | number;
  isPremium: boolean;
}
