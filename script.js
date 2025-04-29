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

    // Prepare the prompt for GPT-4
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
            role: 'user',
            content: prompt
          }
        ]
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
