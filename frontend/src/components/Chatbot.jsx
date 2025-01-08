import React, { useState, useRef } from "react";
import ContentInputForm from "./ContentInputForm";
import SEORecommendations from "./SEORecommendations";
import { motion, AnimatePresence } from "framer-motion";
import { FiCopy, FiCheck } from "react-icons/fi";
import './Chatbot.css';
const Chatbot = () => {
    const [generatedContent, setGeneratedContent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [seoData, setSeoData] = useState(null);
    const [copied, setCopied] = useState(false);
    const generatedContentRef = useRef(null);

    const handleCopyToClipboard = () => {
        if (generatedContentRef.current) {
            navigator.clipboard
                .writeText(generatedContentRef.current.innerText)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch((err) => console.error("Failed to copy: ", err));
        }
    };

    const handleFormSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        setGeneratedContent(null);
        setSeoData(null);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/generate-content`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch content");
            }

            const data = await response.json();
            if (data && data.content) {
                setGeneratedContent(data.content);
                setSeoData(data.seo);
            } else {
                throw new Error("Invalid content format received from the server.");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-content">
                <motion.div
                    className="input-section"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <ContentInputForm onSubmit={handleFormSubmit} />
                </motion.div>
                <motion.div
                    className="output-section"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                className="loading-message"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="spinner"></div>
                                <p>Generating content...</p>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                className="error-message"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {error}
                            </motion.div>
                        ) : generatedContent ? (
                            <motion.div
                                key="content"
                                className="generated-content-container"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <h2>Generated Content</h2>
                                <div
                                    className="generated-content"
                                    ref={generatedContentRef}
                                    dangerouslySetInnerHTML={{ __html: generatedContent }}
                                />
                                <button onClick={handleCopyToClipboard} className="copy-button">
                                    {copied ? <FiCheck /> : <FiCopy />}
                                    {copied ? "Copied!" : "Copy to Clipboard"}
                                </button>
                                <SEORecommendations seoData={seoData} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                className="placeholder-message"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Your generated content will appear here.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Chatbot;

