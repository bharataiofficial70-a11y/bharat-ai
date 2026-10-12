console.log("Bharat AI Loaded Successfully");console.log("Bharat AI Loaded Successfully");

// Bharat AI Welcome Message
function startLearning() {
  alert("🇮🇳 Welcome to Bharat AI!\n\nSeekho. Badho. Badlo.\n\nYour learning journey starts now!");
}

// AI Teacher Demo
function openAITeacher() {
  const question = prompt("🤖 Bharat AI Teacher\n\nApna sawal likho:");

  if (question && question.trim() !== "") {
    alert(
      "Aapka sawal mil gaya!\n\nSawal: " +
      question +
      "\n\nAI Teacher ko jodne ka agla step abhi baaki hai."
    );
  }
}
