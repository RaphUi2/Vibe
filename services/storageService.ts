
import { User, Post, Comment, Message, Quest, Trend, Story, Note } from '../types.ts';

const USERS_KEY = 'vibe_users_v11';
const POSTS_KEY = 'vibe_posts_v11';
const MESSAGES_KEY = 'vibe_messages_v11';
const AUTH_KEY = 'vibe_auth_v11';
const STORIES_KEY = 'vibe_stories_v11';
const NOTES_KEY = 'vibe_notes_v11';

export const storage = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
  
  getPosts: (): Post[] => {
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    return posts.sort((a: Post, b: Post) => b.createdAt - a.createdAt);
  },
  savePosts: (posts: Post[]) => localStorage.setItem(POSTS_KEY, JSON.stringify(posts)),

  getStories: (): Story[] => {
    const stories = JSON.parse(localStorage.getItem(STORIES_KEY) || '[]');
    const now = Date.now();
    return stories.filter((s: Story) => s.expiresAt > now).sort((a: Story, b: Story) => b.createdAt - a.createdAt);
  },
  saveStories: (stories: Story[]) => localStorage.setItem(STORIES_KEY, JSON.stringify(stories)),
  addStory: (story: Story) => {
    const stories = storage.getStories();
    stories.unshift(story);
    storage.saveStories(stories);
  },

  getNotes: (): Note[] => {
    const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
    const now = Date.now();
    return notes.filter((n: Note) => n.expiresAt > now).sort((a: Note, b: Note) => b.createdAt - a.createdAt);
  },
  saveNotes: (notes: Note[]) => localStorage.setItem(NOTES_KEY, JSON.stringify(notes)),
  addNote: (note: Note) => {
    const notes = storage.getNotes();
    // Remove existing note from same user
    const filtered = notes.filter(n => n.userId !== note.userId);
    filtered.unshift(note);
    storage.saveNotes(filtered);
  },
  
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

  calculateVibeScore: (userId: string) => {
    const users = storage.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const posts = storage.getPosts().filter(p => p.userId === userId);
    const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
    const totalBoosts = posts.reduce((acc, p) => acc + (p.boosts?.length || 0), 0);
    const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
    const friendsCount = user.friends?.length || 0;
    const questsCount = user.completedQuests?.length || 0;

    // More complex score calculation
    const baseScore = 1000;
    const levelBonus = user.level * 250;
    const engagementBonus = (totalLikes * 25) + (totalBoosts * 100) + (Math.floor(totalViews / 10));
    const socialBonus = (friendsCount * 150) + (questsCount * 500);
    const membershipBonus = user.isUltimatePlus ? 10000 : (user.isUltimate ? 5000 : 0);

    const newScore = baseScore + levelBonus + engagementBonus + socialBonus + membershipBonus;

    // Metrics calculation (0-99)
    const newMetrics = {
      energy: Math.min(99, 40 + (user.level * 2) + (questsCount * 5)),
      flow: Math.min(99, 30 + (posts.length * 10) + (Math.floor(totalViews / 500))),
      impact: Math.min(99, 20 + (totalLikes * 5) + (totalBoosts * 15) + (friendsCount * 5))
    };

    // Rank determination
    let newRank = 'Nouveau Nexus';
    if (newScore > 100000) newRank = 'Légende Éternelle';
    else if (newScore > 50000) newRank = 'Maître du Nexus';
    else if (newScore > 25000) newRank = 'Nexus Élite';
    else if (newScore > 10000) newRank = 'Vibe Architect';
    else if (newScore > 5000) newRank = 'Créateur Actif';
    else if (newScore > 2500) newRank = 'Explorateur';

    // Only update if something changed significantly
    if (user.vibeScore !== newScore || user.vibeRank !== newRank) {
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
  },

  addReward: (userId: string, credits: number, xp: number, actionKey?: string) => {
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const user = users[userIndex];
      
      if (actionKey) {
        if (!user.rewardedActions) user.rewardedActions = [];
        if (user.rewardedActions.includes(actionKey)) return user;
        user.rewardedActions.push(actionKey);
      }

      // Boosted rewards: 2x for everyone, 3x for Ultimate
      const multiplier = user.isUltimate ? 3 : 2;
      const finalCredits = credits > 0 ? credits * multiplier : credits;
      const finalXp = xp > 0 ? xp * multiplier : xp;

      user.credits += finalCredits;
      user.xp += finalXp;
      
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
        storage.calculateVibeScore(userId);
        window.dispatchEvent(new CustomEvent('vibeUserUpdated', { detail: { ...user } }));
        if (finalCredits !== 0 || finalXp !== 0) {
          window.dispatchEvent(new CustomEvent('vibeRewardToast', { detail: { credits: finalCredits, xp: finalXp } }));
        }
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
      storage.addReward(userId, 50, 100, `repost-${postId}`);
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
    posts.unshift({ 
      ...post, 
      views: 0, 
      reposts: post.reposts || [], 
      boosts: post.boosts || [], 
      likes: post.likes || [], 
      comments: post.comments || [], 
      savedBy: post.savedBy || [] 
    });
    storage.savePosts(posts);
    storage.addReward(post.userId, 100, 250, `post-${post.id}`);
    storage.calculateVibeScore(post.userId);
    
    // Quest check: Premier Pas
    storage.completeQuest(post.userId, 'q1');
  },

  resetCredits: (userId: string) => {
    const users = storage.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.credits = 500; // Reset to starting value
      storage.saveUsers(users);
      storage.setCurrentUser(user);
      window.dispatchEvent(new CustomEvent('vibeUserUpdated', { detail: { ...user } }));
    }
  },

  getGames: () => [
    // FREE GAMES (30)
    { id: 'clicker', name: 'Synth Clicker 3D', icon: '⚡', color: 'from-blue-600 to-cyan-400', desc: 'Générez des Novas via impulsions neuronales.', difficulty: 'Easy', tier: 'free', players: '1.2k', rating: '94%', image: 'https://picsum.photos/seed/clicker/800/600' },
    { id: 'snake', name: 'Neural Snake 3D', icon: '🐍', color: 'from-emerald-600 to-teal-400', desc: 'Collectez des fragments de données sans collision.', difficulty: 'Medium', tier: 'free', players: '850', rating: '88%', image: 'https://picsum.photos/seed/snake/800/600' },
    { id: 'runner', name: 'Nexus Runner 3D', icon: '🏃', color: 'from-orange-600 to-amber-400', desc: 'Évitez les obstacles dans le tunnel du Nexus.', difficulty: 'Medium', tier: 'free', players: '3.4k', rating: '92%', image: 'https://picsum.photos/seed/runner/800/600' },
    { id: 'jump', name: 'Neon Jump 3D', icon: '🚀', color: 'from-cyan-600 to-blue-400', desc: 'Sautez de plateforme en plateforme.', difficulty: 'Easy', tier: 'free', players: '1.5k', rating: '90%', image: 'https://picsum.photos/seed/jump/800/600' },
    { id: 'dodge', name: 'Data Dodge 3D', icon: '🛡️', color: 'from-yellow-600 to-amber-400', desc: 'Esquivez les pare-feux du Nexus.', difficulty: 'Medium', tier: 'free', players: '2.3k', rating: '93%', image: 'https://picsum.photos/seed/dodge/800/600' },
    { id: 'quiz', name: 'Vibe Quiz 3D', icon: '❓', color: 'from-pink-600 to-rose-400', desc: 'Testez vos connaissances sur le Nexus.', difficulty: 'Easy', tier: 'free', players: '900', rating: '85%', image: 'https://picsum.photos/seed/quiz/800/600' },
    { id: 'stack', name: 'Block Stack 3D', icon: '🧱', color: 'from-indigo-600 to-purple-400', desc: 'Empilez les blocs de données.', difficulty: 'Easy', tier: 'free', players: '1.1k', rating: '87%', image: 'https://picsum.photos/seed/stack/800/600' },
    { id: 'aim', name: 'Aim Trainer 3D', icon: '🎯', color: 'from-red-600 to-rose-400', desc: 'Améliorez vos réflexes.', difficulty: 'Hard', tier: 'free', players: '2.5k', rating: '91%', image: 'https://picsum.photos/seed/aim/800/600' },
    { id: 'color', name: 'Color Match 3D', icon: '🎨', color: 'from-teal-600 to-emerald-400', desc: 'Associez les couleurs du Nexus.', difficulty: 'Medium', tier: 'free', players: '1.4k', rating: '89%', image: 'https://picsum.photos/seed/color/800/600' },
    { id: 'tap', name: 'Fast Tap 3D', icon: '👆', color: 'from-purple-600 to-fuchsia-400', desc: 'Tapez le plus vite possible.', difficulty: 'Easy', tier: 'free', players: '3.1k', rating: '95%', image: 'https://picsum.photos/seed/tap/800/600' },
    { id: 'memory', name: 'Neuro Memory 3D', icon: '🧠', color: 'from-blue-500 to-indigo-400', desc: 'Testez votre mémoire visuelle.', difficulty: 'Medium', tier: 'free', players: '1.8k', rating: '92%', image: 'https://picsum.photos/seed/memory/800/600' },
    { id: 'bricks', name: 'Cyber Bricks 3D', icon: '🧱', color: 'from-orange-500 to-red-400', desc: 'Cassez les briques du Nexus.', difficulty: 'Easy', tier: 'free', players: '2.2k', rating: '90%', image: 'https://picsum.photos/seed/bricks/800/600' },
    { id: 'flappy', name: 'Vibe Bird 3D', icon: '🐦', color: 'from-yellow-500 to-orange-400', desc: 'Volez à travers les serveurs.', difficulty: 'Hard', tier: 'free', players: '4.5k', rating: '88%', image: 'https://picsum.photos/seed/flappy/800/600' },
    { id: 'tetris', name: 'Nexus Blocks 3D', icon: '🧊', color: 'from-indigo-500 to-blue-400', desc: 'Alignez les blocs de données.', difficulty: 'Hard', tier: 'free', players: '3.9k', rating: '94%', image: 'https://picsum.photos/seed/tetris/800/600' },
    { id: 'pong', name: 'Cyber Pong 3D', icon: '🏓', color: 'from-slate-600 to-slate-400', desc: 'Le classique revisité.', difficulty: 'Easy', tier: 'free', players: '1.2k', rating: '86%', image: 'https://picsum.photos/seed/pong/800/600' },
    { id: 'invaders', name: 'Data Invaders 3D', icon: '👾', color: 'from-purple-600 to-blue-400', desc: 'Défendez le Nexus.', difficulty: 'Medium', tier: 'free', players: '2.8k', rating: '92%', image: 'https://picsum.photos/seed/invaders/800/600' },
    { id: 'mines', name: 'Nexus Mines 3D', icon: '💣', color: 'from-red-600 to-orange-400', desc: 'Déminez les serveurs.', difficulty: 'Hard', tier: 'free', players: '950', rating: '84%', image: 'https://picsum.photos/seed/mines/800/600' },
    { id: 'sudoku', name: 'Neuro Sudoku 3D', icon: '🔢', color: 'from-blue-600 to-indigo-400', desc: 'Logique pure.', difficulty: 'Hard', tier: 'free', players: '1.5k', rating: '88%', image: 'https://picsum.photos/seed/sudoku/800/600' },
    { id: 'helix', name: 'Helix Jump 3D', icon: '🌀', color: 'from-pink-500 to-rose-400', desc: 'Descendez la tour infinie.', difficulty: 'Medium', tier: 'free', players: '2.1k', rating: '91%', image: 'https://picsum.photos/seed/helix/800/600' },
    { id: 'ball', name: 'Rolling Ball 3D', icon: '⚽', color: 'from-emerald-500 to-teal-400', desc: 'Contrôlez la balle sur le circuit.', difficulty: 'Medium', tier: 'free', players: '1.7k', rating: '89%', image: 'https://picsum.photos/seed/ball/800/600' },
    { id: 'knife', name: 'Knife Hit 3D', icon: '🔪', color: 'from-slate-500 to-slate-700', desc: 'Lancez des couteaux.', difficulty: 'Medium', tier: 'free', players: '1.1k', rating: '87%', image: 'https://picsum.photos/seed/knife/800/600' },
    { id: 'soccer', name: 'Soccer Vibe 3D', icon: '⚽', color: 'from-green-500 to-emerald-600', desc: 'Marquez des buts.', difficulty: 'Easy', tier: 'free', players: '2.4k', rating: '92%', image: 'https://picsum.photos/seed/soccer/800/600' },
    { id: 'basket', name: 'Basket Vibe 3D', icon: '🏀', color: 'from-orange-500 to-red-600', desc: 'Faites des dunks.', difficulty: 'Medium', tier: 'free', players: '1.9k', rating: '90%', image: 'https://picsum.photos/seed/basket/800/600' },
    { id: 'tennis', name: 'Tennis Vibe 3D', icon: '🎾', color: 'from-lime-500 to-green-600', desc: 'Matchs de tennis.', difficulty: 'Medium', tier: 'free', players: '1.3k', rating: '88%', image: 'https://picsum.photos/seed/tennis/800/600' },
    { id: 'golf', name: 'Golf Vibe 3D', icon: '⛳', color: 'from-emerald-400 to-teal-500', desc: 'Le golf zen.', difficulty: 'Easy', tier: 'free', players: '1.5k', rating: '93%', image: 'https://picsum.photos/seed/golf/800/600' },
    { id: 'bowling', name: 'Bowling Vibe 3D', icon: '🎳', color: 'from-blue-400 to-indigo-500', desc: 'Faites des strikes.', difficulty: 'Easy', tier: 'free', players: '2.1k', rating: '91%', image: 'https://picsum.photos/seed/bowling/800/600' },
    { id: 'chess', name: 'Chess Vibe 3D', icon: '♟️', color: 'from-slate-800 to-black', desc: 'Échecs stratégiques.', difficulty: 'Hard', tier: 'free', players: '800', rating: '89%', image: 'https://picsum.photos/seed/chess/800/600' },
    { id: 'cards', name: 'Cards Vibe 3D', icon: '🃏', color: 'from-red-500 to-rose-600', desc: 'Jeux de cartes.', difficulty: 'Medium', tier: 'free', players: '1.6k', rating: '87%', image: 'https://picsum.photos/seed/cards/800/600' },
    { id: 'dice', name: 'Dice Vibe 3D', icon: '🎲', color: 'from-white to-slate-200', desc: 'Lancez les dés.', difficulty: 'Easy', tier: 'free', players: '1.2k', rating: '85%', image: 'https://picsum.photos/seed/dice/800/600' },
    { id: 'ludo', name: 'Ludo Vibe 3D', icon: '🎲', color: 'from-yellow-400 to-orange-500', desc: 'Le jeu culte.', difficulty: 'Easy', tier: 'free', players: '3.5k', rating: '94%', image: 'https://picsum.photos/seed/ludo/800/600' },

    // ULTIMATE GAMES (15)
    { id: 'matrix', name: 'Memory Matrix 3D', icon: '💠', color: 'from-purple-600 to-indigo-600', desc: 'Répétez la séquence de synchronisation Aura.', difficulty: 'Hard', tier: 'ultimate', players: '420', rating: '91%', image: 'https://picsum.photos/seed/matrix/800/600' },
    { id: 'math', name: 'Fast Math 3D', icon: '🧮', color: 'from-rose-600 to-pink-600', desc: 'Résolvez les équations du Nexus.', difficulty: 'Medium', tier: 'ultimate', players: '2.1k', rating: '96%', image: 'https://picsum.photos/seed/math/800/600' },
    { id: 'battle', name: 'Aura Battle 3D', icon: '⚔️', color: 'from-indigo-600 to-blue-600', desc: 'Combattez dans l\'arène Aura.', difficulty: 'Hard', tier: 'ultimate', players: '5.6k', rating: '98%', image: 'https://picsum.photos/seed/battle/800/600' },
    { id: 'tower', name: 'Aura Tower 3D', icon: '🏰', color: 'from-violet-600 to-purple-600', desc: 'Construisez la plus haute tour.', difficulty: 'Hard', tier: 'ultimate', players: '1.1k', rating: '89%', image: 'https://picsum.photos/seed/tower/800/600' },
    { id: 'space', name: 'Space Void 3D', icon: '🌌', color: 'from-slate-800 to-slate-600', desc: 'Explorez le vide spatial.', difficulty: 'Medium', tier: 'ultimate', players: '750', rating: '92%', image: 'https://picsum.photos/seed/space/800/600' },
    { id: 'cyber_race', name: 'Cyber Racer 3D', icon: '🏎️', color: 'from-blue-600 to-cyan-400', desc: 'Course néon à haute vitesse.', difficulty: 'Hard', tier: 'ultimate', players: '3.2k', rating: '95%', image: 'https://picsum.photos/seed/cyber_race/800/600' },
    { id: 'neon_golf', name: 'Neon Golf 3D', icon: '⛳', color: 'from-emerald-600 to-teal-400', desc: 'Golf futuriste.', difficulty: 'Medium', tier: 'ultimate', players: '1.8k', rating: '90%', image: 'https://picsum.photos/seed/neon_golf/800/600' },
    { id: 'data_flow', name: 'Data Flow 3D', icon: '🌊', color: 'from-cyan-600 to-blue-400', desc: 'Connectez les flux de données.', difficulty: 'Hard', tier: 'ultimate', players: '2.5k', rating: '93%', image: 'https://picsum.photos/seed/data_flow/800/600' },
    { id: 'sky_jump', name: 'Sky Jump 3D', icon: '☁️', color: 'from-sky-500 to-blue-400', desc: 'Sautez dans les nuages.', difficulty: 'Medium', tier: 'ultimate', players: '1.3k', rating: '87%', image: 'https://picsum.photos/seed/sky/800/600' },
    { id: 'neon_drift', name: 'Neon Drift 3D', icon: '🚗', color: 'from-red-500 to-orange-400', desc: 'Driftez dans la ville néon.', difficulty: 'Hard', tier: 'ultimate', players: '2.9k', rating: '94%', image: 'https://picsum.photos/seed/drift/800/600' },
    { id: 'cyber_chess', name: 'Cyber Chess 3D', icon: '♟️', color: 'from-slate-700 to-slate-900', desc: 'Échecs futuristes.', difficulty: 'Hard', tier: 'ultimate', players: '800', rating: '91%', image: 'https://picsum.photos/seed/chess/800/600' },
    { id: 'void_runner', name: 'Void Runner 3D', icon: '🏃‍♂️', color: 'from-indigo-900 to-purple-900', desc: 'Courez dans le vide.', difficulty: 'Expert', tier: 'ultimate', players: '1.5k', rating: '92%', image: 'https://picsum.photos/seed/voidrun/800/600' },
    { id: 'ninja', name: 'Ninja Vibe 3D', icon: '🥷', color: 'from-slate-900 to-black', desc: 'L\'art de la furtivité.', difficulty: 'Hard', tier: 'ultimate', players: '2.1k', rating: '93%', image: 'https://picsum.photos/seed/ninja/800/600' },
    { id: 'samurai', name: 'Samurai Vibe 3D', icon: '⚔️', color: 'from-red-900 to-black', desc: 'Le code de l\'honneur.', difficulty: 'Hard', tier: 'ultimate', players: '1.8k', rating: '95%', image: 'https://picsum.photos/seed/samurai/800/600' },
    { id: 'pirate', name: 'Pirate Vibe 3D', icon: '🏴‍☠️', color: 'from-blue-900 to-black', desc: 'Voguez sur les mers.', difficulty: 'Medium', tier: 'ultimate', players: '2.5k', rating: '91%', image: 'https://picsum.photos/seed/pirate/800/600' },

    // ULTIMATE+ GAMES (15)
    { id: 'god', name: 'Nexus God 3D', icon: '👑', color: 'from-amber-500 to-yellow-400', desc: 'Devenez le dieu du Nexus.', difficulty: 'Expert', tier: 'ultimate_plus', players: '150', rating: '99%', image: 'https://picsum.photos/seed/god/800/600' },
    { id: 'hack', name: 'Core Hacker 3D', icon: '💻', color: 'from-lime-500 to-green-400', desc: 'Hackez le noyau central.', difficulty: 'Hard', tier: 'ultimate_plus', players: '300', rating: '97%', image: 'https://picsum.photos/seed/hack/800/600' },
    { id: 'time', name: 'Time Warp 3D', icon: '⏳', color: 'from-cyan-500 to-blue-400', desc: 'Manipulez le temps.', difficulty: 'Expert', tier: 'ultimate_plus', players: '220', rating: '94%', image: 'https://picsum.photos/seed/time/800/600' },
    { id: 'void', name: 'Void Walker 3D', icon: '🚶', color: 'from-black to-slate-800', desc: 'Marchez dans le néant.', difficulty: 'Hard', tier: 'ultimate_plus', players: '180', rating: '96%', image: 'https://picsum.photos/seed/void/800/600' },
    { id: 'infinity', name: 'Infinity Loop 3D', icon: '♾️', color: 'from-fuchsia-500 to-pink-400', desc: 'Boucle infinie de données.', difficulty: 'Expert', tier: 'ultimate_plus', players: '400', rating: '98%', image: 'https://picsum.photos/seed/infinity/800/600' },
    { id: 'quantum', name: 'Quantum Leap 3D', icon: '⚛️', color: 'from-indigo-600 to-purple-400', desc: 'Sauts quantiques.', difficulty: 'Expert', tier: 'ultimate_plus', players: '250', rating: '97%', image: 'https://picsum.photos/seed/quantum/800/600' },
    { id: 'neural_net', name: 'Neural Net 3D', icon: '🕸️', color: 'from-emerald-600 to-teal-400', desc: 'Tissez le réseau neuronal.', difficulty: 'Expert', tier: 'ultimate_plus', players: '350', rating: '96%', image: 'https://picsum.photos/seed/neural_net/800/600' },
    { id: 'singularity', name: 'Singularity 3D', icon: '🕳️', color: 'from-slate-900 to-black', desc: 'Échappez à la singularité.', difficulty: 'Expert', tier: 'ultimate_plus', players: '120', rating: '99%', image: 'https://picsum.photos/seed/singularity/800/600' },
    { id: 'dimension', name: 'Dimension Shift 3D', icon: '🌀', color: 'from-rose-500 to-orange-400', desc: 'Changez de dimension.', difficulty: 'Expert', tier: 'ultimate_plus', players: '200', rating: '95%', image: 'https://picsum.photos/seed/dim/800/600' },
    { id: 'supernova', name: 'Supernova 3D', icon: '💥', color: 'from-orange-600 to-red-600', desc: 'Survivez à l\'explosion.', difficulty: 'Expert', tier: 'ultimate_plus', players: '300', rating: '98%', image: 'https://picsum.photos/seed/nova/800/600' },
    { id: 'nexus_prime', name: 'Nexus Prime 3D', icon: '🌌', color: 'from-blue-900 to-indigo-900', desc: 'L\'expérience VR ultime.', difficulty: 'Expert', tier: 'ultimate_plus', players: '100', rating: '99%', image: 'https://picsum.photos/seed/prime/800/600' },
    { id: 'aura_quest', name: 'Aura Quest 3D', icon: '✨', color: 'from-amber-400 to-yellow-600', desc: 'L\'aventure RPG avec Aura.', difficulty: 'Hard', tier: 'ultimate_plus', players: '500', rating: '97%', image: 'https://picsum.photos/seed/quest/800/600' },
    { id: 'infinity_vibe', name: 'Infinity Vibe 3D', icon: '♾️', color: 'from-fuchsia-600 to-pink-600', desc: 'Le jeu sans fin.', difficulty: 'Expert', tier: 'ultimate_plus', players: '300', rating: '98%', image: 'https://picsum.photos/seed/infvibe/800/600' },
    { id: 'god_vibe', name: 'God Vibe 3D', icon: '🌍', color: 'from-emerald-500 to-teal-500', desc: 'Créez votre propre univers.', difficulty: 'Expert', tier: 'ultimate_plus', players: '200', rating: '99%', image: 'https://picsum.photos/seed/godvibe/800/600' },
    { id: 'time_vibe', name: 'Time Vibe 3D', icon: '⏳', color: 'from-cyan-600 to-blue-600', desc: 'Voyagez dans le temps.', difficulty: 'Expert', tier: 'ultimate_plus', players: '150', rating: '96%', image: 'https://picsum.photos/seed/timevibe/800/600' },
  ],

  toggleLike: (postId: string, userId: string) => {
    const posts = storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (!post.likes) post.likes = [];
      const index = post.likes.indexOf(userId);
      if (index === -1) {
        post.likes.push(userId);
        storage.addReward(userId, 10, 25, `like-${postId}`);
        
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
      storage.calculateVibeScore(post.userId);
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
      storage.addReward(comment.userId, 20, 50, `comment-${comment.id}`);
    }
  },

  addProfileComment: (userId: string, authorId: string, content: string) => {
    const users = storage.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      if (!user.profileComments) user.profileComments = [];
      user.profileComments.push({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        authorId,
        content,
        createdAt: Date.now()
      });
      const lastComment = user.profileComments[user.profileComments.length - 1];
      storage.saveUsers(users);
      storage.addReward(authorId, 10, 30, `profile-comment-${lastComment.id}`);
    }
  },

  toggleBoost: (postId: string, userId: string): { success: boolean, message?: string, action?: 'added' | 'removed' } => {
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return { success: false };
    const user = users[userIndex];

    const posts = storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return { success: false, message: "Diffusion non trouvée." };

    if (!post.boosts) post.boosts = [];
    const index = post.boosts.indexOf(userId);

    if (index === -1) {
      const now = Date.now();
      const today = new Date().setHours(0, 0, 0, 0);
      
      if (user.lastBoostReset !== today) {
        user.dailyBoostsCount = 0;
        user.lastBoostReset = today;
      }

      const limit = user.isUltimatePlus ? 25 : (user.isUltimate ? 12 : 5);
      if (user.dailyBoostsCount >= limit) {
        return { success: false, message: `Limite de boost quotidienne atteinte (${limit}/${limit}).` };
      }
      
      const cost = user.isUltimatePlus ? 50 : (user.isUltimate ? 150 : 300);
      if (user.credits < cost) return { success: false, message: `Novas insuffisants (${cost} N requis).` };
      
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
      storage.calculateVibeScore(userId);
      storage.calculateVibeScore(post.userId);
      
      // Quest check: Propulseur
      storage.completeQuest(userId, 'q4');
      
      window.dispatchEvent(new CustomEvent('vibeUserUpdated', { detail: { ...user } }));
      window.dispatchEvent(new CustomEvent('vibeRewardToast', { detail: { credits: -cost, xp: 500 } }));
      
      return { success: true, action: 'added' };
    } else {
      // Unboost
      post.boosts.splice(index, 1);
      // No refund for unboost to prevent abuse
      users[userIndex] = { ...user };
      storage.saveUsers(users);
      storage.savePosts(posts);
      storage.setCurrentUser(user);
      storage.calculateVibeScore(userId);
      storage.calculateVibeScore(post.userId);
      
      window.dispatchEvent(new CustomEvent('vibeUserUpdated', { detail: { ...user } }));
      
      return { success: true, action: 'removed' };
    }
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

  getQuests: (): Quest[] => [
    { id: 'q1', title: 'Premier Pas', description: 'Créez votre première diffusion.', reward: 1000, xpReward: 2000, type: 'post', goal: 1 },
    { id: 'q2', title: 'Socialiseur', description: 'Ajoutez votre premier ami.', reward: 600, xpReward: 1000, type: 'daily', goal: 1 },
    { id: 'q3', title: 'Philanthrope', description: 'Aimez 5 diffusions.', reward: 400, xpReward: 800, type: 'like', goal: 5 },
    { id: 'q4', title: 'Propulseur', description: 'Boostez une diffusion.', reward: 2000, xpReward: 4000, type: 'boost', goal: 1 },
    { id: 'q5', title: 'Bavard', description: 'Envoyez un message (IA ou Ami).', reward: 300, xpReward: 600, type: 'chat', goal: 1 },
    { id: 'q6', title: 'Joueur Vibe', description: 'Jouez à un jeu VibeGames.', reward: 800, xpReward: 1500, type: 'game', goal: 1 },
    { id: 'q7', title: 'Créateur Vibeo', description: 'Publiez un Vibeo.', reward: 1500, xpReward: 3000, type: 'vibeo', goal: 1 },
    { id: 'q8', title: 'Explorateur', description: 'Recherchez 3 fois avec l\'IA.', reward: 500, xpReward: 1000, type: 'search', goal: 3 },
    { id: 'q9', title: 'Collectionneur', description: 'Sauvegardez 5 diffusions.', reward: 600, xpReward: 1200, type: 'save', goal: 5 },
    { id: 'q10', title: 'Acheteur Compulsif', description: 'Achetez un thème dans la boutique.', reward: 1000, xpReward: 2500, type: 'shop', goal: 1 },
    { id: 'u1', title: 'Maître Ultimate', description: 'Générez 5 images IA.', reward: 5000, xpReward: 10000, type: 'daily', goal: 5, ultimate: true },
    { id: 'u2', title: 'Visionnaire', description: 'Créez une vidéo IA.', reward: 10000, xpReward: 20000, type: 'daily', goal: 1, ultimate: true },
    { id: 'u3', title: 'Champion Vibe', description: 'Atteignez le niveau 10.', reward: 20000, xpReward: 50000, type: 'level', goal: 10, ultimate: true },
    { id: 'u4', title: 'Influenceur', description: 'Obtenez 100 likes sur vos diffusions.', reward: 15000, xpReward: 30000, type: 'social', goal: 100, ultimate: true },
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
        avatar: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=200&h=200',
        email: 'contact@vibe.ai',
        credits: 100000, xp: 0, level: 100,
        activeTheme: 'default', isInfinite: true, isUltimate: true, isUltimatePlus: true, lastBoosts: [],
        friends: [],
        savedPosts: [],
        unlockedThemes: ['default'],
        claimedLevelRewards: [],
        rewardedActions: [],
        completedQuests: [],
        boostLimit: 100,
        dailyBoostsCount: 0,
        lastBoostReset: new Date().setHours(0, 0, 0, 0),
        vibeScore: 9999,
        vibeRank: 'Fondateur du Nexus',
        vibeMetrics: { energy: 99, flow: 99, impact: 99 },
        isCertified: true
      };
      storage.saveUsers([auraBot]);
      
      const sampleVids: Post[] = [
        { id: 'v1', userId: 'aura_bot', content: 'UPDATE 3.0: Le Nexus évolue. Nouveau design, Ultimate Shop, et plus encore ! #Vibe3.0', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-city-at-night-with-neon-lights-2189-large.mp4', mediaType: 'video', createdAt: Date.now(), likes: [], boosts: [], reposts: [], comments: [], views: 15400, savedBy: [] },
        { id: 'v2', userId: 'aura_bot', content: 'Nouveau flux visuel - Vibe v3.0 Alpha', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-teal-and-pink-colors-1100-large.mp4', mediaType: 'video', createdAt: Date.now() - 5000, likes: [], boosts: [], reposts: [], comments: [], views: 8200, savedBy: [] },
        { id: 'vp1', userId: 'aura_bot', content: 'EXCLUSIF ULTIMATE: Voyage au cœur de l\'application.', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4', mediaType: 'video', createdAt: Date.now() - 10000, likes: [], boosts: [], reposts: [], comments: [], views: 500, isPremium: true, savedBy: [] },
        { id: 'vp2', userId: 'aura_bot', content: 'MASTERCLASS: Maîtriser l\'IA Vibe.', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-computer-in-a-dark-room-4245-large.mp4', mediaType: 'video', createdAt: Date.now() - 20000, likes: [], boosts: [], reposts: [], comments: [], views: 300, isPremium: true, savedBy: [] },
      ];
      storage.savePosts(sampleVids);
    }
  }
};
