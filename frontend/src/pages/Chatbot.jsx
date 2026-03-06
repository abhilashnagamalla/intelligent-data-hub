import { useState } from "react";
import Header from "../components/Header";

export default function Chatbot() {

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const domains = [
    "health",
    "education",
    "transport",
    "agriculture",
    "census",
    "finance"
  ];

  const handleSend = async () => {

    if (!input.trim()) return;

    const query = input.toLowerCase();

    const detectedDomain = domains.find(domain =>
      query.includes(domain)
    );

    let response = "";

    if (!detectedDomain) {

      response =
        "❌ Please ask about one of these domains: Health, Education, Transport, Agriculture, Census, Finance.";

    } else {

      try {

        const res = await fetch(
          `http://127.0.0.1:8000/datasets/${detectedDomain}`
        );

        const data = await res.json();

        if (data.length === 0) {

          response = `⚠️ No datasets available for ${detectedDomain} domain.`;

        } else {

          response = `✅ ${data.length} datasets found for ${detectedDomain} domain.\n\nExample Dataset:\n${data[0].title || data[0].id}`;

        }

      } catch (error) {

        response = "⚠️ Failed to connect to dataset service.";

      }

    }

    setMessages([
      ...messages,
      { user: input, bot: response }
    ]);

    setInput("");
  };

  return (

    <>
      <Header />

      <div className="p-8 max-w-3xl mx-auto">

        <h2 className="text-2xl font-semibold mb-4">
          Government Data Chatbot
        </h2>

        <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50">

          {messages.map((msg, index) => (

            <div key={index} className="mb-4">

              <p className="font-semibold text-blue-600">
                You:
              </p>

              <p className="mb-2">
                {msg.user}
              </p>

              <p className="font-semibold text-green-600">
                Bot:
              </p>

              <p className="whitespace-pre-line">
                {msg.bot}
              </p>

            </div>

          ))}

        </div>

        <div className="flex mt-4 gap-2">

          <input
            type="text"
            placeholder="Ask about health, education, transport, agriculture, census or finance datasets..."
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