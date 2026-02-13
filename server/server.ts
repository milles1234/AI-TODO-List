// import express from "express"
// import cors from "cors"
// import dotenv from "dotenv"
// import OpenAI from "openai"

// dotenv.config()

// const app = express()
// app.use(cors())
// app.use(express.json())

// const openai = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1",
// })

// app.post("/api/generate", async (req, res) => {
//   try {
//     const { prompt } = req.body

//     const completion = await openai.chat.completions.create({
//       model: "meta-llama/llama-3.1-8b-instruct",
//       messages: [{ role: "user", content: prompt }],
//     })

//     res.json(completion.choices[0].message)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: "Failed to generate text" })
//   }
// })

// app.listen(5000, () => {
//   console.log("Server running on port 5000")
// })
