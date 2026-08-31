require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const supabase = require("./supabase");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "CivicPulse AI Backend is running 🚀"
  });
});

// Database test route
app.get("/api/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("complaints")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Supabase Error:", error);

      return res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message
      });
    }

    res.json({
      success: true,
      message: "CivicPulse AI Database Connected 🚀",
      data: data
    });

  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});
// Create a new complaint
// Create a new complaint
app.post("/api/complaints", async (req, res) => {
  try {
    const {
      description,
      category,
      language,
      location_text,
      latitude,
      longitude,
      input_type
    } = req.body;

    // Basic validation
    if (!description || !category || !location_text) {
      return res.status(400).json({
        success: false,
        message: "Description, category and location are required"
      });
    }

    // Save complaint to Supabase
    const { data, error } = await supabase
      .from("complaints")
      .insert([
        {
          description,
          category,
          language: language || "English",
          location_text,
          latitude: latitude || null,
          longitude: longitude || null,
          input_type: input_type || "text",
          priority: "Medium",
          status: "Submitted"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to save complaint",
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully 🚀",
      complaint: data
    });

  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});
app.get("/api/test-ai", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Explain in one short sentence what a civic complaint is."
    });

    res.json({
      success: true,
      message: "Gemini AI Connected 🤖🔥",
      response: response.text
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      message: "Gemini connection failed",
      error: error.message
    });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(
    `CivicPulse AI Backend running on http://localhost:${PORT}`
  );
});