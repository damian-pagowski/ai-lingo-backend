const db = require("../db");
const { DatabaseError, NotFoundError } = require("../errors/customErrors");

const createLesson = async (request, reply) => {
  const { title, content, difficulty, user_id } = request.body;
  try {
    const [id] = await db("lessons").insert({
      title,
      content,
      difficulty,
      user_id,
    });
    reply.send({ id, title, content, difficulty, user_id });
  } catch (err) {
    throw new DatabaseError("Failed to create lesson", err.message);
  }
};

const getLessons = async (request, reply) => {
  const {
    page = 1,
    limit = 10,
    difficulty,
    sort = "created_at",
    order = "desc",
  } = request.query;
  try {
    let query = db("lessons").select("*");
    if (difficulty) {
      query = query.where("difficulty", difficulty);
    }
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);
    query = query.orderBy(sort, order);
    const lessons = await query;
    reply.send(lessons);
  } catch (err) {
    throw new DatabaseError("Failed to fetch lessons", err.message);
  }
};

const getLessonById = async (req, reply) => {
  const { id } = req.params;

  try {
    const lesson = await db("lessons").where({ id }).first();

    if (!lesson) {
      throw new NotFoundError("Lesson not found", { lessonId: id });
    }
    
    const exercises = await db("exercises")
      .where({ lesson_id: id })
      .select("id", "question", "type", "options", "correct_answer");

    reply.send({ ...lesson, exercises });
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to fetch lesson", err.message);
  }
};

const updateLesson = async (request, reply) => {
  const { id } = request.params;
  const { title, content, difficulty } = request.body;
  try {
    const updatedRows = await db("lessons")
      .where({ id })
      .update({ title, content, difficulty });
    if (!updatedRows) {
      throw new NotFoundError("Lesson not found");
    }

    const updatedLesson = {
      id: parseInt(id),
      title,
      content,
      difficulty,
    };

    reply.send(updatedLesson);
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to update lesson", err.message);
  }
};

const deleteLesson = async (request, reply) => {
    const { id } = request.params;
    try {
      const deletedRows = await db('lessons').where({ id }).del();
      if (!deletedRows) {
        throw new NotFoundError('Lesson not found', { lessonId: id });
      }
      reply.send({ message: 'Lesson deleted successfully' });
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new DatabaseError('Failed to delete lesson', err.message);
    }
  };

module.exports = {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
};
