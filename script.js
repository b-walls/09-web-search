// Get references to DOM elements
const topicSelect = document.getElementById('topicSelect');
const responseDiv = document.getElementById('response');

// Add change event listener to the select
topicSelect.addEventListener('change', async () => {
  try {
    // Show loading state
    responseDiv.textContent = 'Loading...';
    
    // Get the selected topic
    const topic = topicSelect.value;

    // Prepare the prompt
    const prompt = `Give me a recent story about ${topic}.`;

    // Make API request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-search-preview',
        // tools: [{type: "web_search_preview"}],
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes recent stories about the provided topic from this week. Keep your answers brief, clear, and engaging for a general audience.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    // Parse the response
    const data = await response.json();
    
    // Format and update the UI with the response
    const text = data.choices[0].message.content;
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .split('\n\n')  // Split into paragraphs
      .filter(para => para.trim() !== '')  // Remove empty paragraphs
      .map(para => `<p>${para}</p>`)  // Wrap in p tags
      .join('');
    
    responseDiv.innerHTML = formattedText;

  } catch (error) {
    // Handle any errors
    responseDiv.textContent = 'Sorry, there was an error getting the update. Please try again.';
    console.error('Error:', error);
  }
});
