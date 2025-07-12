document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const message = input.value.trim();
    if (message === "") return;

    // ✅ User message display
    const userMsg = document.createElement("div");
    userMsg.className = "user-message";
    userMsg.innerText = message;
    chatBox.appendChild(userMsg);
    input.value = "";

    // ✅ Show typing indicator
    const typing = document.createElement("div");
    typing.className = "bot-message";
    typing.id = "typing";
    typing.innerText = "typing...";
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: message })
      });

      const data = await res.json();
      const reply = data.reply || data.error || "Something went wrong.";

      // ✅ Remove typing indicator
      const typingElement = document.getElementById("typing");
      if (typingElement) typingElement.remove();

      // ✅ Create timestamp
      const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };


      // ✅ Display bot message with time
      const botMsg = document.createElement("div");
      botMsg.className = "bot-message";
      botMsg.innerText = `${reply}\n\n${formatTime()}`;
      chatBox.appendChild(botMsg);
      chatBox.scrollTop = chatBox.scrollHeight;


    } catch (error) {
      const typingElement = document.getElementById("typing");
      if (typingElement) typingElement.remove();

      const errMsg = document.createElement("div");
      errMsg.className = "bot-message";
      errMsg.innerText = "Error: " + error.message;
      chatBox.appendChild(errMsg);
    }
  });

  // ✅ Clear Chat Button Logic
  const clearBtn = document.getElementById("clearBtn");
  clearBtn.addEventListener("click", () => {
    chatBox.innerHTML = "";
  });

  // ✅ Voice Input using Web Speech API
const micBtn = document.getElementById("micBtn");

if ("webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  micBtn.addEventListener("click", () => {
    recognition.start();
    micBtn.innerText = "🎙️ Listening...";
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("user-input").value = transcript;
    micBtn.innerText = "🎙️";
  };

  recognition.onerror = () => {
    micBtn.innerText = "🎙️";
  };

  recognition.onend = () => {
    micBtn.innerText = "🎙️";
  };
} else {
  micBtn.disabled = true;
  micBtn.innerText = "🎙️ Not supported";
}

// ✅ Export Chat to PDF using jsPDF
document.getElementById("downloadBtn").addEventListener("click", () => {
  const chatBox = document.getElementById("chat-box");
  const messages = chatBox.querySelectorAll(".user-message, .bot-message");

  let content = "";
  messages.forEach(msg => {
    content += msg.innerText + "\n\n";
  });

  // Load jsPDF and generate PDF
  const doc = new window.jspdf.jsPDF();
  doc.setFont("helvetica");
  doc.text(content.trim(), 10, 10);
  doc.save("chat-history.pdf");
});
// ✅ Theme Toggle Logic
  const themeBtn = document.getElementById("themeBtn");
  themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});


});
