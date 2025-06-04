require('dotenv').config()  // ⬅ loads values from `.env` into process.env
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const config = require('./config/config') //convict read from process.env

const app = express();
const PORT = config.get('port');

const ELEVENLABS_API_KEY = config.get('elevenlabs.apiKey');
const VOICE_ID = config.get('elevenlabs.voiceId'); // Default voice ID

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { audio: null });
});

app.post("/speak", async (req, res) => {
  const text = req.body.text;

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
      }
    );

    const outputPath = path.join(__dirname, "public", "output.mp3");
    fs.writeFileSync(outputPath, response.data);

    res.render("index", { audio: "output.mp3" });
  } catch (err) {
    const buffer = err.response?.data;
    if (buffer) {
        const errorJson = JSON.parse(Buffer.from(buffer).toString("utf8"));
        console.error("ElevenLabs API Error:", errorJson);
    } else {
        console.error("Error:", err.message);
    }
    res.status(500).send("Something went wrong");
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
