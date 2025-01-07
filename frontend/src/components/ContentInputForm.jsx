import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

const ContentInputForm = ({ onSubmit }) => {
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [targetAudience, setAudience] = useState('');
    const [tone, setTone] = useState('');
    const [contentType, setContentType] = useState('');
    const [length, setLength] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!topic || !contentType) {
            alert("Please fill in Topic and Content Type.");
            return;
        }

        const formData = {
            topic,
            keywords,
            targetAudience,
            tone,
            contentType,
            length: length ? parseInt(length, 10) : undefined,
        };

        onSubmit(formData);
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="input-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="form-group">
                <label htmlFor="topic">Topic</label>
                <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The Evolution of Social Media"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="keywords">Keywords (comma-separated)</label>
                <input
                    type="text"
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., social media, trends, Instagram, Twitter"
                />
            </div>
            <div className="form-group">
                <label htmlFor="targetAudience">Target Audience</label>
                <input
                    type="text"
                    id="targetAudience"
                    value={targetAudience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g., Teenagers, social media users"
                />
            </div>
            <div className="form-group">
                <label htmlFor="tone">Tone</label>
                <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                >
                    <option value="">Select a tone</option>
                    <option value="formal">Formal</option>
                    <option value="informal">Informal</option>
                    <option value="humorous">Humorous</option>
                    <option value="persuasive">Persuasive</option>
                    <option value="analytical">Analytical</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="contentType">Content Type</label>
                <select
                    id="contentType"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                >
                    <option value="">Select a content type</option>
                    <option value="blog post">Blog Post</option>
                    <option value="article">Article</option>
                    <option value="product description">Product Description</option>
                    <option value="social media caption">Social Media Caption</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="length">Desired Length (words)</label>
                <input
                    type="number"
                    id="length"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="e.g., 100"
                />
            </div>
            <motion.button
                type="submit"
                className="generate-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FiSend /> Generate Content
            </motion.button>
        </motion.form>
    );
};

export default ContentInputForm;
