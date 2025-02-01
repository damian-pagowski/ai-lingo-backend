const db = require('../db');
const { NotFoundError, ValidationError, DatabaseError } = require('../errors/customErrors');

const submitAnswers = async (request, reply) => {
    try {
        const userId = request.user.id;
        const { lessonId, answers } = request.body;

        if (!lessonId || !answers || typeof answers !== 'object') {
            throw new ValidationError('Invalid request data', { lessonId, answers });
        }

        // Fetch the lesson and exercises
        const lesson = await db('lessons').where({ id: lessonId }).first();
        if (!lesson) {
            throw new NotFoundError('Lesson not found', { lessonId });
        }

        const exercises = await db('exercises')
            .whereIn('id', Object.keys(answers))
            .select('id', 'type', 'correct_answer');

        if (!exercises.length) {
            throw new NotFoundError('Exercises not found for the given lesson', { lessonId });
        }

        // Evaluate answers
        let correctCount = 0;
        const results = exercises.map((exercise) => {
            const userAnswer = answers[exercise.id];
            const isCorrect = userAnswer.trim().toLowerCase() === exercise.correct_answer.toLowerCase();
            if (isCorrect) {correctCount++;}

            return {
                exerciseId: exercise.id,
                question: exercise.question,
                userAnswer,
                correctAnswer: exercise.correct_answer,
                isCorrect,
            };
        });

        const totalExercises = exercises.length;
        const scorePercentage = Math.round((correctCount / totalExercises) * 100);

        // Store progress
        await db('progress').insert({
            user_id: userId,
            lesson_id: lessonId,
            score: scorePercentage,
            completed: true,
            created_at: new Date(),
        });

        // Send response
        reply.  send({
            lessonId,
            score: scorePercentage,
            totalQuestions: totalExercises,
            correctAnswers: correctCount,
            results,
        });
    } catch (err) {
        if (err instanceof ValidationError || err instanceof NotFoundError) {
            throw err;
        }
        throw new DatabaseError('Failed to process answers', err.message);
    }
};

module.exports = { submitAnswers };