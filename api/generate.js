export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { goal, users, constraints } = req.body;

    const prompt = `
You are a senior product architect.

Generate structured JSON for:

Goal: ${goal}
Users: ${users}
Constraints: ${constraints}

Return ONLY valid JSON.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/aurora-alpha",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: "No response from model" });
    }

    const cleaned = content.replace(/```json|```/g, "");
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate spec" });
  }
}
