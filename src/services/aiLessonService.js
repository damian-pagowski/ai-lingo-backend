const openai = require('openai'); // OpenAI client configured

const generateLessons = async ({ level, goals, areas }) => {
    const prompt = `
        Generate a JSON object for ${level} learners.
        Focus on goals: ${goals.join(', ')}, and domains: ${areas.join(', ')}.
        Follow this format:
        {
            "id": <unique_id>,
            "title": <lesson_title>,
            "content": <lesson_content>,
            "difficulty": <beginner | intermediate | advanced>,
            "status": <not_started | in_progress | completed>,
            "exercises": [
                {
                    "id": <unique_id>,
                    "question": <exercise_question>,
                    "type": <multiple_choice | fill_in_the_blank>,
                    "options": [<array_of_options_if_multiple_choice>],
                    "correct_answer": <correct_answer>
                }
            ]
        }
        Generate 3 lessons.`;
    
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 1500,
        temperature: 0.7
    });

    return JSON.parse(response.data.choices[0].text.trim());
};

module.exports = { generateLessons };