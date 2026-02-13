import { useState } from "react";
import { saveSpec } from "../../lib/storage";
import { generateText } from "../../../api/ai";
import type { FeatureSpec } from "../../types/spec";
import type { AIResponse } from "../../../api/ai";
import Result from "../Results"; // adjust path if needed

export default function FeatureForm() {
  const [goal, setGoal] = useState("");
  const [users, setUsers] = useState("");
  const [constraints, setConstraints] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAiResult(null);

    try {
      const data = await generateText({ goal, users, constraints });

      setAiResult(data);

      const newSpec: FeatureSpec = {
        id: crypto.randomUUID(),
        goal,
        users,
        constraints,
        createdAt: new Date().toISOString(),
      };

      saveSpec(newSpec);
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI response. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 pb-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Feature Architect
          </h1>
          <p className="text-gray-500 mt-2">
            Turn your idea into a detailed technical spec.
          </p>
        </div>

        <div className="space-y-4">
          {/* Goal */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              What is the goal?
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Build a real-time notification system..."
              rows={3}
              required
              className="w-full rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Users */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Who are the users?
            </label>
            <input
              type="text"
              value={users}
              onChange={(e) => setUsers(e.target.value)}
              placeholder="e.g. Internal admins, mobile app users..."
              required
              className="w-full rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Constraints
            </label>
            <textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="Tech stack, deadlines, etc."
              rows={2}
              className="w-full rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Architecting..." : "Generate Technical Plan"}
        </button>
      </form>

      {/* ✅ Render Result Component */}
      {aiResult && <Result data={aiResult} />}
    </div>
  );
}
