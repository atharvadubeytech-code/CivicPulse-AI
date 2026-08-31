const { createClient } = require("@supabase/supabase-js");
const { GoogleGenAI } = require("@google/genai");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;