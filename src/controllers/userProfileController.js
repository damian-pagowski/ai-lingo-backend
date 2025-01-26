const db = require('../db');
const { NotFoundError, ValidationError, DatabaseError } = require('../errors/customErrors');

const getUserProfile = async (request, reply) => {
    try {
        const userId = request.user.id;

        const user = await db('users')
            .select('id', 'name', 'email', 'role', 'created_at')
            .where({ id: userId })
            .first();

        if (!user) {
            throw new NotFoundError('User not found', { userId });
        }

        // Fetch user profile
        const userProfile = await db('user_profiles')
            .select('course_name', 'level', 'progress', 'streak', 'current_lesson_id')
            .where({ user_id: userId })
            .first();

        if (!userProfile) {
            throw new NotFoundError('User profile not found', { userId });
        }

        reply.send({ ...user, ...userProfile });
    } catch (err) {
        if (err instanceof NotFoundError) {
            throw err;
        }
        throw new DatabaseError('Failed to fetch user profile', err.message);
    }
};

const createUserProfile = async (request, reply) => {
    try {
        const userId = request.user.id;
        const { course_name, level, progress, streak, current_lesson_id } = request.body;

        if (!course_name || !level || !current_lesson_id) {
            throw new ValidationError('Missing required fields', { course_name, level, current_lesson_id });
        }

        const existingProfile = await db('user_profiles')
            .where({ user_id: userId })
            .first();

        if (existingProfile) {
            throw new ValidationError('User profile already exists', { userId });
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
        if (err instanceof ValidationError) {
            throw err;
        }
        throw new DatabaseError('Failed to create user profile', err.message);
    }
};

const updateUserProfile = async (request, reply) => {
    try {
        const userId = request.user.id;
        const { course_name, level, progress, streak, current_lesson_id } = request.body;

        // Check if profile exists
        const existingProfile = await db('user_profiles')
            .where({ user_id: userId })
            .first();

        if (!existingProfile) {
            throw new NotFoundError('User profile not found', { userId });
        }

        // Update the user profile
        await db('user_profiles')
            .where({ user_id: userId })
            .update({
                course_name: course_name || existingProfile.course_name,
                level: level || existingProfile.level,
                progress: progress || existingProfile.progress,
                streak: streak || existingProfile.streak,
                current_lesson_id: current_lesson_id || existingProfile.current_lesson_id,
                updated_at: new Date()
            });

        reply.status(200).send({ message: 'User profile updated successfully' });
    } catch (err) {
        if (err instanceof NotFoundError) {
            throw err;
        }
        throw new DatabaseError('Failed to update user profile', err.message);
    }
};

module.exports = { getUserProfile, createUserProfile, updateUserProfile };