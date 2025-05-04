"use client"
import { useState, useEffect } from "react"

export default function Trivia() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [difficulty, setDifficulty] = useState("easy")
  const [timeLeft, setTimeLeft] = useState(45)
  const [quizStarted, setQuizStarted] = useState(false)

  // This would be fetched from your API
  const questions = {
    easy: [
      {
        question: "Which actor played Tony Stark in the Marvel Cinematic Universe?",
        options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
        correctAnswer: 1,
      },
      {
        question: "Which film won the Academy Award for Best Picture in 2020?",
        options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
        correctAnswer: 2,
      },
      {
        question: "Who directed the movie 'Inception'?",
        options: ["Christopher Nolan", "Steven Spielberg", "James Cameron", "Quentin Tarantino"],
        correctAnswer: 0,
      },
      {
        question: "Which of these is NOT a Pixar film?",
        options: ["Finding Nemo", "Shrek", "Toy Story", "Up"],
        correctAnswer: 1,
      },
      {
        question: "What year was the first 'Star Wars' film released?",
        options: ["1975", "1977", "1980", "1983"],
        correctAnswer: 1,
      },
    ],
    medium: [
      {
        question: "Which actor has won the most Academy Awards for acting?",
        options: ["Meryl Streep", "Jack Nicholson", "Katharine Hepburn", "Daniel Day-Lewis"],
        correctAnswer: 2,
      },
      {
        question: "Which film is based on a novel by Stephen King?",
        options: ["The Sixth Sense", "The Shining", "Alien", "Psycho"],
        correctAnswer: 1,
      },
      {
        question: "Who played the Joker in 'The Dark Knight'?",
        options: ["Joaquin Phoenix", "Jack Nicholson", "Heath Ledger", "Jared Leto"],
        correctAnswer: 2,
      },
      {
        question: "Which movie features the character Jules Winnfield?",
        options: ["Reservoir Dogs", "Pulp Fiction", "Jackie Brown", "Django Unchained"],
        correctAnswer: 1,
      },
      {
        question: "Which of these films was NOT directed by Martin Scorsese?",
        options: ["The Departed", "Goodfellas", "Fight Club", "The Wolf of Wall Street"],
        correctAnswer: 2,
      },
    ],
    hard: [
      {
        question: "Which film holds the record for the most Academy Award nominations without winning any?",
        options: ["The Turning Point", "The Color Purple", "American Hustle", "True Grit"],
        correctAnswer: 0,
      },
      {
        question: "Who was the first African American to win an Academy Award?",
        options: ["Sidney Poitier", "Hattie McDaniel", "Dorothy Dandridge", "James Earl Jones"],
        correctAnswer: 1,
      },
      {
        question: "Which actor appeared in the films 'The Machinist', 'American Psycho', and 'The Dark Knight'?",
        options: ["Christian Bale", "Edward Norton", "Brad Pitt", "Jared Leto"],
        correctAnswer: 0,
      },
      {
        question: "Which film was the first fully CGI feature film?",
        options: ["A Bug's Life", "Toy Story", "Antz", "The Lion King"],
        correctAnswer: 1,
      },
      {
        question: "Which director has the most Palme d'Or wins at the Cannes Film Festival?",
        options: ["Francis Ford Coppola", "Michael Haneke", "Ken Loach", "Jean-Pierre and Luc Dardenne"],
        correctAnswer: 2,
      },
    ],
  }

  useEffect(() => {
    let timer
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && !quizCompleted) {
      handleNextQuestion()
    }

    return () => clearTimeout(timer)
  }, [timeLeft, quizStarted, quizCompleted])

  const startQuiz = (level) => {
    setDifficulty(level)
    setQuizStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedOption(null)
    setQuizCompleted(false)
    setTimeLeft(45)
  }

  const handleOptionSelect = (index) => {
    setSelectedOption(index)
  }

  const handleNextQuestion = () => {
    // Check if answer is correct and update score
    if (selectedOption === questions[difficulty][currentQuestion].correctAnswer) {
      setScore(score + 100)
    }

    // Move to next question or end quiz
    if (currentQuestion < questions[difficulty].length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setTimeLeft(45)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setQuizStarted(false)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Movie Trivia Challenge</h1>

      {!quizStarted ? (
        <div className="trivia-container text-center">
          <h2 className="text-2xl font-semibold mb-6">Test your movie knowledge!</h2>
          <p className="mb-8">Choose a difficulty level to start the quiz:</p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="btn btn-primary px-8 py-3" onClick={() => startQuiz("easy")}>
              Easy
            </button>
            <button
              className="btn btn-primary px-8 py-3"
              style={{ backgroundColor: "#f59e0b" }}
              onClick={() => startQuiz("medium")}
            >
              Medium
            </button>
            <button
              className="btn btn-primary px-8 py-3"
              style={{ backgroundColor: "#ef4444" }}
              onClick={() => startQuiz("hard")}
            >
              Hard
            </button>
          </div>
        </div>
      ) : quizCompleted ? (
        <div className="trivia-container text-center">
          <h2 className="text-2xl font-semibold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-6">
            Your final score: <span className="text-[#7c3aed] font-bold">{score}</span>
          </p>

          <div className="mb-8">
            <p>
              You answered {score / 100} out of {questions[difficulty].length} questions correctly.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="btn btn-primary" onClick={restartQuiz}>
              Play Again
            </button>
            <button className="btn btn-secondary" onClick={() => (window.location.href = "/")}>
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="trivia-container">
          <div className="trivia-header">
            <h2 className="text-xl font-semibold">
              Question {currentQuestion + 1}/{questions[difficulty].length}
            </h2>
            <div className="flex items-center">
              <span className="text-sm mr-2">Time: {timeLeft}</span>
              <div
                className={`text-white text-xs px-2 py-1 rounded ${
                  difficulty === "easy" ? "bg-[#7c3aed]" : difficulty === "medium" ? "bg-[#f59e0b]" : "bg-[#ef4444]"
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </div>
            </div>
          </div>

          <p className="text-lg mb-6">{questions[difficulty][currentQuestion].question}</p>

          <div className="trivia-options">
            {questions[difficulty][currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`trivia-option ${selectedOption === index ? "selected" : ""}`}
                onClick={() => handleOptionSelect(index)}
              >
                <p>{option}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <div>
              <p className="font-semibold">
                Score: <span className="text-[#7c3aed]">{score}</span>
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleNextQuestion} disabled={selectedOption === null}>
              {currentQuestion < questions[difficulty].length - 1 ? "Next Question" : "Finish Quiz"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
