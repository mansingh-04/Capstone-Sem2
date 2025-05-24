"use client"
import { useState, useEffect } from "react"
import { fetchTriviaQuestions } from "../../lib/trivia"

export default function Trivia() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [difficulty, setDifficulty] = useState("easy")
  const [timeLeft, setTimeLeft] = useState(45)
  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalTimeTaken, setTotalTimeTaken] = useState(0)
  const [startTime, setStartTime] = useState(null)

  // Get time based on difficulty
  const getTimeForDifficulty = (level) => {
    switch (level) {
      case "easy":
        return 45
      case "medium":
        return 30
      case "hard":
        return 20
      default:
        return 45
    }
  }

  // Get timer class based on time left
  const getTimerClass = () => {
    const totalTime = getTimeForDifficulty(difficulty)
    const percentage = (timeLeft / totalTime) * 100
    if (percentage <= 25) return "danger"
    if (percentage <= 50) return "warning"
    return ""
  }

  // Timer for counting down each question
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

  // Timer for total quiz time
  useEffect(() => {
    let intervalId;
    
    if (quizStarted && !quizCompleted) {
      setTotalTimeTaken(0);
      intervalId = setInterval(() => {
        setTotalTimeTaken(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [quizStarted, quizCompleted]);

  const startQuiz = async (level) => {
    setLoading(true)
    setError(null)
    try {
      const fetchedQuestions = await fetchTriviaQuestions(level, 5)
      setQuestions(fetchedQuestions)
      setDifficulty(level)
      setQuizStarted(true)
      setCurrentQuestion(0)
      setScore(0)
      setSelectedOption(null)
      setQuizCompleted(false)
      setTimeLeft(getTimeForDifficulty(level))
      setTotalTimeTaken(0)
    } catch (err) {
      setError('Failed to load questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOptionSelect = (index) => {
    setSelectedOption(index)
  }

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 100)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setTimeLeft(getTimeForDifficulty(difficulty))
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setQuizStarted(false)
    setQuestions([])
    setTotalTimeTaken(0)
  }

  if (loading) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Movie Trivia Challenge</h1>
        <div className="loading-spinner">Loading questions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Movie Trivia Challenge</h1>
        <div className="error-message">
          <p>{error}</p>
          <button className="btn btn-primary mt-4" onClick={() => startQuiz(difficulty)}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Movie Trivia Challenge</h1>

      {!quizStarted ? (
        <div className="trivia-container">
          <div className="trivia-welcome">
            <h2>Test your movie knowledge!</h2>
            <p>Choose a difficulty level to start the quiz and challenge yourself with exciting movie questions!</p>
          </div>

          <div className="difficulty-buttons">
            <button 
              className="difficulty-button easy"
              onClick={() => startQuiz("easy")}
            >
              <span className="icon">🎬</span>
              Easy
              <span className="description">45 seconds per question</span>
            </button>
            <button
              className="difficulty-button medium"
              onClick={() => startQuiz("medium")}
            >
              <span className="icon">🎥</span>
              Medium
              <span className="description">30 seconds per question</span>
            </button>
            <button
              className="difficulty-button hard"
              onClick={() => startQuiz("hard")}
            >
              <span className="icon">🌟</span>
              Hard
              <span className="description">20 seconds per question</span>
            </button>
          </div>
        </div>
      ) : quizCompleted ? (
        <div className="trivia-container quiz-completed">
          <h2>Quiz Completed!</h2>
          <div className="score-display">{score}</div>
          <p className="score-text">
            You answered {score / 100} out of {questions.length} questions correctly
          </p>
          <div className="stats">
            <p>Difficulty: <span style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{difficulty}</span></p>
            <p>Time Taken: <span style={{ color: 'var(--primary)' }}>{totalTimeTaken} seconds</span></p>
          </div>
          <div className="action-buttons">
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
          <div className="question-container">
            <div className="question-header">
              <div className="question-number">
                Question {currentQuestion + 1}
                <span className="question-progress">of {questions.length}</span>
              </div>
              <div className="timer-badge">
                <span className={`timer-count ${getTimerClass()}`}>{timeLeft}s</span>
                <div className={`difficulty-badge ${difficulty}`}>
                  {difficulty}
                </div>
              </div>
            </div>

            <p className="question-text" dangerouslySetInnerHTML={{ __html: questions[currentQuestion].question }}></p>

            <div className="options-grid">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedOption === index ? "selected" : ""}`}
                  onClick={() => handleOptionSelect(index)}
                  dangerouslySetInnerHTML={{ __html: option }}
                />
              ))}
            </div>

            <div className="quiz-footer">
              <div className="score-display">
                Score: <span className="score-value">{score}</span>
              </div>
              <button 
                className="next-button" 
                onClick={handleNextQuestion} 
                disabled={selectedOption === null}
              >
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
