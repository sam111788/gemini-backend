const express = require("express");
const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const MODEL = "gemini-1.5-pro";
const LOCATION = "us-central1";
const PROJECT_ID = "gen-lang-client-0899726999";

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const auth = new GoogleAuth({
      keyFile: "service-account.json",
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

    const response = await axios.post(
      url,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Gemini API call failed" });
  }
});

app.listen(3000, () => {
  console.log("Gemini backend is running on http://localhost:3000");
});
