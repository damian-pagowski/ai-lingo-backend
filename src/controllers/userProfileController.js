const db = require('../db');

const getUserProfile = async (request, reply) => {
    try {
        const userId = request.user.id;

        const user = await db('users')
            .select('id', 'name', 'email', 'role', 'created_at')
            .where({ id: userId })
            .first();

        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }

        const userProfile = await db('user_profiles')
            .select('course_name', 'level', 'progress', 'streak', 'current_lesson_id')
            .where({ user_id: userId })
            .first();

        if (!userProfile) {
            return reply.status(404).send({ error: 'User profile not found' });
        }

        const mergedProfile = {
            ...user,
            ...userProfile
        };

        reply.send(mergedProfile);
    } catch (err) {
        reply.status(500).send({ error: 'Failed to fetch user profile' });
    }
};

const createUserProfile = async (request, reply) => {
    try {
        const userId = request.user.id;
        const { course_name, level, progress, streak, current_lesson_id } = request.body;

        const existingProfile = await db('user_profiles')
            .where({ user_id: userId })
            .first();

        if (existingProfile) {
            return reply.status(400).send({ error: 'User profile already exists' });
        }

        await db('user_profiles').insert({
            user_id: userId,
            course_name,
            level,
            progress: progress || '0/0', 
            streak: streak || 0,
            current_lesson_id
        });

        reply.status(201).send({ message: 'User profile created successfully' });
    } catch (err) {
        reply.status(500).send({ error: 'Failed to create user profile' });
    }
};

module.exports = { getUserProfile, createUserProfile };