console.log("Bharat AI Loaded Successfully");

const API_URL = "https://bharat-ai-api.bharataiofficial70.workers.dev/api/chat";

function startLearning() {
    alert("Welcome to Bharat AI! Seekho. Badho. Badlo.");
}

async function openAITeacher() {
    const question = prompt("Bharat AI Teacher: Apna sawal likho");

    if (!question || !question.trim()) return;

    alert("Bharat AI jawab taiyar kar raha hai...");

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
            alert("AI Error: " + (data.error || "Jawab nahi mila."));
            return;
        }

        alert("Bharat AI:\n\n" + data.reply);

    } catch (error) {
        alert("Connection error! Internet aur API check karo.");
        console.error(error);
    }
}
