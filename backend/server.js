import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("USER MESSAGE:", message);

    console.log(
      "API KEY EXISTS:",
      !!process.env.GROQ_API_KEY
    );

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant.",
          },
          {
            role: "user",
            content: message,
          },
        ],

        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("AI SUCCESS");

    res.json({
      reply:
        response.data.choices[0].message.content,
    });
  } catch (error) {
    console.log("===== ERROR =====");

    console.log(error.response?.data);

    res.status(500).json({
      error:
        error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});