console.log("Bharat AI Loaded Successfully");

const API_URL =
    "https://bharat-ai-api.bharataiofficial70.workers.dev/api/chat";

let chatHistory = [];
let isSending = false;

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
                <button id="closeBharatChat"
                    type="button"
                    aria-label="Close chat">✕</button>
            </div>

            <div id="bharatMessages" class="bharat-messages"
                 aria-live="polite">
                <div class="bharat-message ai-message">
                    <strong>Namaste! 👋</strong>
                    <br><br>
                    Main Bharat AI Teacher hoon.
                    <br>
                    Aaj aap kya seekhna chahte hain?
                </div>
            </div>

            <form id="bharatChatForm" class="bharat-chat-form">
                <textarea id="bharatQuestion"
                    placeholder="Apna sawal likhein..."
                    rows="1"
                    aria-label="Apna sawal likhein"
                    required></textarea>
                <button id="bharatSend" type="submit">
                    Send ➤
                </button>
            </form>

            <div class="bharat-chat-note">
                Bharat AI • Seekho. Badho. Badlo.
            </div>
        `;

        document.body.appendChild(chatBox);

        document.getElementById("closeBharatChat").onclick = () => {
            chatBox.style.display = "none";
        };

        document.getElementById("bharatChatForm").addEventListener(
            "submit",
            sendBharatMessage
        );

        document.getElementById("bharatQuestion").addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.isComposing
                ) {
                    event.preventDefault();

                    document.getElementById(
                        "bharatChatForm"
                    ).requestSubmit();
                }
            }
        );
    }

    chatBox.style.display = "flex";
    document.getElementById("bharatQuestion").focus();
}

function formatBharatText(text) {
    // Escape HTML before applying safe formatting.
    const escapeHTML = (value) =>
        value.replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);

    let safe = escapeHTML(String(text ?? ""));

    // Bold text: **example**
    safe = safe.replace(
        /\*\*(.+?)\*\*/g,
        "<strong>$1</strong>"
    );

    // Inline code: `example`
    safe = safe.replace(
        /`([^`]+)`/g,
        "<code>$1</code>"
    );

    const lines = safe.split("\n");
    const output = [];
    let listType = null;

    function closeList() {
        if (listType) {
            output.push(listType === "ol" ? "</ol>" : "</ul>");
            listType = null;
        }
    }

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
            closeList();
            continue;
        }

        // Markdown headings
        const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);

        if (heading) {
            closeList();

            const level = heading[1].length;
            output.push(
                `<h${level}>${heading[2]}</h${level}>`
            );
            continue;
        }

        // Numbered lists
        const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);

        if (numbered) {
            if (listType !== "ol") {
                closeList();
                output.push("<ol>");
                listType = "ol";
            }

            output.push(`<li>${numbered[1]}</li>`);
            continue;
        }

        // Bullet lists
        const bullet = trimmed.match(/^[-*•]\s+(.+)$/);

        if (bullet) {
            if (listType !== "ul") {
                closeList();
                output.push("<ul>");
                listType = "ul";
            }

            output.push(`<li>${bullet[1]}</li>`);
            continue;
        }

        closeList();
        output.push(`<p>${trimmed}</p>`);
    }

    closeList();

    return output.join("");
}

function addBharatMessage(text, type, formatted = false) {
    const messages = document.getElementById("bharatMessages");
    const message = document.createElement("div");

    message.className =
        "bharat-message " +
        (type === "user" ? "user-message" : "ai-message");

    if (formatted && type !== "user") {
        message.innerHTML = formatBharatText(text);
    } else {
        message.textContent = text;
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    return message;
}

async function sendBharatMessage(event) {
    event.preventDefault();

    if (isSending) return;

    const input = document.getElementById("bharatQuestion");
    const sendButton = document.getElementById("bharatSend");
    const question = input.value.trim();

    if (!question) return;

    isSending = true;

    addBharatMessage(question, "user");

    input.value = "";
    input.disabled = true;
    sendButton.disabled = true;
    sendButton.textContent = "Wait...";

    const loading = addBharatMessage(
        "Bharat AI soch raha hai... ⏳",
        "ai"
    );

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: question,
                history: chatHistory
            })
        });

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error("Server se sahi response nahi mila.");
        }

        if (!response.ok || !data.reply) {
            throw new Error(
                data.details ||
                data.error ||
                "AI se jawab nahi mila."
            );
        }

        loading.innerHTML = formatBharatText(data.reply);

        chatHistory.push(
            { role: "user", content: question },
            { role: "assistant", content: data.reply }
        );

        // Keep recent history within reasonable limits.
        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(-20);
        }

    } catch (error) {
        loading.textContent =
            "Maaf kijiye, abhi jawab nahi mil saka.\n\n" +
            error.message +
            "\n\nInternet check karke dobara koshish karein.";

        console.error("Bharat AI error:", error);

    } finally {
        isSending = false;
        input.disabled = false;
        sendButton.disabled = false;
        sendButton.textContent = "Send ➤";
        input.focus();

        const messages = document.getElementById("bharatMessages");

        if (messages) {
            messages.scrollTop = messages.scrollHeight;
        }
    }
}
