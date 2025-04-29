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
    const prompt = `Give me a positive, recent story about ${topic} from this week. 
                   Keep it brief and engaging, focusing on the main points.`;

    // Make API request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes positive, recent news stories about the selected topic from this week. Keep your answers brief, clear, and engaging for a general audience.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 300,
        temperature: 0.7
      })
    });

    // Parse the response
    const data = await response.json();
    
    // Update the UI with the response
    const story = data.choices[0].message.content;
    const newMessage = document.createElement('div');
    newMessage.className = 'message bot-message';
    newMessage.textContent = story;
    responseDiv.parentElement.appendChild(newMessage);
    newMessage.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    // Handle any errors
    responseDiv.textContent = 'Sorry, there was an error getting the update. Please try again.';
    console.error('Error:', error);
  }
});
