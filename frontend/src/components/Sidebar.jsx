import { useNavigate } from "react-router-dom";

export default function Sidebar() {

  const navigate = useNavigate();

  const domains = [
    "Health",
    "Education",
    "Transport",
    "Agriculture",
    "Census",
    "Finance"
  ];

  return (

    <div className="w-64 h-screen bg-gradient-to-b from-[#0f172a] to-[#0b1220] text-white p-6">

      <h1 className="text-2xl font-bold mb-8">IDH</h1>

      <button
        onClick={() => navigate("/dashboard")}
        className="w-full text-left px-4 py-2 mb-4 rounded bg-blue-600"
      >
        Overview
      </button>

      {domains.map((domain) => (

        <button
          key={domain}
          onClick={() => navigate(`/domain/${domain.toLowerCase()}`)}
          className="w-full text-left px-4 py-2 mb-2 hover:bg-gray-700 rounded"
        >
          {domain}
        </button>

      ))}

      <div className="mt-6 border-t border-gray-600 pt-4">

        <button
          onClick={() => navigate("/chatbot")}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-left"
        >
          🤖 Domain Chatbot
        </button>

      </div>

    </div>

  );
}