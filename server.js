import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { franc } from 'franc-min';
import fs from 'fs';
import { SpeechClient } from '@google-cloud/speech';

dotenv.config();

const app = express();

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('✅ MongoDB connected successfully!'))
    .catch((err) => {
        console.error(`❌ MongoDB connection error: ${err}`);
        process.exit(1);
    });

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 4, maxlength: 16 },
    email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/ },
    password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ error: 'Username or email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Server error during signup.' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// Serve HTML Pages
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/html/index.html'));
});

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/html/signup.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/html/login.html'));
});

app.get('/index.php', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'http://localhost:8080/'));
});

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      let uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (req.body.type === 'realTime') {
          uploadDir = path.join(uploadDir, 'real-time');
      } else if (req.body.type === 'batch') {
          uploadDir = path.join(uploadDir, 'batch');
      } else if (req.body.type === 'train') {
          uploadDir = path.join(uploadDir, 'train');
      }
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Gemini AI Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Google Cloud Speech-to-Text Client
const speechClient = new SpeechClient();

// Audio Processing Route
app.post('/api/process-audio', upload.array('audioFiles'), async (req, res) => {
  try {
      const files = req.files;
      const language = req.body.language || 'auto';
      const keywords = req.body.keywords ? JSON.parse(req.body.keywords) : [];
      const results = [];

      for (const file of files) {
          const detectedLanguage = language === 'auto' ? franc(file.originalname) : language;
          const transcription = await speechToText(file.path, detectedLanguage);
          const keywordMatches = await searchKeywordsWithGemini(transcription, keywords, detectedLanguage);

          results.push({
              filename: file.filename,
              language: detectedLanguage,
              transcription: transcription,
              keywordMatches: keywordMatches,
              type: req.body.type,
          });
      }
      res.json(results);
  } catch (error) {
      console.error('Audio processing error:', error);
      res.status(500).json({ error: 'Audio processing failed' });
  }
});

// Speech-to-Text Function (Google Cloud Speech-to-Text)
async function speechToText(filePath, languageCode) {
    const file = fs.readFileSync(filePath);
    const audioBytes = file.toString('base64');

    const audio = { content: audioBytes };
    const config = {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: languageCode,
    };
    const request = { audio: audio, config: config };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results.map((result) => result.alternatives[0].transcript).join('\n');
    return transcription;
}

// Keyword Search with Gemini (modified to include language)
async function searchKeywordsWithGemini(text, keywords, language) {
    if (!keywords.length) return [];

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Text: "${text}"
    Keywords: ${JSON.stringify(keywords)}
    Language: ${language}
    
    Find semantic matches for these keywords. 
    Provide:
    - Matched Word
    - Original Keyword
    - Semantic Similarity Score
    - Intent/Context
    `;

    try {
        const result = await model.generateContent(prompt);
        return parseKeywordMatches(result.response.text());
    } catch (error) {
        console.error('Gemini API error:', error);
        return [];
    }
}

// Helper function to parse keyword matches
function parseKeywordMatches(responseText) {
    // Implement parsing logic to extract keyword matches
    return [];
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));