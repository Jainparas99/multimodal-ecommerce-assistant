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

  const handleSend = async () => {
    if (input.trim() !== "") {
      setMessages([...messages, { type: "user", text: input }]);
  
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
  
      const data = await response.json();
      setMessages((prev) => [...prev, { type: "assistant", text: data.reply }]);
  
      setInput("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setMessages([...messages, { type: "user", text: "[Image Uploaded]" }]);
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
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
    </div>
  );
}
