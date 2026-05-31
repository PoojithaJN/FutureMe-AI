// API Base URL config (routes to port 5000 in local dev environment or file:// loads)
const API_BASE = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : '/api';

// Application state configuration
let appState = {
    userProfile: null,
    chatHistory: [],
    generatedData: null
};

// Loader messages to provide premium feedback during generation
const LOADER_MESSAGES = [
    "Opening temporal link…",
    "Aligning timeline dimensions…",
    "Analyzing identity struggle coordinates…",
    "Creating your realistic daily plan…",
    "Retrieving transmission from your future self…",
    "Securing communication channel…"
];

// --- SCROLL REVEAL LOGIC ---
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => observer.observe(el));

// --- FUTUREME ENGINE GENERATION ---
async function generateFutureMe(event) {
    event.preventDefault();
    
    const name = document.getElementById('user-name').value.trim();
    const age = document.getElementById('user-age').value.trim();
    const goal = document.getElementById('user-goal').value.trim();
    const struggle = document.getElementById('user-struggle').value.trim();
    const timeline = document.getElementById('user-timeline').value.trim();
    const availableTime = document.getElementById('user-time').value.trim();
    const tone = document.getElementById('user-tone').value;

    const errorMsg = document.getElementById('form-error');
    const form = document.getElementById('future-form');
    const loader = document.getElementById('loading-state');
    const result = document.getElementById('result-state');
    const generateBtn = document.getElementById('generate-submit-btn');

    if (!name || !age || !goal || !struggle || !timeline || !availableTime) {
        errorMsg.style.display = 'block';
        return;
    }

    errorMsg.style.display = 'none';

    // Store user profile state
    appState.userProfile = {
        name,
        age,
        goal,
        struggle,
        oneYearVision: timeline,
        availableTime,
        tone
    };

    // Transition elements to loading view
    form.style.display = 'none';
    loader.style.display = 'flex';
    generateBtn.disabled = true;

    // Shift loader messages sequentially
    let messageIdx = 0;
    const loadingStatusText = document.getElementById('loading-status-text');
    loadingStatusText.textContent = LOADER_MESSAGES[0];
    
    const loaderTimer = setInterval(() => {
        messageIdx++;
        if (messageIdx < LOADER_MESSAGES.length) {
            loadingStatusText.textContent = LOADER_MESSAGES[messageIdx];
        }
    }, 1800);

    try {
        const response = await fetch(`${API_BASE}/generate-futureme`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appState.userProfile)
        });

        let resData;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            resData = await response.json();
        } else {
            const rawText = await response.text();
            throw new Error(`Server error: ${rawText.substring(0, 100)}`);
        }

        clearInterval(loaderTimer);

        if (resData.success) {
            appState.generatedData = resData.data;
            appState.chatHistory = [];

            // Inject result data into target elements
            document.getElementById('output-letter').innerText = resData.data.message;
            document.getElementById('output-identity').innerText = resData.data.futureIdentity;
            document.getElementById('output-habit').innerText = resData.data.habit;
            document.getElementById('output-warning').innerText = resData.data.warning || "None";
            document.getElementById('output-mantra').innerText = resData.data.mantra ? `“${resData.data.mantra}”` : "Progress over perfection.";

            // Render tactical moves
            const movesUl = document.getElementById('output-moves');
            movesUl.innerHTML = "";

            if (resData.data.nextMoves && Array.isArray(resData.data.nextMoves)) {
                resData.data.nextMoves.forEach(move => {
                    const li = document.createElement('li');
                    li.innerText = move;
                    movesUl.appendChild(li);
                });
            }

            // Render realistic daily plan
            const dailyPlanBox = document.getElementById('output-daily-plan');
            dailyPlanBox.innerHTML = "";

            if (resData.data.dailyPlan && Array.isArray(resData.data.dailyPlan)) {
                resData.data.dailyPlan.forEach(item => {
                    const planCard = document.createElement('div');
                    planCard.className = 'daily-plan-card';

                    planCard.innerHTML = `
                        <div class="daily-plan-time">${item.time || ""}</div>
                        <div class="daily-plan-task">${item.task || ""}</div>
                        <div class="daily-plan-purpose">${item.purpose || ""}</div>
                        <div class="daily-plan-motivation">${item.motivation || ""}</div>
                    `;

                    dailyPlanBox.appendChild(planCard);
                });
            } else {
                dailyPlanBox.innerHTML = `
                    <div class="daily-plan-card">
                        <div class="daily-plan-task">No daily plan generated. Try again with clearer available time.</div>
                    </div>
                `;
            }

            // Reset and build the chat area
            resetChatMessages();

            // Render view states
            loader.style.display = 'none';
            result.style.display = 'block';
            generateBtn.disabled = false;

            // Show and reveal chat container
            const chatSec = document.getElementById('chat');
            chatSec.style.display = 'block';
            document.getElementById('chat-voice-desc').textContent = `Temporal link active • Voice: ${tone}`;

            setTimeout(() => {
                chatSec.classList.add('reveal', 'active');
            }, 50);

        } else {
            throw new Error(resData.error || 'Server error generating profile');
        }

    } catch (err) {
        clearInterval(loaderTimer);
        console.error('Temporal link failed:', err);
        
        showToast(err.message || 'FutureMe could not respond right now. Try again.', true);
        
        loader.style.display = 'none';
        form.style.display = 'block';
        generateBtn.disabled = false;
    }
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, isError = false) {
    const toast = isError ? document.getElementById('app-toast') : document.getElementById('share-toast');

    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
}

