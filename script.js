console.log("Bharat AI Loaded Successfully");

// Existing Cloudflare Worker API
const API_URL =
    "https://bharat-ai-api.bharataiofficial70.workers.dev/api/chat";

let chatHistory = [];
let isSending = false;

/* =========================
   1. AI TEACHER
========================= */

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
                <button id="closeBharatChat" type="button">✕</button>
            </div>

            <div id="bharatMessages" class="bharat-messages"
                 aria-live="polite">
                <div class="bharat-message ai-message">
                    <strong>Hello! 👋</strong>
                    <p>Main Bharat AI Teacher hoon.</p>
                    <p>Aap Hindi ya English mein sawal pooch sakte hain.</p>
                </div>
            </div>

            <form id="bharatChatForm" class="bharat-chat-form">
                <textarea id="bharatQuestion"
                    placeholder="Apna sawal likhein..."
                    rows="2" required></textarea>
                <button id="bharatSend" type="submit">Send ➤</button>
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
                if (event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.isComposing) {
                    event.preventDefault();
                    document.getElementById("bharatChatForm").requestSubmit();
                }
            }
        );
    }

    chatBox.style.display = "flex";
    document.getElementById("bharatQuestion").focus();
}

function formatBharatText(text) {
    const escapeHTML = (value) =>
        value.replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);

    let safe = escapeHTML(String(text ?? ""));

    safe = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    safe = safe.replace(/`([^`]+)`/g, "<code>$1</code>");

    return safe
        .split("\n")
        .map(line => {
            const trimmed = line.trim();

            if (!trimmed) return "";
            if (/^### /.test(trimmed)) {
                return `<h3>${trimmed.slice(4)}</h3>`;
            }
            if (/^## /.test(trimmed)) {
                return `<h2>${trimmed.slice(3)}</h2>`;
            }
            if (/^# /.test(trimmed)) {
                return `<h1>${trimmed.slice(2)}</h1>`;
            }
            if (/^[-*•] /.test(trimmed)) {
                return `<p>• ${trimmed.slice(2)}</p>`;
            }
            if (/^\d+[.)] /.test(trimmed)) {
                return `<p>${trimmed}</p>`;
            }

            return `<p>${trimmed}</p>`;
        })
        .join("");
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

        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(-20);
        }
    } catch (error) {
        loading.textContent =
            "Abhi jawab nahi mil saka.\n\n" +
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
        if (messages) messages.scrollTop = messages.scrollHeight;
    }
}

/* =========================
   2. COURSES, NOTES & FEATURES
========================= */

function openFeature(feature) {
    const panel = document.getElementById("featurePanel");
    const content = document.getElementById("featureContent");

    if (!panel || !content) {
        alert("Feature panel nahi mila. index.html check karein.");
        return;
    }

    const pages = {
        courses: `
            <h2>📚 Free Courses</h2>
            <p>Apni pasand ka course chunein:</p>
            <button onclick="showLesson('digital')">Digital Skills</button>
            <button onclick="showLesson('computer')">Computer Basics</button>
            <button onclick="showLesson('english')">English Learning</button>
            <button onclick="showLesson('earning')">Online Earning Skills</button>
            <button onclick="showLesson('safety')">Online Safety</button>
        `,

        notes: `
            <h2>📝 Learning Notes</h2>
            <p>Revision ke liye topic chunein:</p>
            <button onclick="showLesson('digital')">Digital Skills Notes</button>
            <button onclick="showLesson('computer')">Computer Notes</button>
            <button onclick="showLesson('english')">English Notes</button>
            <button onclick="showLesson('safety')">Online Safety Notes</button>
        `,

        quiz: `
            <h2>🎯 Bharat AI Quiz</h2>
            <div id="quizArea"></div>
            <p id="quizResult" aria-live="polite"></p>
            <button id="nextQuiz" onclick="nextQuizQuestion()" hidden>
                Next Question ➜
            </button>
        `,

        jobs: `
            <h2>💼 Jobs & Careers</h2>
            <p>Official career and job resources:</p>
            <p><a href="https://www.ncs.gov.in/" target="_blank" rel="noopener">National Career Service</a></p>
            <p><a href="https://www.upsc.gov.in/" target="_blank" rel="noopener">UPSC official website</a></p>
            <p>Apply only after checking eligibility, deadlines and official notifications.</p>
        `,

        schemes: `
            <h2>🏛️ Government Schemes</h2>
            <p><a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener">myScheme — Find government schemes</a></p>
            <p><a href="https://www.india.gov.in/" target="_blank" rel="noopener">National Portal of India</a></p>
            <p>Check official eligibility and application conditions before applying.</p>
        `,

        farmers: `
            <h2>🌾 Farmer Resources</h2>
            <p><a href="https://pmkisan.gov.in/" target="_blank" rel="noopener">PM-KISAN official website</a></p>
            <p><a href="https://agmarknet.gov.in/" target="_blank" rel="noopener">Agmarknet — Agricultural market information</a></p>
            <p><a href="https://icar.org.in/" target="_blank" rel="noopener">Indian Council of Agricultural Research</a></p>
            <p>Verify current scheme rules and market information on official portals.</p>
        `,

        profile: `
            <h2>👤 My Learning Profile</h2>
            <p>Welcome to Bharat AI!</p>
            <label for="profileName">Your name:</label>
            <input id="profileName" type="text" maxlength="60"
                   placeholder="Apna naam likhein">
            <button onclick="saveProfile()">Save Profile</button>
            <p id="profileMessage" aria-live="polite"></p>
            <p id="profileProgress"></p>
            <button onclick="resetProgress()">Reset Learning Progress</button>
            <p>Founder: Atif Rajput</p>
        `
    };

    if (!pages[feature]) {
        content.textContent = "Yeh feature abhi available nahi hai.";
    } else {
        content.innerHTML = pages[feature];
    }

    panel.hidden = false;

    if (feature === "quiz") {
        startQuiz();
    }

    if (feature === "profile") {
        loadProfile();
    }

    panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeFeature() {
    const panel = document.getElementById("featurePanel");
    if (panel) panel.hidden = true;
}

/* =========================
   3. LESSONS
========================= */

const bharatLessons = {
    digital: {
        title: "Digital Skills",
        text: `Digital skills seekhein:
