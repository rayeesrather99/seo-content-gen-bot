import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import generateSEO from './utils/seo-utils.js';

const app = express();
const port = process.env.PORT || 5000;
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
    origin: frontendURL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const generateContent = async (promptData) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        let prompt = `Write a ${promptData.contentType} about ${promptData.topic}.\n\n`;

        if (promptData.keywords) {
            prompt += `Target keywords: ${promptData.keywords}.\n\n`;
        }

        if (promptData.targetAudience) {
            prompt += `Target audience: ${promptData.targetAudience}.\n\n`;
        }

        if (promptData.tone) {
            prompt += `Tone: ${promptData.tone}.\n\n`;
        }
        if (promptData.length) {
            prompt += `Desired length: Approximately ${promptData.length} words.\n\n`;
        }

        prompt += "Write a well-structured content with an introduction, body paragraphs, and a conclusion. Use markdown formatting for headings, bold text, and lists where appropriate.\n\n";

        console.log("Generated Prompt:", prompt);
        const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
        console.log("Raw Gemini API Response:", JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('Error in generateContent:', error);
        if (error.response && error.response.data) {
            console.error("Gemini API Error Details:", JSON.stringify(error.response.data, null, 2));
            throw new Error(`Gemini API Error: ${error.response.data.error.message || 'Unknown error'}`);
        } else if (error.response) {
            console.error("Gemini API Error Details:", JSON.stringify(error.response, null, 2));
            throw new Error(`Gemini API Error: ${error.message || 'Unknown error'}`);
        }
        throw new Error(`Content generation failed: ${error.message}`);
    }
};

app.post('/generate-content', async (req, res) => {
    console.log("Incoming request to /generate-content:", req.body);
    try {
        const { topic, keywords, targetAudience, tone, contentType, length } = req.body;

        
        if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Topic is required and must be a non-empty string." });
        }

        if (keywords && typeof keywords !== 'string') {
            return res.status(400).json({ success: false, message: "Keywords must be a string." });
        }
        if (targetAudience && typeof targetAudience !== 'string') {
            return res.status(400).json({ success: false, message: "Target Audience must be a string." });
        }
        if (tone && typeof tone !== 'string') {
            return res.status(400).json({ success: false, message: "Tone must be a string." });
        }
        if (!contentType || typeof contentType !== 'string' || contentType.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Content Type is required and must be a non-empty string." });
        }

        if (length && (typeof length !== 'number' || length <= 0)) {
            return res.status(400).json({ success: false, message: "Length must be a positive number." });
        }

        const sanitizedTopic = topic.trim();
        const sanitizedKeywords = keywords ? keywords.trim() : "";
        const sanitizedTargetAudience = targetAudience ? targetAudience.trim() : "";
        const sanitizedTone = tone ? tone.trim() : "";
        const sanitizedContentType = contentType.trim();
        const sanitizedLength = length ? length : "";

        const promptData = {
            topic: sanitizedTopic,
            keywords: sanitizedKeywords,
            targetAudience: sanitizedTargetAudience,
            tone: sanitizedTone,
            contentType: sanitizedContentType,
            length: sanitizedLength,
        };

        const result = await generateContent(promptData);

        if (result && result.response && result.response.candidates && result.response.candidates.length > 0 &&
            result.response.candidates[0].content && result.response.candidates[0].content.parts && result.response.candidates[0].content.parts.length > 0) {
            const generatedText = result.response.candidates[0].content.parts[0].text;
            console.log('Generated content:', generatedText);

            const seoData = generateSEO(generatedText, promptData.topic, promptData.keywords);

            res.json({ success: true, content: generatedText, seo: seoData });
        } else {
            console.error("Invalid response from Gemini API:", result);
            res.status(500).json({ success: false, message: "Invalid response from Gemini API" });
        }
        console.log("Successfully generated content.");
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});