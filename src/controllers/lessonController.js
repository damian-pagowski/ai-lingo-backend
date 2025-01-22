const db = require('../db');

const createLesson = async (request, reply) => {
    const { title, content, difficulty, user_id } = request.body;

    try {
        const [id] = await db('lessons').insert({ title, content, difficulty, user_id });
        reply.send({ id, title, content, difficulty, user_id });
    } catch (err) {
        reply.status(500).send({ error: 'Failed to create lesson' });
    }
};

const getLessons = async (request, reply) => {
    const { page = 1, limit = 10, difficulty } = request.query;

    try {
        let query = db('lessons').select('*').limit(limit).offset((page - 1) * limit);

        if (difficulty) {
            query = query.where('difficulty', difficulty);
        }

        const lessons = await query;
        reply.send(lessons);
    } catch (err) {
        reply.status(500).send({ error: 'Failed to fetch lessons' });
    }
};

const getLessonById = async (request, reply) => {
    const { id } = request.params;

    try {
        const lesson = await db('lessons').where({ id }).first();
        if (!lesson) {
            return reply.status(404).send({ error: 'Lesson not found' });
        }
        reply.send(lesson);
    } catch (err) {
        reply.status(500).send({ error: 'Failed to fetch lesson' });
    }
};

const updateLesson = async (request, reply) => {
    const { id } = request.params;
    const { title, content, difficulty } = request.body;
    try {
        const updatedRows = await db('lessons')
            .where({ id })
            .update({ title, content, difficulty });
    
        if (!updatedRows) {
            return reply.status(404).send({ error: 'Lesson not found' });
        }
    
        const updatedLesson = {
            id: parseInt(id),
            title,
            content,
            difficulty
        };
    
        reply.send(updatedLesson);
    } catch (err) {
        reply.status(500).send({ error: 'Failed to update lesson' });
    }
};

const deleteLesson = async (request, reply) => {
    const { id } = request.params;

    try {
        const deletedRows = await db('lessons').where({ id }).del();
        if (!deletedRows) {
            return reply.status(404).send({ error: 'Lesson not found' });
        }
        reply.send({ message: 'Lesson deleted successfully' });
    } catch (err) {
        reply.status(500).send({ error: 'Failed to delete lesson' });
    }
};

module.exports = {
    createLesson,
    getLessons,
    getLessonById,
    updateLesson,
    deleteLesson
};