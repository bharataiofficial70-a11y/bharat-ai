console.log("Bharat AI Loaded Successfully");

const API_URL = "https://bharat-ai-api.bharataiofficial70.workers.dev/api/chat";

let chatHistory = [];

function startLearning() {
    openAITeacher();
}

function openAITeacher() {
    let chatBox = document.getElementById("bharatChatBox");

    if (!chatBox) {
        chatBox = document.createElement("div");
        chatBox.id = "bharatChatBox";

        chatBox.innerHTML = `
            <div class="bharat-chat-header">
                <div>
                    <h2>🇮🇳 Bharat AI</h2>
                    <p>Seekho. Badho. Badlo.</p>
                </div>
                <button id="closeBharatChat" aria-label="Close chat">✕</button>
            </div>

            <div id="bharatMessages" class="bharat-messages">
                <div class="bharat-message ai-message">
                    Namaste! 👋 Main Bharat AI Teacher hoon.
                    <br><br>
                    Aaj aap kya seekhna chahte hain?
                </div>
            </div>

            <form id="bharatChatForm" class="bharat-chat-form">
                <textarea id="bharatQuestion"
                    placeholder="Apna sawal likhein..."
                    rows="1"
                    aria-label="Apna sawal likhein"></textarea>
                <button id="bharatSend" type="submit">Send ➤</button>
            </form>
            <div class="bharat-chat-note">
                Bharat AI • AI ke jawab galat bhi ho sakte hain.
            </div>
        `;

        document.body.appendChild(chatBox);

        document.getElementById("closeBharatChat").onclick = () => {
            chatBox.remove();
        };

        document.getElementById("bharatChatForm").addEventListener(
            "submit",
            sendBharatMessage
        );

        document.getElementById("bharatQuestion").addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    document.getElementById("bharatChatForm").requestSubmit();
                }
            }
        );
    }

    chatBox.style.display = "flex";
    document.getElementById("bharatQuestion").focus();
}

function addBharatMessage(text, type) {
    const messages = document.getElementById("bharatMessages");
    const message = document.createElement("div");

    message.className = "bharat-message " +
        (type === "user" ? "user-message" : "ai-message");

    // Display plain text safely; do not interpret AI output as HTML.
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    return message;
}

async function sendBharatMessage(event) {
    event.preventDefault();

    const input = document.getElementById("bharatQuestion");
    const sendButton = document.getElementById("bharatSend");
    const question = input.value.trim();

    if (!question) return;

    addBharatMessage(question, "user");
    input.value = "";
    input.disabled = true;
    sendButton.disabled = true;
    sendButton.textContent = "Wait...";

    const loading = addBharatMessage("Bharat AI soch raha hai... ⏳", "ai");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: question
            })
        });

        const data = await response.json();

        if (!response.ok || !data.reply) {
            throw new Error(
                data.details || data.error || "AI se jawab nahi mila."
            );
        }

        loading.textContent = data.reply;
        chatHistory.push(
            { role: "user", content: question },
            { role: "assistant", content: data.reply }
        );

    } catch (error) {
        loading.textContent = "Maaf kijiye, abhi jawab nahi mil saka.\n" +
            error.message +
            "\n\nKuch der baad dobara koshish karein.";

        console.error("Bharat AI error:", error);

    } finally {
        input.disabled = false;
        sendButton.disabled = false;
        sendButton.textContent = "Send ➤";
        input.focus();

        const messages = document.getElementById("bharatMessages");
        messages.scrollTop = messages.scrollHeight;
    }
}
