async function callGeminiDirectly(userMessage, apiKey) {
    const modelName = "gemini-pro"; // or other model versions
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: userMessage
            }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`API call failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;
        return generatedText;
    } catch (error) {
        console.error('Fetch error:', error);
        return `Error: ${error.message}`;
    }
}

const API_KEY = 'YOUR_API_KEY'; // Replace with your Gemini API key
const chatDiv = document.getElementById('chat');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function appendMessage(text, className) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${className}`;
    messageEl.textContent = text;
    chatDiv.appendChild(messageEl);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    appendMessage(`User: ${message}`, 'user');
    userInput.value = '';
    const reply = await callGeminiDirectly(message, API_KEY);
    appendMessage(`Bot: ${reply}`, 'bot');
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
