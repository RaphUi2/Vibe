import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;
const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

const ai = new GoogleGenAI({
  apiKey: API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, thinking } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: message,
        config: thinking ? { thinkingConfig: { thinkingLevel: 'HIGH' } } as any : {}
      });
      
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/search", async (req, res) => {
    try {
      const { query } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: { tools: [{ googleSearch: {} }] }
      });

      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
        if (chunk.web) return { title: chunk.web.title || 'Source', uri: chunk.web.uri || '#' };
        return null;
      }).filter(Boolean) || [];

      res.json({ text: response.text, grounding });
    } catch (error: any) {
      console.error("AI Search Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } }
      });
      
      let imageUrl = "";
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
      
      if (imageUrl) {
        res.json({ url: imageUrl });
      } else {
        throw new Error("No image data received");
      }
    } catch (error: any) {
      console.error("Image Gen Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/improve", async (req, res) => {
    try {
      const { content, type } = req.body;
      let prompt = "";
      if (type === 'grammar') prompt = `Améliore la grammaire et l'orthographe de ce post tout en gardant son style original: "${content}". Retourne uniquement le texte corrigé.`;
      if (type === 'hashtags') prompt = `Suggère 5 hashtags pertinents pour ce post: "${content}". Retourne uniquement les hashtags séparés par des espaces.`;
      if (type === 'style') prompt = `Réécris ce post pour qu'il soit plus engageant et "viral" sur les réseaux sociaux: "${content}". Retourne uniquement le nouveau texte.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Improve Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
