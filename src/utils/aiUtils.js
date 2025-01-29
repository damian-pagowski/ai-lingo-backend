const generateLessonsPrompt = async (
  level,
  goal,
  areas,
  targetLanguage = "German",
  exercisesPerLesson = 5
) => {
  const prompt = `
      Generate a structured JSON object for a language lesson in ${targetLanguage}.
      The lesson should be designed for a ${level} learner focused on ${goal}.
      The lesson should include content on these topics: ${areas}.
      
      Structure:
      {
        "title": "Lesson Title in ${targetLanguage}",
        "content": "Lesson content in ${targetLanguage}, teaching key concepts.",
        "difficulty": "${level}",
        "status": "not_started",
        "exercises": [
          {
            "question": "Exercise question in ${targetLanguage}",
            "type": "multiple_choice" or "fill_in_the_blank",
            "options": ["Option1", "Option2", "Option3"] or null for fill-in-the-blank,
            "correct_answer": "Correct answer in ${targetLanguage}"
          },
          ...
        ]
      }

      Make sure to return exactly ${exercisesPerLesson} exercises.
      Ensure responses are well-structured JSON and avoid extra text.
    `;
  return prompt;
};

module.exports = { generateLessonsPrompt };
