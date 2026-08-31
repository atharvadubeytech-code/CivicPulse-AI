import { useState } from "react";
import { submitComplaint as sendComplaint } from "../services/api";

function App() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("English");
  const [category, setCategory] = useState("Other");
  const [image, setImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const commonIssues = [
    { icon: "🛣️", name: "Road Damage", category: "Road" },
    { icon: "💧", name: "Water Logging", category: "Water" },
    { icon: "🗑️", name: "Garbage", category: "Garbage" },
    { icon: "💡", name: "Street Light", category: "Street Light" },
    { icon: "🚰", name: "Water Supply", category: "Water" },
    { icon: "📍", name: "Others", category: "Other" },
  ];

  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      () => {
        setMessage("Unable to get your location.");
      }
    );
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang =
      language === "Hindi"
        ? "hi-IN"
        : language === "Hinglish"
        ? "en-IN"
        : "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;

    setIsRecording(true);
    setMessage("");

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) =>
        prev ? `${prev} ${transcript}` : transcript
      );
    };

    recognition.onerror = () => {
      setMessage("Voice input failed. Please try again.");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

 const submitComplaint = async (e) => {
  e.preventDefault();

  if (!description.trim() || !location.trim()) {
    setMessage("Please enter your complaint and location.");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    const data = await sendComplaint({
      description,
      category,
      language,
      location_text: location,
      input_type: isRecording ? "voice" : "text",
    });

    setMessage("Complaint submitted successfully 🚀");

    setDescription("");
    setLocation("");
    setCategory("Other");
    setImage(null);
  } catch (error) {
    console.error(error);
    setMessage(error.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">🏛️</div>

          <div>
            <h1>CivicPulse AI</h1>
            <p>Your Voice. Better Governance.</p>
          </div>
        </div>

        <nav className="desktop-nav">
          <a href="#home">Home</a>
          <a href="#complaints">My Complaints</a>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Hinglish</option>
          </select>

          <button className="profile-btn">👤</button>
        </nav>

        <button className="mobile-profile">👤</button>
      </header>

      {/* MAIN */}
      <main>

        {/* HERO */}
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-badge">🤖 AI Powered Civic Platform</span>

              <h2>
                Report.
                <br />
                <span>AI Understands.</span>
                <br />
                Government Acts.
              </h2>

              <p>
                Submit your civic complaints in any language.
                Our AI analyzes the issue and helps route it
                toward the right action.
              </p>

              <div className="hero-stats">
                <div>
                  <strong>AI</strong>
                  <span>Powered</span>
                </div>

                <div>
                  <strong>24/7</strong>
                  <span>Available</span>
                </div>

                <div>
                  <strong>100%</strong>
                  <span>Digital</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="city-card">
                <div className="city-sky">☁️ ☁️</div>
                <div className="building building-1">🏢</div>
                <div className="building building-2">🏬</div>
                <div className="building building-3">🏠</div>
                <div className="road">🛣️</div>
                <div className="ai-orb">🤖</div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPLAINT FORM */}
        <section className="complaint-section" id="complaints">
          <div className="section-heading">
            <span>📝</span>
            <div>
              <h3>Submit a New Complaint</h3>
              <p>Tell us what's happening in your area</p>
            </div>
          </div>

          <form onSubmit={submitComplaint} className="complaint-form">

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Complaint Details</label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue..."
                maxLength={500}
              />

              <div className="character-count">
                {description.length}/500
              </div>
            </div>

            {/* LOCATION + LANGUAGE */}
            <div className="form-row">

              <div className="form-group">
                <label>Location</label>

                <div className="input-with-button">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter area / landmark"
                  />

                  <button
                    type="button"
                    className="location-btn"
                    onClick={getLocation}
                    title="Use my location"
                  >
                    📍
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Language</label>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Hinglish</option>
                </select>
              </div>

            </div>

            {/* IMAGE */}
            <div className="form-group">
              <label>Upload Image <span>(Optional)</span></label>

              <label className="upload-box">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setImage(e.target.files[0])}
                />

                <div className="upload-icon">☁️</div>

                <strong>
                  {image ? image.name : "Drag & drop or click to upload"}
                </strong>

                <small>JPG, PNG up to 5MB</small>
              </label>
            </div>

            {/* VOICE */}
            <div className="form-group">
              <label>Voice Input <span>(Optional)</span></label>

              <button
                type="button"
                className={`voice-btn ${isRecording ? "recording" : ""}`}
                onClick={startVoiceInput}
              >
                🎙️
                {isRecording ? " Listening..." : " Start Recording"}
              </button>
            </div>

            {/* CATEGORY */}
            <div className="selected-category">
              <span>Selected Category:</span>
              <strong>{category}</strong>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Complaint →"}
            </button>

            {/* MESSAGE */}
            {message && (
              <div className="form-message">
                {message}
              </div>
            )}

          </form>
        </section>

        {/* COMMON ISSUES */}
        <section className="common-section">

          <div className="section-title">
            <h3>Common Issues</h3>
            <p>Quickly select the type of issue you're facing</p>
          </div>

          <div className="issues-grid">

            {commonIssues.map((issue) => (
              <button
                key={issue.name}
                className={`issue-card ${
                  category === issue.category ? "active" : ""
                }`}
                onClick={() => setCategory(issue.category)}
                type="button"
              >
                <span className="issue-icon">{issue.icon}</span>
                <span>{issue.name}</span>
              </button>
            ))}

          </div>

        </section>

        {/* FEATURES */}
        <section className="features-section">

          <div className="feature-card">
            <span>🤖</span>
            <h3>AI Analysis</h3>
            <p>
              AI understands your complaint and identifies
              important details.
            </p>
          </div>

          <div className="feature-card">
            <span>📍</span>
            <h3>Smart Location</h3>
            <p>
              Location-based complaints help identify
              problem hotspots.
            </p>
          </div>

          <div className="feature-card">
            <span>📊</span>
            <h3>Better Governance</h3>
            <p>
              Data-driven insights can help authorities
              prioritize civic problems.
            </p>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer>
        <div>
          <strong>CivicPulse AI</strong>
          <p>Technology for better civic governance.</p>
        </div>

        <p>© 2026 CivicPulse AI. All rights reserved.</p>
      </footer>

      {/* MOBILE NAV */}
      <nav className="mobile-nav">
        <a href="#home">
          <span>🏠</span>
          Home
        </a>

        <a href="#complaints">
          <span>📝</span>
          Report
        </a>

        <a href="#complaints">
          <span>📋</span>
          Complaints
        </a>

        <a href="#home">
          <span>👤</span>
          Profile
        </a>
      </nav>

    </div>
  );
}

export default App;