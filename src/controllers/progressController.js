const db = require('../db');

// Mark lesson as completed
const addProgress = async (request, reply) => {
    const { user_id, lesson_id, completed } = request.body;

    try {
        const [id] = await db('progress').insert({ user_id, lesson_id, completed });
        reply.send({ id, user_id, lesson_id, completed });
    } catch (err) {
        reply.status(500).send({ error: 'Failed to track progress' });
    }
};

// Get all progress for a user
const getProgressByUser = async (request, reply) => {
    const { userId } = request.params;

    try {
        const progress = await db('progress').where({ user_id: userId });
        reply.send(progress);
    } catch (err) {
        reply.status(500).send({ error: 'Failed to retrieve progress' });
    }
};

// Update lesson progress (e.g., mark as completed)
const updateProgress = async (request, reply) => {
    const { id } = request.params;
    const { completed } = request.body;

    try {
        const updatedRows = await db('progress').where({ id }).update({ completed });
        if (!updatedRows) {
            return reply.status(404).send({ error: 'Progress not found' });
        }

        reply.send({ id, completed });
    } catch (err) {
        reply.status(500).send({ error: 'Failed to update progress' });
    }
};

// Delete progress record
const deleteProgress = async (request, reply) => {
    const { id } = request.params;

    try {
        const deletedRows = await db('progress').where({ id }).del();
        if (!deletedRows) {
            return reply.status(404).send({ error: 'Progress not found' });
        }

        reply.send({ message: 'Progress deleted successfully' });
    } catch (err) {
        reply.status(500).send({ error: 'Failed to delete progress' });
    }
};

const getProgressByLesson = async (request, reply) => {
    const { lessonId } = request.params;
    try {
        const progress = await db('progress').where({ lesson_id: lessonId });
        reply.send(progress);
    } catch (err) {
        reply.status(500).send({ error: 'Failed to retrieve lesson progress' });
    }
};

module.exports = {
    getProgressByLesson,
    addProgress,
    getProgressByUser,
    updateProgress,
    deleteProgress
};