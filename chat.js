async function callGeminiDirectly(userMessage, apiKey) {
    const modelName = "gemini-pro"; // 또는 gemini-1.5-flash 등
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: userMessage
            }]
        }],
        // 여기에 generationConfig, safetySettings 등 추가 옵션 포함 가능
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            // 오류 응답 처리
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`API call failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        // 응답에서 텍스트 추출 (Gemini 응답 구조에 따라 달라질 수 있음)
        const generatedText = data.candidates[0].content.parts[0].text;
        return generatedText;

    } catch (error) {
        console.error('Fetch error:', error);
        return `오류가 발생했습니다: ${error.message}`;
    }
}

// 주의: 실제 애플리케이션에서는 API 키를 클라이언트 코드에 직접 노출하지 마세요!
const MY_GEMINI_API_KEY = 'YOUR_API_KEY'; // 여기에 발급받은 API 키를 넣으세요
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
    const reply = await callGeminiDirectly(message, MY_GEMINI_API_KEY);
    appendMessage(`Bot: ${reply}`, 'bot');
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