• Internet ko sahi tarah use karein.
• Email banana aur bhejna seekhein.
• Strong password aur two-step verification use karein.
• Online payment se pehle receiver ka naam check karein.
• OTP aur password kisi ke saath share na karein.`
    },

    computer: {
        title: "Computer Basics",
        text: `Computer basics:
• Keyboard ka use typing ke liye hota hai.
• Mouse se items select aur open karte hain.
• Files mein documents aur photos hote hain.
• Browser se websites kholte hain.
• Apni files ka backup rakhein.`
    },

    english: {
        title: "English Learning",
        text: `Everyday English:
• Hello = Namaste
• Thank you = Dhanyavaad
• Please = Kripya
• How are you? = Aap kaise hain?
• I am fine = Main theek hoon.
• What is your name? = Aapka naam kya hai?`
    },

    earning: {
        title: "Online Earning Skills",
        text: `Ghar se kaam ke liye skills:
• Short video editing
• Graphic design
• Content writing
• Social media management
• Portfolio banakar genuine clients ko apna kaam dikhayein.
Koi bhi guaranteed income ka wada kare ya pehle paise maange, to saavdhan rahein.`
    },

    safety: {
        title: "Online Safety",
        text: `Internet safety:
• OTP, password aur bank PIN share na karein.
• Unknown links par click karne se bachein.
• Kisi bhi job ke liye paise dene se pehle verify karein.
• Suspicious payment request ko dobara check karein.
• Fraud ho jaaye to India cybercrime portal https://cybercrime.gov.in/ par report karein.`
    }
};

