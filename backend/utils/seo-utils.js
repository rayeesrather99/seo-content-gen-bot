function generateSEO(content, topic, keywords) {
  const title = `Best ${topic} - ${keywords.split(',')[0]}`; 
  const metaDescription = content.substring(0, 150) + "..."; 

  const h1 = topic;
  const h2s = keywords.split(',').map(keyword => `Why ${keyword} is important`);

  return { title, metaDescription, h1, h2s };
}

export default generateSEO;