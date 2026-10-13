console.log("Bharat AI Loaded Successfully");

// Bharat AI Welcome Message
function startLearning() {
  alert(
    "🇮🇳 Welcome to Bharat AI!\n\n" +
    "Seekho. Badho. Badlo.\n\n" +
    "Your learning journey starts now!"
  );
}

// Bharat AI Teacher
function openAITeacher() {
  const question = prompt(
    "🤖 Bharat AI Teacher\n\nApna sawal likho:"
  );

  if (!question || !question.trim()) {
    return;
  }

  const q = question.toLowerCase().trim();
  let answer;

  if (
    q.includes("artificial intelligence") ||
    q.includes("ai kya hai") ||
    q.includes("एआई क्या है")
  ) {
    answer =
      "Artificial Intelligence (AI) ek technology hai jo computers ko sawalon ke jawab dene aur kaam karne mein madad karti hai.";
  } else if (
    q.includes("photosynthesis") ||
    q.includes("prakash sanshleshan") ||
    q.includes("प्रकाश संश्लेषण")
  ) {
    answer =
      "Photosynthesis mein paudhe sunlight, paani aur carbon dioxide ki madad se apna bhojan banate hain.";
  } else if (
    q.includes("bharat ai") ||
    q.includes("भारत एआई")
  ) {
    answer =
      "Bharat AI ka lakshya sabhi ko education, useful skills aur jaankari tak pahunch dena hai.";
  } else {
    answer =
      "Aapka sawal: " + question +
      "\n\nIs demo mein is sawal ka jawab uplabdh nahi hai. Asli AI service jodne par anya sawalon ke jawab bhi mil sakenge.";
  }

  alert("🇮🇳 Bharat AI Teacher\n\n" + answer);
}
