'use client'
import { useState } from "react";

interface Message {
  type: string;
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [listening, setListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const speakText = (text: string) => {
    if (!isMuted && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (input.trim() !== "" || image) {
      const formData = new FormData();
      formData.append("message", input);
      if (image) {
        formData.append("image", image);
      }
  
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      setMessages((prev) => [...prev, { type: "assistant", text: data.reply }]);
      speakText(data.reply);
  
      setInput("");
      setImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setMessages([...messages, { type: "user", text: "[Image Uploaded]" }]);
    }
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
  
    recognition.onstart = () => setListening(true);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
  
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInput(transcript);
    };
  
    if (!listening) {
      recognition.start();
    } else {
      recognition.stop();
    }
  };
  


  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
      <div className="w-full max-w-xl border rounded p-4 h-96 overflow-y-scroll mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className={msg.type === "user" ? "font-bold" : ""}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Type your message"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
        <button
          onClick={handleSpeechRecognition}
          className={`px-4 py-2 rounded ${listening ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {listening ? 'Stop Listening' : 'Start Speaking'}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="bg-gray-500 text-white px-2 py-1 rounded"
        >
          {isMuted ? "🔇 Unmute" : "🔊 Mute"}
        </button>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
    </div>
  );
}
