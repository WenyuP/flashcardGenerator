import React, { useState } from "react";

function App() {
  const [topic, setTopic] = useState(""); // State for the input topic
  const [flashcards, setFlashcards] = useState([]); // State for flashcards
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  // Function to handle generating flashcards
  const handleGenerate = async () => {
    setError("");
    setFlashcards([]);
    setLoading(true); // Start loading

    if (!topic.trim()) {
      setError("Please enter a topic.");
      setLoading(false); // Stop loading
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred while generating flashcards.");
      }

      const data = await response.json();
      const flashcardsWithState = data.flashcards.map((card) => ({
        ...card,
        flipped: false, // Add a flipped property to each card
      }));
      setFlashcards(flashcardsWithState);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to handle flipping a card
  const handleFlip = (index) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index].flipped = !updatedFlashcards[index].flipped;
    setFlashcards(updatedFlashcards);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Patrick Hand', 'Quicksand', Arial, sans-serif",
        backgroundColor: "#FFFBEA",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          color: "#FF69B4",
          fontSize: "36px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Flashcard Generator
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Enter a topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            border: "1px solid #FF69B4",
            borderRadius: "8px",
            outline: "none",
            fontFamily: "'Patrick Hand', 'Quicksand', Arial, sans-serif",
          }}
          aria-label="Enter a topic"
        />
        <button
          onClick={handleGenerate}
          style={{
            padding: "10px",
            border: "none",
            background: "#FF69B4",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "'Patrick Hand', 'Quicksand', Arial, sans-serif",
          }}
          aria-label="Generate flashcards"
        >
          Generate
        </button>
      </div>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {loading && (
        <p style={{ textAlign: "center", color: "#FF69B4", fontSize: "18px" }}>
          Loading...
        </p>
      )}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {flashcards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleFlip(index)} // Flip card on click
            style={{
              perspective: "1000px",
              width: "300px",
              height: "150px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                textAlign: "center",
                transformStyle: "preserve-3d",
                transform: card.flipped
                  ? "rotateY(180deg)"
                  : "rotateY(0deg)",
                transition: "transform 0.6s",
              }}
            >
              {/* Front Side */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  backgroundColor: "#FFF176",
                  border: "1px solid #FFB74D",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <strong
                  style={{
                    color: "#FF4081",
                    fontSize: "20px",
                    fontWeight: "600",
                    fontFamily: "'Patrick Hand', 'Quicksand', Arial, sans-serif",
                  }}
                >
                  {card.question}
                </strong>
              </div>

              {/* Back Side */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  backgroundColor: "#FFD54F",
                  border: "1px solid #FFB74D",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transform: "rotateY(180deg)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <strong
                  style={{
                    color: "#3366CC",
                    fontSize: "20px",
                    fontWeight: "600",
                    fontFamily: "'Patrick Hand', 'Quicksand', Arial, sans-serif",
                  }}
                >
                  {card.answer}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
