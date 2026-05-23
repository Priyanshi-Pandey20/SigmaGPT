import express from "express";
import Thread from "../models/Thread.js";
import getOpenAPIRespone from "../utils/openai.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// 🎨 Image keywords detector
const IMAGE_KEYWORDS = [
  "generate image of",
  "generate an image of",
  "create image of",
  "create an image of",
  "draw",
  "make image of",
  "show image of",
  "generate a picture of",
  "create a picture of",
  "make a picture of",
];

const isImageRequest = (message) => {
  return IMAGE_KEYWORDS.some((kw) => message.toLowerCase().includes(kw));
};

const extractImagePrompt = (message) => {
  let prompt = message;
  IMAGE_KEYWORDS.forEach((kw) => {
    prompt = prompt.replace(new RegExp(kw, "gi"), "");
  });
  return prompt.trim();
};

// ✅ GET all threads for logged in user only
router.get("/thread", authMiddleware, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// ✅ GET single thread for logged in user only
router.get("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId, userId: req.userId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// ✅ DELETE thread for logged in user only
router.delete("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.userId });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete chats" });
  }
});

// ✅ POST chat for logged in user only
router.post("/chat", authMiddleware, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId, userId: req.userId });

    if (!thread) {
      thread = new Thread({
        threadId,
        userId: req.userId,        // ✅ attach user
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    let assistantReply;

    if (isImageRequest(message)) {
      const imagePrompt = extractImagePrompt(message);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        imagePrompt
      )}?width=512&height=512&nologo=true`;
      assistantReply = `![generated image](${imageUrl})`;
    } else {
      assistantReply = await getOpenAPIRespone(message);
    }

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

export default router;