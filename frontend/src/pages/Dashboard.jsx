import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-8 space-y-10">

          {/* Title Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Intelligent Data Hub
            </h2>
            <p className="text-gray-600 mt-2 max-w-3xl">
              A centralized public analytics platform powered by official
              datasets from data.gov.in. Explore domain-based insights,
              structured visualizations, and AI-assisted analysis.
            </p>
          </div>

          {/* KPI Section */}
          <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-blue-600 text-3xl">📊</div>
              <p className="text-sm text-gray-500 mt-2">Supported Domains</p>
              <h3 className="text-2xl font-bold mt-1">6</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-green-600 text-3xl">☁</div>
              <p className="text-sm text-gray-500 mt-2">Cloud Database</p>
              <h3 className="text-xl font-semibold mt-1">
                Neon PostgreSQL
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-purple-600 text-3xl">🔄</div>
              <p className="text-sm text-gray-500 mt-2">Update Frequency</p>
              <h3 className="text-xl font-semibold mt-1">
                Weekly Sync
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-orange-600 text-3xl">🤖</div>
              <p className="text-sm text-gray-500 mt-2">AI Assistance</p>
              <h3 className="text-xl font-semibold mt-1">
                Domain Restricted
              </h3>
            </div>

          </div>

          {/* Feature Section */}
          <div className="grid lg:grid-cols-3 gap-8">

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                📈 Interactive Analytics
              </h3>
              <p className="text-gray-600 text-sm">
                View state-wise reports and domain-based insights with
                interactive dashboards and structured data visualizations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                🔐 Secure Authentication
              </h3>
              <p className="text-gray-600 text-sm">
                Access the platform securely using Google OAuth with
                Gmail-only authentication control.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                🌍 Multilingual Ready
              </h3>
              <p className="text-gray-600 text-sm">
                Designed to support multiple Indian languages for
                inclusive and accessible data exploration.
              </p>
            </div>

          </div>

          {/* Domain Section */}
          <div className="bg-white p-8 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-6">
              Supported Data Domains
            </h3>

            <div className="grid md:grid-cols-2 gap-6 text-gray-700">

              <div className="flex items-center gap-3">
                🏥 <span>Health and Family Welfare</span>
              </div>

              <div className="flex items-center gap-3">
                🎓 <span>Education</span>
              </div>

              <div className="flex items-center gap-3">
                🚆 <span>Transport</span>
              </div>

              <div className="flex items-center gap-3">
                🌾 <span>Agriculture</span>
              </div>

              <div className="flex items-center gap-3">
                📊 <span>Census and Surveys</span>
              </div>

              <div className="flex items-center gap-3">
                💰 <span>Finance</span>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
