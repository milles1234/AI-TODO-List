import { useEffect, useState } from "react";
import { loadSpecs, deleteSpec } from "../../lib/storage";
import type { FeatureSpec } from "../../types/spec";

export default function HistoryPanel() {
  const [specs, setSpecs] = useState<FeatureSpec[]>([]);

  useEffect(() => {
    setSpecs(loadSpecs());
  }, []);

  function handleDelete(id: string) {
    deleteSpec(id);
    setSpecs(loadSpecs());
  }

  if (specs.length === 0) {
    return (
      <div className="mt-12 text-gray-500 text-sm">No saved history yet.</div>
    );
  }

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-xl font-semibold">Saved History</h2>

      {specs.map((spec) => (
        <div key={spec.id} className="bg-white rounded-xl shadow p-6 space-y-3">
          <div>
            <strong>Goal:</strong> {spec.goal}
          </div>
          <div>
            <strong>Users:</strong> {spec.users}
          </div>
          <div>
            <strong>Constraints:</strong> {spec.constraints}
          </div>

          <button
            onClick={() => handleDelete(spec.id)}
            className="text-red-500 text-sm hover:underline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
