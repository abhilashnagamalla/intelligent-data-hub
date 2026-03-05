import { useState } from "react";
import Header from "../components/Header";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const allowedDomain = [
    "health",
    "family",
    "hospital",
    "government",
    "data",
    "statistics",
    "welfare"
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const isAllowed = allowedDomain.some(keyword =>
      input.toLowerCase().includes(keyword)
    );

    let response;

    if (!isAllowed) {
      response =
        "❌ This chatbot is restricted to Health & Government data queries only.";
    } else {
      response =
        "✅ Valid domain query detected. Connecting to data source...";
    }

    setMessages([...messages, { user: input, bot: response }]);
    setInput("");
  };

  return (
    <>
      <Header />

      <div className="p-8 max-w-3xl mx-auto">

        <h2 className="text-2xl font-semibold mb-4">
          Domain Restricted AI Chatbot
        </h2>

        <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50">

          {messages.map((msg, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold text-blue-600">
                You:
              </p>
              <p className="mb-2">{msg.user}</p>

              <p className="font-semibold text-green-600">
                Bot:
              </p>
              <p>{msg.bot}</p>
            </div>
          ))}

        </div>

        <div className="flex mt-4 gap-2">
          <input
            type="text"
            placeholder="Ask about Health & Government data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>

      </div>
    </>
  );
}