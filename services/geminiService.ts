
import { GoogleGenAI, Modality } from "@google/genai";

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

export const gemini = {
  async chat(message: string, thinking: boolean = false) {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, thinking })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur AI Chat');
    }
    const data = await res.json();
    return data.text;
  },

  async search(query: string) {
    const res = await fetch('/api/ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur AI Search');
    }
    return await res.json();
  },

  async generateImage(prompt: string) {
    const res = await fetch('/api/ai/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur AI Image');
    }
    const data = await res.json();
    return data.url;
  },

  async generateVideo(prompt: string) {
    // Video remains a stub or handled differently if needed, 
    // but focusing on fixing the uncaught errors first
    throw new Error("Génération vidéo via API non implémentée sur le serveur. Utilisez Vision pour l'instant.");
  },

  async tts(text: string, voice: string = 'Kore') {
    // TTS can be proxied too if needed
    return null;
  },

  async improveContent(content: string, type: 'grammar' | 'hashtags' | 'style') {
    const res = await fetch('/api/ai/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, type })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur AI Improve');
    }
    const data = await res.json();
    return data.text;
  }
};