// Default Share Moment trigger
function triggerShare() {
    const shareText = `I just connected with my future self via FutureMe AI! Try it yourself to receive actionable advice: ${window.location.origin}`;
    
    navigator.clipboard.writeText(shareText)
        .then(() => {
            showToast("Your FutureMe moment share link is copied!");
        })
        .catch(err => {
            console.error("Copy fail:", err);
            showToast("Your FutureMe moment is ready to share.");
        });
}

// --- BUTTON INTERACTION TRIGGERS ---

// Copy full transmission package to clipboard
document.getElementById('copy-result-btn').addEventListener('click', async () => {
    if (!appState.generatedData || !appState.userProfile) return;

    const { name } = appState.userProfile;

    const {
        futureIdentity,
        message,
        nextMoves,
        habit,
        dailyPlan,
        warning,
        mantra
    } = appState.generatedData;
    
    const movesText = nextMoves && Array.isArray(nextMoves)
        ? nextMoves.map((m, idx) => `${idx + 1}. ${m}`).join('\n')
        : "No moves generated.";

    const dailyPlanText = dailyPlan && Array.isArray(dailyPlan)
        ? dailyPlan.map((p, idx) => {
            return `${idx + 1}. ${p.time || ""} - ${p.task || ""}
   Purpose: ${p.purpose || ""}
   Motivation: ${p.motivation || ""}`;
        }).join('\n\n')
        : "No daily plan generated.";

    const transmissionText = `🔮 FutureMe AI Transmission
For: ${name} (Future Identity: ${futureIdentity})
--------------------------------------------------
" ${message} "

🎯 NEXT 3 TACTICAL MOVES:
${movesText}

🌱 DAILY HABIT TO START:
${habit}

📅 DAILY PLAN YOU CAN ACTUALLY FOLLOW:
${dailyPlanText}

⚠️ WARNING FROM THE FUTURE:
${warning}

✨ DAILY MANTRA:
“${mantra}”
--------------------------------------------------
Reflect and build: FutureMe AI`;

    try {
        await navigator.clipboard.writeText(transmissionText);
        showToast("Transmission details copied to clipboard!");
    } catch (err) {
        console.error("Clipboard copy failed:", err);
        showToast("Failed to copy. Please highlight text to copy.", true);
    }
});

// Start Chat: Smooth scroll to the chat area
document.getElementById('start-chat-btn').addEventListener('click', () => {
    const chatSec = document.getElementById('chat');
    chatSec.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('chat-input-text').focus();
});

// Re-Reflect: Reset back to form state
document.getElementById('rereflect-btn').addEventListener('click', () => {
    document.getElementById('result-state').style.display = 'none';
    document.getElementById('chat').style.display = 'none';
    document.getElementById('future-form').style.display = 'block';
});

// --- CHAT INTERACTION CONTROLLER ---

function resetChatMessages() {
    const name = appState.userProfile ? appState.userProfile.name : "Alex";
    const availableTime = appState.userProfile ? appState.userProfile.availableTime : "your available time";

    const chatMessagesContainer = document.getElementById('chat-messages');

    chatMessagesContainer.innerHTML = `
        <div class="chat-bubble bubble-future">
            <span class="chat-label">FutureMe</span>
            I am here, ${name}. The temporal link is secure. Ask me anything about your hurdles, decisions, daily plan, or how to use your ${availableTime} effectively.
        </div>
    `;
}

function appendChatBubble(role, message) {
    const container = document.getElementById('chat-messages');
    
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role === 'user' ? 'bubble-user' : 'bubble-future'}`;
    
    const label = document.createElement('span');
    label.className = 'chat-label';
    label.textContent = role === 'user' ? 'You' : 'FutureMe';
    
    bubble.appendChild(label);
    
    const textNode = document.createTextNode(message);
    bubble.appendChild(textNode);
    
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

document.getElementById('chat-send-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const inputField = document.getElementById('chat-input-text');
    const question = inputField.value.trim();

    if (!question || !appState.userProfile) return;
    
    appendChatBubble('user', question);
    inputField.value = '';
    
    const typingIndicator = document.getElementById('chat-typing-indicator');
    typingIndicator.style.display = 'flex';
    
    const container = document.getElementById('chat-messages');
    container.scrollTop = container.scrollHeight;

    const historicalPayload = [...appState.chatHistory];

    try {
        const response = await fetch(`${API_BASE}/chat-futureme`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userProfile: appState.userProfile,
                chatHistory: historicalPayload,
                question: question
            })
        });

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const rawText = await response.text();
            throw new Error(`Server error: ${rawText.substring(0, 100)}`);
        }

        typingIndicator.style.display = 'none';

        if (data.success) {
            appendChatBubble('futureme', data.reply);
            
            appState.chatHistory.push({ role: 'user', message: question });
            appState.chatHistory.push({ role: 'futureme', message: data.reply });
        } else {
            throw new Error(data.error || 'Chat timeline connection failed');
        }

    } catch (err) {
        typingIndicator.style.display = 'none';
        console.error('Chat routing error:', err);
        showToast("Connection to your future self was interrupted.", true);
        
        appendChatBubble('futureme', `Connection error: ${err.message || 'General failure'}. Please double check your backend server status.`);
    }
});