function showLesson(topic) {
    const lesson = bharatLessons[topic];
    const content = document.getElementById("featureContent");

    if (!lesson || !content) return;

    content.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = lesson.title;

    const paragraph = document.createElement("p");
    paragraph.style.whiteSpace = "pre-line";
    paragraph.textContent = lesson.text;

    const backButton = document.createElement("button");
    backButton.textContent = "← Back to Courses";
    backButton.onclick = () => openFeature("courses");

    content.append(heading, paragraph, backButton);

    markLessonComplete(topic);

    document.getElementById("featurePanel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================
   4. QUIZ — FIVE QUESTIONS
========================= */

const quizQuestions = [
    {
        question: "1. CPU ka full form kya hai?",
        options: [
            "Central Processing Unit",
            "Central Program Unit",
            "Computer Personal Unit"
        ],
        answer: 0
    },
    {
        question: "2. Internet par password kaisa hona chahiye?",
        options: [
            "123456",
            "Strong aur unique",
            "Apna naam"
        ],
        answer: 1
    },
    {
        question: "3. OTP kiske saath share karna chahiye?",
        options: [
            "Har caller ke saath",
            "Unknown person ke saath",
            "Kisi ke saath nahi"
        ],
        answer: 2
    },
    {
        question: "4. Email ka use kisliye hota hai?",
        options: [
            "Electronic messages bhejne ke liye",
            "Sirf games ke liye",
            "Sirf photos edit karne ke liye"
        ],
        answer: 0
    },
    {
        question: "5. Online job ke liye guaranteed income ka wada ho to?",
        options: [
            "Bina check kiye paise dein",
            "Pehle verify karein",
            "Apna OTP bhej dein"
        ],
        answer: 1
    }
];

let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function startQuiz() {
    quizIndex = 0;
    quizScore = 0;
    quizAnswered = false;
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const area = document.getElementById("quizArea");
    const result = document.getElementById("quizResult");
    const next = document.getElementById("nextQuiz");

    if (!area) return;

    result.textContent = "";
    next.hidden = true;
    area.replaceChildren();

    if (quizIndex >= quizQuestions.length) {
        area.innerHTML =
            `<h3>Quiz Complete! 🎉</h3>
             <p>Your score: ${quizScore} / ${quizQuestions.length}</p>`;

        next.textContent = "Play Again ↻";
        next.hidden = false;
        next.onclick = startQuiz;

        saveQuizScore(quizScore);
        return;
    }

    const current = quizQuestions[quizIndex];

    const heading = document.createElement("h3");
    heading.textContent = current.question;
    area.appendChild(heading);

    current.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.style.display = "block";
        button.style.width = "100%";
        button.style.margin = "10px 0";

        button.onclick = () => {
            if (quizAnswered) return;

            quizAnswered = true;

            if (index === current.answer) {
                quizScore++;
                result.textContent = "✅ Correct!";
            } else {
                result.textContent =
                    "❌ Correct answer: " + current.options[current.answer];
            }

            area.querySelectorAll("button").forEach(item => {
                item.disabled = true;
            });

            next.textContent =
                quizIndex === quizQuestions.length - 1
                    ? "See Result ➜"
                    : "Next Question ➜";

            next.hidden = false;
            next.onclick = nextQuizQuestion;
        };

        area.appendChild(button);
    });
}

function nextQuizQuestion() {
    if (quizIndex >= quizQuestions.length) {
        startQuiz();
        return;
    }

    if (!quizAnswered) return;

    quizIndex++;
    quizAnswered = false;
    renderQuizQuestion();
}

/* =========================
   5. PROFILE & SAVED PROGRESS
========================= */

function saveProfile() {
    const input = document.getElementById("profileName");
    const message = document.getElementById("profileMessage");

    if (!input || !message) return;

    const name = input.value.trim();

    if (!name) {
        message.textContent = "Pehle apna naam likhein.";
        return;
    }

    try {
        localStorage.setItem("bharatAIProfileName", name);
        message.textContent = "✅ Profile saved on this device.";
    } catch {
        message.textContent = "Profile save nahi ho saka. Browser storage check karein.";
    }
}

function loadProfile() {
    const input = document.getElementById("profileName");
    const progress = document.getElementById("profileProgress");

    try {
        if (input) {
            input.value = localStorage.getItem("bharatAIProfileName") || "";
        }

        const completed = JSON.parse(
            localStorage.getItem("bharatAICompletedLessons") || "[]"
        );

        const score = localStorage.getItem("bharatAIQuizScore");

        if (progress) {
            progress.textContent =
                "Completed lessons: " + completed.length +
                (score !== null ? " | Latest quiz score: " + score + "/5" : "");
        }
    } catch {
        if (progress) {
            progress.textContent = "Saved progress abhi read nahi ho saka.";
        }
    }
}

function markLessonComplete(topic) {
    try {
        const completed = JSON.parse(
            localStorage.getItem("bharatAICompletedLessons") || "[]"
        );

        if (!completed.includes(topic)) {
            completed.push(topic);
            localStorage.setItem(
                "bharatAICompletedLessons",
                JSON.stringify(completed)
            );
        }
    } catch (error) {
        console.warn("Lesson progress save nahi hua.", error);
    }
}

function saveQuizScore(score) {
    try {
        localStorage.setItem("bharatAIQuizScore", String(score));
    } catch (error) {
        console.warn("Quiz score save nahi hua.", error);
    }
}

function resetProgress() {
    const confirmed = confirm(
        "Kya aap apni saved learning progress reset karna chahte hain?"
    );

    if (!confirmed) return;

    try {
        localStorage.removeItem("bharatAICompletedLessons");
        localStorage.removeItem("bharatAIQuizScore");
        loadProfile();
        alert("Learning progress reset ho gayi.");
    } catch {
        alert("Progress reset nahi ho saki.");
    }
}
