"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState, useRef } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", content: "Привет! Кто хочет обсудить React?", fromMe: false },
    { id: 2, sender: "Вы", content: "Привет, я только подключился!", fromMe: true },
    { id: 3, sender: "Bob", content: "React — топ! Особенно хуки.", fromMe: false },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    console.log("savedToken:", savedToken);
    if (!savedToken) {
      window.location.href = "/login";
      return;
    }
    setToken(savedToken);
    fetchMessages(savedToken);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchMessages(token) {
    try {
      const response = await fetch("http://localhost:8080/api/chat/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Ошибка загрузки сообщений: ${response.status}`);
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
      alert("Ошибка при загрузке сообщений");
    }
  }

  async function sendMessageToServer(messageContent) {
    if (!token) {
      console.warn("Нет токена, сообщение не отправлено");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: messageContent }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка отправки: ${response.status} ${errorText}`);
      }
      const savedMessage = await response.json();
      setMessages((prev) => [...prev, { ...savedMessage, fromMe: true }]);
    } catch (error) {
      console.error(error);
      alert(`Ошибка при отправке сообщения: ${error.message}`);
    }
  }

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      sender: "Вы",
      content: input,
      fromMe: true,
    };
    setMessages([...messages, newMessage]);

    sendMessageToServer(input);

    setInput("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-teal-50 text-gray-900 flex flex-col">
      <Navbar />

      <section className="flex-grow py-6 px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[75vh]">
          <div className="bg-teal-600 text-white py-4 px-6 text-lg font-semibold">
            Обсуждение темы: Frontend на React
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-5 py-3 max-w-xs sm:max-w-md shadow-md text-sm sm:text-base
                    ${msg.fromMe ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-800"}`}
                >
                  {!msg.fromMe && (
                    <p className="font-semibold text-teal-800 mb-1">{msg.sender}</p>
                  )}
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t bg-white px-4 sm:px-6 py-4 flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Введите сообщение..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition text-sm sm:text-base"
            />
            <button
              onClick={handleSend}
              className="bg-teal-600 text-white px-5 py-2 rounded-2xl hover:bg-teal-700 transition font-semibold text-sm sm:text-base"
            >
              Отправить
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
