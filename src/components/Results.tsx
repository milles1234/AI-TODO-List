import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import type { AIResponse } from "../api/ai";

interface ResultProps {
  data: AIResponse;
}

export default function Result({ data }: ResultProps) {
  const [epics, setEpics] = useState<AIResponse["epics"]>([]);

  // Sync when new AI result comes
  useEffect(() => {
    setEpics(data.epics);
  }, [data]);

  // -----------------------------
  // Move Task Up
  // -----------------------------
  const moveTaskUp = (epicIndex: number, taskIndex: number) => {
    if (taskIndex === 0) return;

    setEpics((prev) => {
      const updated = [...prev];
      const tasks = [...updated[epicIndex].engineeringTasks];

      [tasks[taskIndex - 1], tasks[taskIndex]] = [
        tasks[taskIndex],
        tasks[taskIndex - 1],
      ];

      updated[epicIndex] = {
        ...updated[epicIndex],
        engineeringTasks: tasks,
      };

      return updated;
    });
  };

  // -----------------------------
  // Delete Task
  // -----------------------------
  const deleteTask = (epicIndex: number, taskIndex: number) => {
    setEpics((prev) => {
      const updated = [...prev];

      updated[epicIndex] = {
        ...updated[epicIndex],
        engineeringTasks: updated[epicIndex].engineeringTasks.filter(
          (_, i) => i !== taskIndex
        ),
      };

      return updated;
    });
  };

  // -----------------------------
  // Download PDF
  // -----------------------------
  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(18);
    doc.text("Feature Specification", 10, y);
    y += 10;

    doc.setFontSize(14);
    doc.text("Problem:", 10, y);
    y += 7;
    doc.setFontSize(11);
    doc.text(data.problem, 10, y, { maxWidth: 180 });
    y += 15;

    doc.setFontSize(14);
    doc.text("Solution:", 10, y);
    y += 7;
    doc.setFontSize(11);
    doc.text(data.solution, 10, y, { maxWidth: 180 });
    y += 15;

    epics.forEach((epic) => {
      doc.setFontSize(14);
      doc.text(`Epic: ${epic.title}`, 10, y);
      y += 8;

      doc.setFontSize(12);
      doc.text("User Stories:", 10, y);
      y += 6;

      epic.userStories.forEach((story) => {
        doc.setFontSize(11);
        doc.text(`- ${story.title}`, 10, y);
        y += 5;
        doc.text(story.description, 15, y, { maxWidth: 170 });
        y += 8;
      });

      doc.setFontSize(12);
      doc.text("Engineering Tasks:", 10, y);
      y += 6;

      epic.engineeringTasks.forEach((task) => {
        doc.setFontSize(11);
        doc.text(`- ${task}`, 10, y);
        y += 6;
      });

      y += 5;
    });

    doc.setFontSize(14);
    doc.text("Risks:", 10, y);
    y += 7;
    data.risks.forEach((risk) => {
      doc.setFontSize(11);
      doc.text(`- ${risk}`, 10, y);
      y += 6;
    });

    y += 5;
    doc.setFontSize(14);
    doc.text("Unknowns:", 10, y);
    y += 7;
    data.unknowns.forEach((unknown) => {
      doc.setFontSize(11);
      doc.text(`- ${unknown}`, 10, y);
      y += 6;
    });

    doc.save("feature-spec.pdf");
  };

  return (
    <div className="space-y-10 p-6">
      {/* Download Button */}
      <div className="flex justify-end">
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>

      {/* Problem */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Problem</h2>
        <p>{data.problem}</p>
      </section>

      {/* Solution */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Solution</h2>
        <p>{data.solution}</p>
      </section>

      {/* Epics */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Epics</h2>

        {epics.map((epic, epicIndex) => (
          <div
            key={epicIndex}
            className="border rounded-lg p-5 mb-6 shadow-sm bg-white"
          >
            <h3 className="text-xl font-semibold mb-4">{epic.title}</h3>

            {/* User Stories */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">User Stories</h4>
              <ul className="list-disc list-inside space-y-2">
                {epic.userStories.map((story, i) => (
                  <li key={i}>
                    <strong>{story.title}</strong>
                    <p className="text-sm">{story.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Engineering Tasks */}
            <div>
              <h4 className="font-semibold mb-2">Engineering Tasks</h4>

              {epic.engineeringTasks.map((task, taskIndex) => (
                <div key={taskIndex} className="flex items-center gap-2 mb-2">
                  <span className="flex-1 border p-2 rounded bg-gray-50">
                    {task}
                  </span>

                  {taskIndex > 0 && (
                    <button
                      onClick={() =>
                        moveTaskUp(epicIndex, taskIndex)
                      }
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      ↑
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteTask(epicIndex, taskIndex)
                    }
                    className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Risks */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Risks</h2>
        <ul className="list-disc list-inside">
          {data.risks.map((risk, i) => (
            <li key={i}>{risk}</li>
          ))}
        </ul>
      </section>

      {/* Unknowns */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Unknowns</h2>
        <ul className="list-disc list-inside">
          {data.unknowns.map((unknown, i) => (
            <li key={i}>{unknown}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
