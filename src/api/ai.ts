export interface AIResponse {
  problem: string;
  solution: string;
  epics: {
    title: string;
    userStories: {
      title: string;
      description: string;
    }[];
    engineeringTasks: string[];
  }[];
  risks: string[];
  unknowns: string[];
}
export async function generateText(input: {
  goal: string;
  users: string;
  constraints: string;
}) {
  const response = await fetch("http://localhost:5000/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to generate");
  }

  return response.json();
}
