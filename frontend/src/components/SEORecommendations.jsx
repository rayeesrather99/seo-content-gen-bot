import React from 'react';
import './SEORecommendations.css'; // Import CSS

const SEORecommendations = ({ seoData }) => {
    if (!seoData) {
        return null;
    }

    return (
        <div className="seo-recommendations">
            <h3>SEO Recommendations:</h3>
            <div className="seo-item">
                <span className="seo-label">Title:</span> {seoData.title}
            </div>
            <div className="seo-item">
                <span className="seo-label">Meta Description:</span> {seoData.metaDescription}
            </div>
            <div className="seo-item">
                <span className="seo-label">H1:</span> {seoData.h1}
            </div>
            <div>
                <span className="seo-label">H2s:</span>
                <ul>
                    {seoData.h2s.map((h2, index) => (
                        <li key={index}>{h2}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SEORecommendations;