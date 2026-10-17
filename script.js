console.log("Bharat AI Loaded Successfully");

/* =========================================
   BHARAT AI — MAIN JAVASCRIPT
   Founder: Atif Rajput
   Seekho. Badho. Badlo.
========================================= */

const API_URL =
    "https://bharat-ai-api.bharataiofficial70.workers.dev/api/chat";

let chatHistory = [];
let isSending = false;

/* =========================================
   1. AI TEACHER
========================================= */

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

    const input = document.getElementById("bharatQuestion");
    if (input) input.focus();
}

function formatBharatText(text) {
    const escapeHTML = (value) =>
        value.replace(/[&<>"']/g, (char) => ({
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
        .map((line) => {
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

            return `<p>${trimmed}</p>`;
        })
        .join("");
}

function addBharatMessage(text, type, formatted = false) {
    const messages = document.getElementById("bharatMessages");
    if (!messages) return null;

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

    if (!input || !sendButton) return;

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

        if (loading) {
            loading.innerHTML = formatBharatText(data.reply);
        }

        chatHistory.push(
            { role: "user", content: question },
            { role: "assistant", content: data.reply }
        );

        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(-20);
        }
    } catch (error) {
        if (loading) {
            loading.textContent =
                "Abhi jawab nahi mil saka.\n\n" +
                error.message +
                "\n\nInternet check karke dobara koshish karein.";
        }

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

/* =========================================
   2. COURSE CONTENT
   Five courses, five lessons per course
========================================= */

const bharatLessons = {
    digital: {
        title: "Digital Skills",
        lessons: [
            {
                title: "Lesson 1: Digital Skills Introduction",
                text: `Digital skills ka matlab mobile, computer aur internet ko sahi tarah use karna hai.

Aap inse online learning, communication, banking aur kaam kar sakte hain.

Examples:
• Smartphone chalana.
• Websites kholna.
• Online forms bharna.
• Documents banana.

Practice:
Apne mobile par browser kholiye aur kisi official website ko visit kijiye.`,
                questions: [
                    {
                        q: "Digital skills ka use kisliye hota hai?",
                        options: [
                            "Digital devices aur services use karne ke liye",
                            "Sirf phone band karne ke liye",
                            "Sirf games ke liye"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 2: Internet and Browsers",
                text: `Internet duniya bhar ke computers aur devices ko connect karta hai.

Browser ek app hai jisse websites khulti hain.

Examples:
• Google Chrome.
• Mozilla Firefox.
• Microsoft Edge.

Safe browsing:
• Website ka address check karein.
• Unknown downloads se bachein.
• Official websites ko preference dein.

Practice:
Browser mein Bharat AI ki website kholne ki koshish karein.`,
                questions: [
                    {
                        q: "Website kholne ke liye kya use karte hain?",
                        options: ["Browser", "Calculator", "Torch"],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 3: Email",
                text: `Email internet ke madhyam se messages bhejne aur receive karne ka tarika hai.

Email ke important parts:
• To: receiver ka email address.
• Subject: message ka topic.
• Message: aapka likha hua text.
• Attachment: file ya photo.

Safety:
Apna password kisi ko na batayein.

Practice:
Ek draft email likhein aur uska subject rakhein: My First Email.`,
                questions: [
                    {
                        q: "Email mein Subject kya batata hai?",
                        options: [
                            "Message ka topic",
                            "Phone ki battery",
                            "Internet speed"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 4: Password Safety",
                text: `Strong password aapke online accounts ko protect karta hai.

Achhe password ke tips:
• Har account ke liye alag password rakhein.
• Password lamba aur mushkil rakhein.
• Two-step verification enable karein.
• Password public jagah par na likhein.
• OTP kisi ke saath share na karein.

Practice:
Apne important account ki security settings check karein.`,
                questions: [
                    {
                        q: "OTP kiske saath share karna chahiye?",
                        options: [
                            "Unknown caller",
                            "Kisi ke saath nahi",
                            "Social media par"
                        ],
                        answer: 1
                    }
                ]
            },
            {
                title: "Lesson 5: Digital Payments",
                text: `Digital payments se mobile ke madhyam se paise transfer kiye ja sakte hain.

Safety rules:
• Receiver ka naam check karein.
• UPI PIN sirf payment authorize karte waqt use karein.
• Paise receive karne ke liye aam taur par UPI PIN nahi chahiye.
• Unknown collect requests accept na karein.
• Fraud hone par turant bank ko inform karein.

Practice:
Payment karne se pehle receiver details verify karne ki aadat banayein.`,
                questions: [
                    {
                        q: "Payment se pehle kya check karna chahiye?",
                        options: [
                            "Receiver details",
                            "Sirf phone cover",
                            "Wallpaper"
                        ],
                        answer: 0
                    }
                ]
            }
        ]
    },

    computer: {
        title: "Computer Basics",
        lessons: [
            {
                title: "Lesson 1: Computer Introduction",
                text: `Computer ek electronic device hai jo data process karta hai.

Common uses:
• Documents banana.
• Internet chalana.
• Calculations karna.
• Online classes attend karna.

Computer ke examples:
Desktop, laptop aur tablet.

Practice:
Computer ke teen uses likhiye.`,
                questions: [
                    {
                        q: "Computer ka ek use kya hai?",
                        options: [
                            "Documents banana",
                            "Paani banana",
                            "Kapde dhona"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 2: Keyboard and Mouse",
                text: `Keyboard se letters, numbers aur commands type karte hain.

Mouse se screen par items select aur open karte hain.

Important keys:
• Enter: command ya selection confirm karta hai.
• Backspace: pichhla character delete karta hai.
• Spacebar: space deta hai.
• Shift: capital letters type karne mein help karta hai.

Practice:
Notepad ya kisi text box mein apna naam type karein.`,
                questions: [
                    {
                        q: "Typing ke liye kya use hota hai?",
                        options: ["Keyboard", "Speaker", "Camera"],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 3: Files and Folders",
                text: `File mein document, photo, video ya doosra data ho sakta hai.

Folder files ko organize karne mein help karta hai.

Tips:
• Meaningful file names rakhein.
• Zaroori documents ka backup rakhein.
• Unknown files download karne se bachein.
• Personal documents ko secure rakhein.

Practice:
Documents ke liye ek folder banane ka tarika seekhein.`,
                questions: [
                    {
                        q: "Folder ka main use kya hai?",
                        options: [
                            "Files organize karna",
                            "Screen saaf karna",
                            "Battery charge karna"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 4: Software and Apps",
                text: `Software instructions ka collection hota hai jo device par kaam karta hai.

Examples:
• Browser.
• Word processor.
• Calculator app.
• Photo editor.

Safety:
• Trusted sources se apps install karein.
• Permissions check karein.
• Updates install karein.
• Unused apps remove kar sakte hain.

Practice:
Apne phone par installed apps ki permissions review karein.`,
                questions: [
                    {
                        q: "Apps kahan se install karna behtar hai?",
                        options: [
                            "Trusted official store",
                            "Unknown links",
                            "Random messages"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 5: Computer Practice",
                text: `Computer seekhne ke liye regular practice zaroori hai.

Beginner tasks:
• Ek document type karein.
• File save karein.
• File dobara open karein.
• Browser mein website search karein.
• File ka backup banayein.

Shortcut examples:
Ctrl+C = Copy.
Ctrl+V = Paste.
Ctrl+S = Save.

Practice:
Ek chhota document banakar save karein.`,
                questions: [
                    {
                        q: "Ctrl+S ka common use kya hai?",
                        options: ["Save", "Delete", "Print"],
                        answer: 0
                    }
                ]
            }
        ]
    },

    english: {
        title: "English Learning",
        lessons: [
            {
                title: "Lesson 1: Greetings",
                text: `Daily English greetings:

Hello = Namaste.
Good morning = Suprabhat.
Good evening = Shubh sandhya.
How are you? = Aap kaise hain?
I am fine = Main theek hoon.

Example conversation:
A: Hello! How are you?
B: I am fine, thank you.

Practice:
In sentences ko zor se bolkar practice karein.`,
                questions: [
                    {
                        q: '"How are you?" ka matlab kya hai?',
                        options: [
                            "Aap kaise hain?",
                            "Aap kahan hain?",
                            "Kitne paise?"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 2: Introducing Yourself",
                text: `Apna introduction dene ke liye simple sentences use karein.

My name is Atif. = Mera naam Atif hai.
I live in India. = Main India mein rehta hoon.
I am learning English. = Main English seekh raha hoon.
Nice to meet you. = Aapse milkar achha laga.

Aap apne naam aur location ke hisaab se sentences badal sakte hain.

Practice:
English mein apna introduction likhein.`,
                questions: [
                    {
                        q: '"My name is..." ka use kisliye hota hai?',
                        options: [
                            "Naam batane ke liye",
                            "Time poochhne ke liye",
                            "Price batane ke liye"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 3: Everyday Words",
                text: `Useful English words:

Please = Kripya.
Thank you = Dhanyavaad.
Sorry = Maaf kijiye.
Welcome = Swagat hai.
Help = Madad.
Water = Paani.
Food = Khana.

Example:
Please give me water.
Kripya mujhe paani dijiye.

Practice:
Inmein se paanch words yaad karein.`,
                questions: [
                    {
                        q: '"Thank you" ka matlab kya hai?',
                        options: [
                            "Dhanyavaad",
                            "Alvida",
                            "Paani"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 4: Simple Sentences",
                text: `Simple English sentences:

I am happy. = Main khush hoon.
I am learning. = Main seekh raha hoon.
This is my book. = Yeh meri kitab hai.
I need help. = Mujhe madad chahiye.
Where are you? = Aap kahan hain?

Tip:
Roz paanch naye sentences bolne ki practice karein.

Practice:
Apne din ke baare mein teen English sentences likhein.`,
                questions: [
                    {
                        q: '"I need help" ka matlab kya hai?',
                        options: [
                            "Mujhe madad chahiye",
                            "Main ghar hoon",
                            "Mujhe neend aa rahi hai"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 5: Speaking Practice",
                text: `English speaking improve karne ke tarike:

• Roz thoda English padhein.
• Aaine ke saamne bolne ki practice karein.
• Simple sentences se shuru karein.
• Galtiyon se ghabrayein nahi.
• English audio sunein aur repeat karein.

Example:
Today I learned five new words.
Aaj maine paanch naye words seekhe.

Practice:
Apne baare mein paanch sentences bolkar record karein.`,
                questions: [
                    {
                        q: "English improve karne ke liye kya zaroori hai?",
                        options: [
                            "Regular practice",
                            "Kabhi practice na karna",
                            "Sirf mushkil words padhna"
                        ],
                        answer: 0
                    }
                ]
            }
        ]
    },

    earning: {
        title: "Online Earning Skills",
        lessons: [
            {
                title: "Lesson 1: Online Work Introduction",
                text: `Online work mein internet ki madad se services provide ki ja sakti hain.

Examples:
• Video editing.
• Graphic design.
• Content writing.
• Translation.
• Social media management.

Income skill, experience, demand aur clients par depend karti hai.

Koi bhi earning guaranteed nahi hoti.

Practice:
Apni pasand ki ek skill chunein.`,
                questions: [
                    {
                        q: "Online work ke liye kya important hai?",
                        options: [
                            "Useful skill aur practice",
                            "Guaranteed income ka wada",
                            "Bina kaam payment"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 2: Video Editing",
                text: `Video editing mein clips ko arrange karke video banaya jata hai.

Beginner skills:
• Video trim karna.
• Clips join karna.
• Captions add karna.
• Audio level adjust karna.
• Export settings samajhna.

Copyright:
Apni footage ya properly licensed media use karein.

Practice:
Apne phone par ek chhota original video edit karein.`,
                questions: [
                    {
                        q: "Video editing mein trim ka matlab kya hai?",
                        options: [
                            "Clip ka hissa cut karna",
                            "Phone charge karna",
                            "Photo print karna"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 3: Graphic Design",
                text: `Graphic design se posters, thumbnails aur social media posts banaye ja sakte hain.

Basic principles:
• Text readable rakhein.
• Colours ka sahi combination use karein.
• Design ko simple rakhein.
• Image quality achhi rakhein.
• Copyrighted logos bina permission use na karein.

Practice:
Apne channel ke liye ek original thumbnail design karein.`,
                questions: [
                    {
                        q: "Achhe design mein kya zaroori hai?",
                        options: [
                            "Readable text",
                            "Har jagah bahut text",
                            "Blurred images"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 4: Freelancing Basics",
                text: `Freelancing mein aap clients ko project-based services dete hain.

Steps:
• Ek skill seekhein.
• Apne sample projects banayein.
• Portfolio taiyar karein.
• Genuine clients ko approach karein.
• Work scope aur payment terms clear karein.

Safety:
Job ke naam par suspicious advance fees na dein.

Practice:
Apne teen sample projects ki list banayein.`,
                questions: [
                    {
                        q: "Portfolio kya hota hai?",
                        options: [
                            "Aapke kaam ke samples ka collection",
                            "Bank PIN",
                            "Password list"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 5: Finding Genuine Work",
                text: `Genuine work dhoondhne ke liye:

• Company aur client verify karein.
• Work details written form mein lein.
• Payment terms pehle samjhein.
• Kisi ko OTP ya bank PIN na dein.
• Unrealistic earning promises se bachein.
• Apna kaam time par deliver karein.

Income skill aur client demand par depend karti hai.

Practice:
Apni service ke liye ek simple introduction likhein.`,
                questions: [
                    {
                        q: "Job offer suspicious lage to kya karein?",
                        options: [
                            "Pehle verify karein",
                            "Turant paise bhejein",
                            "OTP share karein"
                        ],
                        answer: 0
                    }
                ]
            }
        ]
    },

    safety: {
        title: "Online Safety",
        lessons: [
            {
                title: "Lesson 1: Internet Safety",
                text: `Internet par personal information ko secure rakhna zaroori hai.

Rules:
• Strong password rakhein.
• Unknown links se bachein.
• Apps ki permissions check karein.
• Public devices par logout karein.
• Personal information har website par na dein.

Practice:
Apne accounts ki security settings check karein.`,
                questions: [
                    {
                        q: "Unknown link milne par kya karein?",
                        options: [
                            "Verify kiye bina open na karein",
                            "Har haal mein open karein",
                            "Sabko forward karein"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 2: OTP and Password Protection",
                text: `OTP ek one-time code hai jo account verification ya transactions mein use ho sakta hai.

Important:
• OTP kisi caller ko na batayein.
• Bank PIN confidential rakhein.
• Password reuse karne se bachein.
• Two-factor authentication enable karein.
• Suspicious login alerts ko check karein.

Practice:
Apne main email account par two-step verification check karein.`,
                questions: [
                    {
                        q: "OTP kiske saath share karna chahiye?",
                        options: [
                            "Unknown caller",
                            "Kisi ke saath nahi",
                            "Social media group"
                        ],
                        answer: 1
                    }
                ]
            },
            {
                title: "Lesson 3: Online Payment Fraud",
                text: `Online fraud mein log fake payment requests ya messages se paise chura sakte hain.

Safety:
• Receiver details verify karein.
• Unknown collect requests accept na karein.
• Paise receive karne ke liye UPI PIN enter na karein.
• Screen-sharing apps se saavdhan rahein.
• Bank alerts ko ignore na karein.

Practice:
Payment request ko approve karne se pehle details dobara check karein.`,
                questions: [
                    {
                        q: "Paise receive karne ke liye UPI PIN dena zaroori hai?",
                        options: [
                            "Haan, hamesha",
                            "Nahi",
                            "Har caller ke kehne par"
                        ],
                        answer: 1
                    }
                ]
            },
            {
                title: "Lesson 4: Social Media Safety",
                text: `Social media par apni privacy ka khayal rakhein.

• Account privacy settings review karein.
• Unknown profiles par bharosa karne se bachein.
• Live location publicly share na karein.
• Suspicious messages report karein.
• Kisi ki photo ya personal details bina permission share na karein.

Practice:
Apne social media account ki privacy settings check karein.`,
                questions: [
                    {
                        q: "Social media par kya karna chahiye?",
                        options: [
                            "Privacy settings check karna",
                            "Password sabko batana",
                            "Har link open karna"
                        ],
                        answer: 0
                    }
                ]
            },
            {
                title: "Lesson 5: Reporting Cyber Fraud",
                text: `Agar online financial fraud ho jaye:

1. Turant apne bank ya payment provider ko inform karein.
2. India ke cybercrime portal par complaint karein:
   https://cybercrime.gov.in/
3. Cyber fraud helpline 1930 par jaldi report karein.
4. Transaction IDs aur messages jaise evidence sambhal kar rakhein.
5. Passwords compromise hue hon to secure device se change karein.

Kisi unknown person ko complaint ke naam par OTP ya payment na dein.

Practice:
Official cybercrime reporting portal ko pehchanein.`,
                questions: [
                    {
                        q: "India mein cyber financial fraud report karne ki helpline kya hai?",
                        options: ["1930", "1000", "5555"],
                        answer: 0
                    }
                ]
            }
        ]
    }
};

/* =========================================
   3. OPEN FEATURES
========================================= */

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
            <p>Revision ke liye course chunein:</p>
            <button onclick="showLesson('digital')">Digital Skills Notes</button>
            <button onclick="showLesson('computer')">Computer Notes</button>
            <button onclick="showLesson('english')">English Notes</button>
            <button onclick="showLesson('earning')">Online Earning Notes</button>
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
            <p><a href="https://www.ncs.gov.in/" target="_blank" rel="noopener">National Career Service</a></p>
            <p><a href="https://www.upsc.gov.in/" target="_blank" rel="noopener">UPSC official website</a></p>
            <p>Apply karne se pehle eligibility aur official notification check karein.</p>
        `,

        schemes: `
            <h2>🏛️ Government Schemes</h2>
            <p><a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener">myScheme — Government Schemes</a></p>
            <p><a href="https://www.india.gov.in/" target="_blank" rel="noopener">National Portal of India</a></p>
            <p>Eligibility aur application rules official portal par verify karein.</p>
        `,

        farmers: `
            <h2>🌾 Farmer Resources</h2>
            <p><a href="https://pmkisan.gov.in/" target="_blank" rel="noopener">PM-KISAN</a></p>
            <p><a href="https://agmarknet.gov.in/" target="_blank" rel="noopener">Agmarknet</a></p>
            <p><a href="https://icar.org.in/" target="_blank" rel="noopener">ICAR</a></p>
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

    if (feature === "quiz") startQuiz();
    if (feature === "profile") loadProfile();

    panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function closeFeature() {
    const panel = document.getElementById("featurePanel");
    if (panel) panel.hidden = true;
}

/* =========================================
   4. FIVE LESSONS PER COURSE
========================================= */

let currentCourse = "";
let currentLessonIndex = 0;
let currentPracticeIndex = 0;
let practiceScore = 0;
let practiceAnswered = false;

function showLesson(topic) {
    if (!bharatLessons[topic]) return;

    currentCourse = topic;
    currentLessonIndex = 0;

    renderLesson();
}

function renderLesson() {
    const course = bharatLessons[currentCourse];
    const content = document.getElementById("featureContent");

    if (!course || !content) return;

    const lesson = course.lessons[currentLessonIndex];
    const completed = getCompletedLessons();
    const lessonKey = currentCourse + "_" + currentLessonIndex;
    const isComplete = completed.includes(lessonKey);

    content.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "📚 " + course.title;

    const counter = document.createElement("p");
    counter.textContent =
        "Lesson " + (currentLessonIndex + 1) +
        " of " + course.lessons.length;

    const lessonHeading = document.createElement("h3");
    lessonHeading.textContent = lesson.title;

    const notes = document.createElement("div");
    notes.style.whiteSpace = "pre-line";
    notes.style.lineHeight = "1.7";
    notes.textContent = lesson.text;

    const status = document.createElement("p");
    status.id = "lessonStatus";
    status.setAttribute("aria-live", "polite");
    status.textContent = isComplete
        ? "✅ Yeh lesson pehle complete ho chuka hai."
        : "Lesson padhne ke baad Complete Lesson dabayein.";

    const completeButton = document.createElement("button");
    completeButton.textContent = isComplete
        ? "✅ Lesson Completed"
        : "Mark Lesson Complete";

    completeButton.disabled = isComplete;

    completeButton.onclick = () => {
        markLessonComplete(currentCourse, currentLessonIndex);
        completeButton.textContent = "✅ Lesson Completed";
        completeButton.disabled = true;
        status.textContent = "Shabash! Aapne lesson complete kar liya.";
    };

    const practiceHeading = document.createElement("h3");
    practiceHeading.textContent = "📝 Practice Questions";

    const practiceButton = document.createElement("button");
    practiceButton.textContent = "Start Practice Questions";

    practiceButton.onclick = () => {
        startLessonPractice();
    };

    const practiceArea = document.createElement("div");
    practiceArea.id = "lessonPracticeArea";

    const navigation = document.createElement("div");
    navigation.style.display = "flex";
    navigation.style.gap = "8px";
    navigation.style.flexWrap = "wrap";
    navigation.style.marginTop = "16px";

    const previousButton = document.createElement("button");
    previousButton.textContent = "⬅️ Previous";
    previousButton.disabled = currentLessonIndex === 0;

    previousButton.onclick = () => {
        if (currentLessonIndex > 0) {
            currentLessonIndex--;
            renderLesson();
        }
    };

    const nextButton = document.createElement("button");

    nextButton.textContent =
        currentLessonIndex === course.lessons.length - 1
            ? "Finish Course ➜"
            : "Next Lesson ➡️";

    nextButton.onclick = () => {
        if (currentLessonIndex < course.lessons.length - 1) {
            currentLessonIndex++;
            renderLesson();
        } else {
            renderCourseComplete();
        }
    };

    const backButton = document.createElement("button");
    backButton.textContent = "← Back to Courses";
    backButton.onclick = () => openFeature("courses");

    navigation.append(previousButton, nextButton);

    content.append(
        heading,
        counter,
        lessonHeading,
        notes,
        status,
        completeButton,
        practiceHeading,
        practiceButton,
        practiceArea,
        navigation,
        backButton
    );

    document.getElementById("featurePanel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function startLessonPractice() {
    const course = bharatLessons[currentCourse];
    if (!course) return;

    currentPracticeIndex = 0;
    practiceScore = 0;
    practiceAnswered = false;

    renderLessonPractice();
}

function renderLessonPractice() {
    const course = bharatLessons[currentCourse];
    const area = document.getElementById("lessonPracticeArea");

    if (!course || !area) return;

    const questions = course.lessons[currentLessonIndex].questions;

    area.replaceChildren();

    if (currentPracticeIndex >= questions.length) {
        const result = document.createElement("p");

        result.textContent =
            "🎉 Practice complete! Score: " +
            practiceScore + " / " + questions.length;

        area.appendChild(result);

        return;
    }

    const item = questions[currentPracticeIndex];

    const question = document.createElement("p");
    question.textContent = item.q;

    const feedback = document.createElement("p");
    feedback.setAttribute("aria-live", "polite");

    area.append(question);

    item.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.style.display = "block";
        button.style.width = "100%";
        button.style.margin = "8px 0";

        button.onclick = () => {
            if (practiceAnswered) return;

            practiceAnswered = true;

            if (index === item.answer) {
                practiceScore++;
                feedback.textContent = "✅ Correct answer!";
            } else {
                feedback.textContent =
                    "❌ Correct answer: " + item.options[item.answer];
            }

            area.querySelectorAll("button").forEach((b) => {
                b.disabled = true;
            });

            const next = document.createElement("button");

            next.textContent =
                currentPracticeIndex === questions.length - 1
                    ? "See Practice Result"
                    : "Next Question ➜";

            next.onclick = () => {
                currentPracticeIndex++;
                practiceAnswered = false;
                renderLessonPractice();
            };

            area.appendChild(feedback);
            area.appendChild(next);
        };

        area.appendChild(button);
    });
}

function renderCourseComplete() {
    const content = document.getElementById("featureContent");
    if (!content) return;

    content.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "🎉 Course Finished!";

    const message = document.createElement("p");
    message.textContent =
        "Aapne " + bharatLessons[currentCourse].title +
        " ke sabhi lessons dekh liye. Apni learning continue rakhein!";

    const back = document.createElement("button");
    back.textContent = "← Back to Courses";
    back.onclick = () => openFeature("courses");

    content.append(heading, message, back);
}

/* =========================================
   5. MAIN QUIZ
========================================= */

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

    if (!area || !result || !next) return;

    result.textContent = "";
    next.hidden = true;
    area.replaceChildren();

    if (quizIndex >= quizQuestions.length) {
        const heading = document.createElement("h3");
        heading.textContent = "Quiz Complete! 🎉";

        const scoreText = document.createElement("p");
        scoreText.textContent =
            "Your score: " + quizScore +
            " / " + quizQuestions.length;

        area.append(heading, scoreText);

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
                    "❌ Correct answer: " +
                    current.options[current.answer];
            }

            area.querySelectorAll("button").forEach((item) => {
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

/* =========================================
   6. PROFILE & SAVED PROGRESS
========================================= */

function getCompletedLessons() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("bharatAICompletedLessons") || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function markLessonComplete(topic, lessonIndex) {
    try {
        const completed = getCompletedLessons();
        const key = topic + "_" + lessonIndex;

        if (!completed.includes(key)) {
            completed.push(key);

            localStorage.setItem(
                "bharatAICompletedLessons",
                JSON.stringify(completed)
            );
        }
    } catch (error) {
        console.warn("Lesson progress save nahi hua.", error);
    }
}

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
        message.textContent =
            "Profile save nahi ho saka. Browser storage check karein.";
    }
}

function loadProfile() {
    const input = document.getElementById("profileName");
    const progress = document.getElementById("profileProgress");

    try {
        if (input) {
            input.value =
                localStorage.getItem("bharatAIProfileName") || "";
        }

        const completed = getCompletedLessons();
        const score = localStorage.getItem("bharatAIQuizScore");

        const totalLessons = Object.values(bharatLessons)
            .reduce((total, course) => total + course.lessons.length, 0);

        if (progress) {
            progress.textContent =
                "Completed lessons: " + completed.length +
                " / " + totalLessons +
                (score !== null
                    ? " | Latest quiz score: " + score + "/5"
                    : "");
        }
    } catch {
        if (progress) {
            progress.textContent =
                "Saved progress abhi read nahi ho saka.";
        }
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
