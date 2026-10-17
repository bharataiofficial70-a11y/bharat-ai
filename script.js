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
// Bharat AI - Feature Pages

function openFeature(feature) {
    const panel = document.getElementById("featurePanel");
    const content = document.getElementById("featureContent");

    const pages = {
        courses: `
            <h2>📚 Free Courses</h2>
            <p>Choose a skill to start learning.</p>
            <ul>
                <li><button onclick="showLesson('digital')">Digital Skills</button></li>
                <li><button onclick="showLesson('computer')">Computer Basics</button></li>
                <li><button onclick="showLesson('english')">English Learning</button></li>
                <li><button onclick="showLesson('earning')">Online Earning Skills</button></li>
            </ul>
        `,

        notes: `
            <h2>📝 Learning Notes</h2>
            <p>Choose a topic to explore.</p>
            <button onclick="showLesson('digital')">Digital Skills Notes</button>
            <button onclick="showLesson('computer')">Computer Notes</button>
            <button onclick="showLesson('english')">English Notes</button>
        `,

        quiz: `
            <h2>🎯 Bharat AI Quiz</h2>
            <p>What does CPU stand for?</p>
            <button onclick="checkQuiz(this, false)">Central Program Unit</button>
            <button onclick="checkQuiz(this, true)">Central Processing Unit</button>
            <button onclick="checkQuiz(this, false)">Computer Personal Unit</button>
            <p id="quizResult" aria-live="polite"></p>
        `,

        jobs: `
            <h2>💼 Jobs & Careers</h2>
            <p>Official job information and opportunities:</p>
            <p><a href="https://www.ncs.gov.in/" target="_blank" rel="noopener">National Career Service — Government of India</a></p>
            <p>Check eligibility and details on the official website before applying.</p>
        `,

        schemes: `
            <h2>🏛️ Government Schemes</h2>
            <p>Explore official government information:</p>
            <p><a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener">myScheme — Government Scheme Finder</a></p>
            <p>Eligibility and benefits depend on the scheme.</p>
        `,

        farmers: `
            <h2>🌾 Farmer Resources</h2>
            <p>Useful official resources for farmers:</p>
            <p><a href="https://pmkisan.gov.in/" target="_blank" rel="noopener">PM-KISAN official website</a></p>
            <p><a href="https://agmarknet.gov.in/" target="_blank" rel="noopener">Agmarknet — Agricultural market information</a></p>
            <p>Check current rules and updates on the official portals.</p>
        `,

        profile: `
            <h2>👤 My Learning Profile</h2>
            <p>Welcome to Bharat AI!</p>
            <p>Your learning journey starts here.</p>
            <p>Founder: Atif Rajput</p>
            <p>Profile saving and login will be added in a future update.</p>
        `
    };

    if (!pages[feature]) {
        content.textContent = "This feature is not available yet.";
        panel.hidden = false;
        panel.scrollIntoView({ behavior: "smooth" });
        return;
    }

    content.innerHTML = pages[feature];
    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeFeature() {
    document.getElementById("featurePanel").hidden = true;
}

function showLesson(topic) {
    const lessons = {
        digital: {
            title: "Digital Skills",
            text: "Learn to use the internet safely, create email accounts, identify online scams and use digital services."
        },
        computer: {
            title: "Computer Basics",
            text: "Learn about the keyboard, mouse, files, folders, browsers and basic computer operations."
        },
        english: {
            title: "English Learning",
            text: "Start with everyday greetings: Hello means Namaste. Thank you means Dhanyavaad. How are you? means Aap kaise hain?"
        },
        earning: {
            title: "Online Earning Skills",
            text: "Learn video editing, graphic design, writing and social media management. Start by practising, build a portfolio and apply for genuine work. Never pay someone who promises guaranteed income."
        }
    };

    const lesson = lessons[topic];
    if (!lesson) return;

    const content = document.getElementById("featureContent");

    content.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = lesson.title;

    const paragraph = document.createElement("p");
    paragraph.textContent = lesson.text;

    const backButton = document.createElement("button");
    backButton.textContent = "← Back to Courses";
    backButton.onclick = () => openFeature("courses");

    content.append(heading, paragraph, backButton);
    document.getElementById("featurePanel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function checkQuiz(button, correct) {
    const result = document.getElementById("quizResult");

    if (correct) {
        result.textContent = "✅ Correct! CPU means Central Processing Unit.";
    } else {
        result.textContent = "❌ Not quite. Try again!";
    }
}
