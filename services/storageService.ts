
import { User, Post, Comment, Message, Quest, Trend } from '../types.ts';

const USERS_KEY = 'vibe_users_v11';
const POSTS_KEY = 'vibe_posts_v11';
const MESSAGES_KEY = 'vibe_messages_v11';
const AUTH_KEY = 'vibe_auth_v11';

export const storage = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
  
  getPosts: (): Post[] => {
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    return posts.sort((a: Post, b: Post) => b.createdAt - a.createdAt);
  },
  savePosts: (posts: Post[]) => localStorage.setItem(POSTS_KEY, JSON.stringify(posts)),
  
  searchUsers: (query: string): User[] => {
    const users = storage.getUsers();
    const q = query.toLowerCase().replace('@', '');
    return users.filter(u => u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q));
  },

  searchPosts: (query: string): Post[] => {
    const posts = storage.getPosts();
    return posts.filter(p => p.content.toLowerCase().includes(query.toLowerCase()));
  },

  incrementView: (postId: string) => {
    const posts = storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.views = (post.views || 0) + 1;
      storage.savePosts(posts);
    }
  },

  addReward: (userId: string, credits: number, xp: number) => {
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const user = users[userIndex];
      user.credits += credits;
      user.xp += xp;
      
      const nextLevelXp = user.level * 1000;
      if (user.xp >= nextLevelXp) {
        user.level += 1;
        user.xp -= nextLevelXp;
      }
      
      users[userIndex] = { ...user };
      storage.saveUsers(users);
      
      const current = storage.getCurrentUser();
      if (current?.id === userId) {
        storage.setCurrentUser(user);
        window.dispatchEvent(new CustomEvent('vibeUserUpdated', { detail: { ...user } }));
        window.dispatchEvent(new CustomEvent('vibeRewardToast', { detail: { credits, xp } }));
      }
      return user;
    }
    return null;
  },

  toggleRepost: (postId: string, userId: string) => {
    const posts = storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.reposts) post.reposts = [];
    const index = post.reposts.indexOf(userId);

    if (index === -1) {
      // Create a repost entry
      post.reposts.push(userId);
      const repost: Post = {
        id: `repost-${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        repostOf: post.id,
        content: post.content,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        createdAt: Date.now(),
        likes: [],
        boosts: [],
        reposts: [],
        comments: [],
        views: 0,
        savedBy: []
      };
      posts.unshift(repost);
      storage.addReward(userId, 50, 100);
    } else {
      // Remove repost
      post.reposts.splice(index, 1);
      const repostIdx = posts.findIndex(p => p.repostOf === postId && p.userId === userId);
      if (repostIdx !== -1) posts.splice(repostIdx, 1);
    }
    storage.savePosts(posts);
  },

  addFriend: (userId: string, friendId: string) => {
    const users = storage.getUsers();
    const user = users.find(u => u.id === userId);
    const friend = users.find(u => u.id === friendId);
    if (user && friend) {
      if (!user.friends) user.friends = [];
      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter(id => id !== friendId);
      } else {
        user.friends.push(friendId);
        // Quest check: Socialiseur
        storage.completeQuest(userId, 'q2');
      }
      storage.saveUsers(users);
      const current = storage.getCurrentUser();
      if (current?.id === userId) storage.setCurrentUser(user);
    }
  },

  getFollowers: (userId: string): User[] => {
    const users = storage.getUsers();
    return users.filter(u => u.friends?.includes(userId));
  },

  getTopLikedPosts: (): Post[] => {
    const posts = storage.getPosts();
    return [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  },

  getWeeklyBoostedPosts: (): Post[] => {
    const posts = storage.getPosts();
    return posts
      .filter(p => p.boosts && p.boosts.length > 0)
      .sort((a, b) => (b.boosts?.length || 0) - (a.boosts?.length || 0));
  },

  getMessages: (u1: string, u2: string): Message[] => {
    const msgs = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    return msgs.filter((m: Message) => 
      (m.senderId === u1 && m.receiverId === u2) || (m.senderId === u2 && m.receiverId === u1)
    ).sort((a: Message, b: Message) => a.createdAt - b.createdAt);
  },
  
  sendMessage: (msg: Message) => {
    const msgs = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    msgs.push(msg);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
    
    // Quest check: Bavard
    storage.completeQuest(msg.senderId, 'q5');
  },

  addPost: (post: Post) => {
    const posts = storage.getPosts();
    posts.unshift({ ...post, views: 0, reposts: [] });
    storage.savePosts(posts);
    storage.addReward(post.userId, 100, 250);
    storage.updateVibeScore(post.userId);
    
    // Quest check: Premier Pas
    storage.completeQuest(post.userId, 'q1');
  },

  toggleLike: (postId: string, userId: string) => {
    const posts = storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (!post.likes) post.likes = [];
      const index = post.likes.indexOf(userId);
      if (index === -1) {
        post.likes.push(userId);
        storage.addReward(userId, 10, 25);
        
        // Quest check: Philanthrope (Need to check total likes by user)
        const allPosts = storage.getPosts();
        const userLikesCount = allPosts.filter(p => p.likes?.includes(userId)).length;
        if (userLikesCount >= 5) {
          storage.completeQuest(userId, 'q3');
        }
      } else {
        post.likes.splice(index, 1);
      }
      storage.savePosts(posts);
      storage.updateVibeScore(post.userId);
    }
  },

  toggleSave: (postId: string, userId: string) => {
    const posts = storage.getPosts();
    const users = storage.getUsers();
    const post = posts.find(p => p.id === postId);
    const user = users.find(u => u.id === userId);
    
    if (post && user) {
      if (!post.savedBy) post.savedBy = [];
      if (!user.savedPosts) user.savedPosts = [];
      
      const index = user.savedPosts.indexOf(postId);
      if (index === -1) {
        user.savedPosts.push(postId);
        post.savedBy.push(userId);
      } else {
        user.savedPosts.splice(index, 1);
        const pIndex = post.savedBy.indexOf(userId);
        if (pIndex !== -1) post.savedBy.splice(pIndex, 1);
      }
      
      storage.savePosts(posts);
      storage.saveUsers(users);
      storage.setCurrentUser(user);
      window.dispatchEvent(new CustomEvent('vibeUserUpdated', { detail: { ...user } }));
    }
  },

  addComment: (postId: string, comment: Comment) => {
    const posts = storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (!post.comments) post.comments = [];
      post.comments.push(comment);
      storage.savePosts(posts);
      storage.addReward(comment.userId, 20, 50);
    }
  },

  boostPost: (postId: string, userId: string): { success: boolean, message?: string } => {
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return { success: false };
    const user = users[userIndex];

    const now = Date.now();
    const today = new Date().setHours(0, 0, 0, 0);
    
    if (user.lastBoostReset !== today) {
      user.dailyBoostsCount = 0;
      user.lastBoostReset = today;
    }

    const limit = user.isUltimate ? 10 : 3;
    if (user.dailyBoostsCount >= limit) {
      return { success: false, message: `Limite de boost quotidienne atteinte (${limit}/${limit}).` };
    }
    
    const posts = storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (!post.boosts) post.boosts = [];
      if (!post.boosts.includes(userId)) {
        const cost = user.isUltimate ? 100 : 250;
        if (user.credits < cost) return { success: false, message: `Crédits insuffisants (${cost} C requis).` };
        
        post.boosts.push(userId);
        user.credits -= cost;
        user.xp += 500;
        user.dailyBoostsCount += 1;
        
        // Level up check
        const nextLevelXp = user.level * 1000;
        if (user.xp >= nextLevelXp) {
          user.level += 1;
          user.xp -= nextLevelXp;
        }

        users[userIndex] = { ...user };
        storage.saveUsers(users);
        storage.savePosts(posts);
        storage.setCurrentUser(user);
        storage.updateVibeScore(userId);
        storage.updateVibeScore(post.userId);
        
        // Quest check: Propulseur
        storage.completeQuest(userId, 'q4');
        
        window.dispatchEvent(new CustomEvent('vibeUserUpdated', { detail: { ...user } }));
        window.dispatchEvent(new CustomEvent('vibeRewardToast', { detail: { credits: -cost, xp: 500 } }));
        
        return { success: true };
      }
    }
    return { success: false, message: "Diffusion déjà boostée." };
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      const users = storage.getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...user };
        storage.saveUsers(users);
      }
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  updateUser: (updatedUser: User) => {
    storage.setCurrentUser(updatedUser);
    window.dispatchEvent(new CustomEvent('vibeUserUpdated', { detail: { ...updatedUser } }));
  },

  getTrends: (): Trend[] => [
    { id: 't1', category: 'TECH', hashtag: '#VibeOnly', count: '142K vibes', color: 'from-blue-400 to-purple-500' },
    { id: 't2', category: 'CULTURE', hashtag: '#BonneVibes', count: '89K vibes', color: 'from-pink-400 to-rose-500' },
    { id: 't3', category: 'GAMING', hashtag: '#NexusPlay', count: '64K vibes', color: 'from-emerald-400 to-teal-500' },
  ],

  updateVibeScore: (userId: string) => {
    const users = storage.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      const posts = storage.getPosts().filter(p => p.userId === userId);
      const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
      const totalBoosts = posts.reduce((acc, p) => acc + (p.boosts?.length || 0), 0);
      
      const newScore = 500 + (user.level * 10) + (totalLikes * 5) + (totalBoosts * 20);
      const newMetrics = {
        energy: Math.min(99, 70 + (user.level * 2)),
        flow: Math.min(99, 60 + (posts.length * 5)),
        impact: Math.min(99, 50 + (totalLikes * 2))
      };
      const newRank = `Top ${Math.max(1, 15 - Math.floor(newScore / 200))}% des créateurs ce mois`;
      
      // Only update and dispatch if something changed
      if (user.vibeScore !== newScore || 
          user.vibeRank !== newRank || 
          user.vibeMetrics?.energy !== newMetrics.energy ||
          user.vibeMetrics?.flow !== newMetrics.flow ||
          user.vibeMetrics?.impact !== newMetrics.impact) {
        
        user.vibeScore = newScore;
        user.vibeMetrics = newMetrics;
        user.vibeRank = newRank;
        
        storage.saveUsers(users);
        const current = storage.getCurrentUser();
        if (current?.id === userId) {
          storage.setCurrentUser(user);
          window.dispatchEvent(new CustomEvent('vibeUserUpdated', { detail: { ...user } }));
        }
      }
    }
  },

  getQuests: (): Quest[] => [
    { id: 'q1', title: 'Premier Pas', description: 'Créez votre première diffusion.', reward: 500, xpReward: 1000, type: 'post', goal: 1 },
    { id: 'q2', title: 'Socialiseur', description: 'Ajoutez votre premier ami.', reward: 300, xpReward: 500, type: 'daily', goal: 1 },
    { id: 'q3', title: 'Philanthrope', description: 'Aimez 5 diffusions.', reward: 200, xpReward: 400, type: 'like', goal: 5 },
    { id: 'q4', title: 'Propulseur', description: 'Boostez une diffusion.', reward: 1000, xpReward: 2000, type: 'boost', goal: 1 },
    { id: 'q5', title: 'Bavard', description: 'Envoyez un message (IA ou Ami).', reward: 150, xpReward: 300, type: 'chat', goal: 1 },
  ],

  completeQuest: (userId: string, questId: string) => {
    const users = storage.getUsers();
    const user = users.find(u => u.id === userId);
    if (user && !user.completedQuests.includes(questId)) {
      const quests = storage.getQuests();
      const quest = quests.find(q => q.id === questId);
      if (quest) {
        user.completedQuests.push(questId);
        storage.addReward(userId, quest.reward, quest.xpReward);
        storage.saveUsers(users);
        storage.setCurrentUser(user);
        window.dispatchEvent(new CustomEvent('vibeQuestCompleted', { detail: quest }));
      }
    }
  },

  initialize: () => {
    if (!localStorage.getItem(USERS_KEY)) {
      const auraBot: User = {
        id: 'aura_bot',
        username: 'vibe_official',
        name: 'Vibe HQ',
        bio: 'Bienvenue sur Vibe. Vidéos, Jeux, IA : Tout est là.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
        email: 'contact@vibe.ai',
        credits: 1000, xp: 0, level: 1,
        activeTheme: 'default', isInfinite: true, isUltimate: true, isUltimatePlus: true, lastBoosts: [],
        friends: [],
        savedPosts: [],
        unlockedThemes: ['default'],
        completedQuests: [],
        boostLimit: 10,
        dailyBoostsCount: 0,
        lastBoostReset: new Date().setHours(0, 0, 0, 0),
        vibeScore: 999,
        vibeRank: 'Top 1% des créateurs ce mois',
        vibeMetrics: { energy: 98, flow: 95, impact: 99 }
      };
      storage.saveUsers([auraBot]);
      
      const sampleVids: Post[] = [
        { id: 'v1', userId: 'aura_bot', content: 'Explorez l\'infini de Vibe. #VibeStyle', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-city-at-night-with-neon-lights-2189-large.mp4', mediaType: 'video', createdAt: Date.now(), likes: [], boosts: [], reposts: [], comments: [], views: 15400, savedBy: [] },
        { id: 'v2', userId: 'aura_bot', content: 'Nouveau flux visuel - Vibe v12 Alpha', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-teal-and-pink-colors-1100-large.mp4', mediaType: 'video', createdAt: Date.now() - 5000, likes: [], boosts: [], reposts: [], comments: [], views: 8200, savedBy: [] },
        { id: 'vp1', userId: 'aura_bot', content: 'EXCLUSIF ULTIMATE: Voyage au cœur de l\'application.', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4', mediaType: 'video', createdAt: Date.now() - 10000, likes: [], boosts: [], reposts: [], comments: [], views: 500, isPremium: true, savedBy: [] },
        { id: 'vp2', userId: 'aura_bot', content: 'MASTERCLASS: Maîtriser l\'IA Vibe.', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-computer-in-a-dark-room-4245-large.mp4', mediaType: 'video', createdAt: Date.now() - 20000, likes: [], boosts: [], reposts: [], comments: [], views: 300, isPremium: true, savedBy: [] },
      ];
      storage.savePosts(sampleVids);
    }
  }
};
