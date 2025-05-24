export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
}

export const TIMER_DURATIONS = {
  [DIFFICULTY_LEVELS.EASY]: 45,
  [DIFFICULTY_LEVELS.MEDIUM]: 30,
  [DIFFICULTY_LEVELS.HARD]: 20
}

export const POINTS = {
  [DIFFICULTY_LEVELS.EASY]: 10,
  [DIFFICULTY_LEVELS.MEDIUM]: 20,
  [DIFFICULTY_LEVELS.HARD]: 30
}

export const QUESTIONS_PER_QUIZ = 10

export function calculateScore(correctAnswers, difficulty) {
  return correctAnswers * POINTS[difficulty]
}

export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export async function fetchTriviaQuestions(difficulty = 'easy', amount = 5) {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=11&difficulty=${difficulty}&type=multiple`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const data = await response.json();
    
    if (data.response_code !== 0) {
      throw new Error('Invalid response from API');
    }

    // Transform the data to match our application's format
    return data.results.map(question => {
      // Combine correct and incorrect answers and shuffle them
      const options = [
        question.correct_answer,
        ...question.incorrect_answers
      ].sort(() => Math.random() - 0.5);

      return {
        question: question.question,
        options: options,
        correctAnswer: options.indexOf(question.correct_answer)
      };
    });
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    throw error;
  }
} 