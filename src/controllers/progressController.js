const db = require("../db");
const {
  NotFoundError,
  DatabaseError,
  ValidationError,
} = require("../errors/customErrors");

const addProgress = async (request, reply) => {
  const { user_id, lesson_id, completed } = request.body;

  try {
    if (!user_id || !lesson_id || completed === undefined) {
      throw new ValidationError("Missing required fields", {
        user_id,
        lesson_id,
        completed,
      });
    }

    const [id] = await db("progress").insert({ user_id, lesson_id, completed });
    reply.send({ id, user_id, lesson_id, completed });
  } catch (err) {
    if (err instanceof ValidationError) {
      throw err;
    }
    throw new DatabaseError("Failed to track progress", err.message);
  }
};

const getProgressByUser = async (request, reply) => {
  const { userId } = request.params;

  try {
    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    const progress = await db("progress").where({ user_id: userId });
    if (progress.length === 0) {
      throw new NotFoundError("No progress found for the given user", {
        userId,
      });
    }

    reply.send(progress);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to retrieve progress", err.message);
  }
};

const updateProgress = async (request, reply) => {
  const { id } = request.params;
  const { completed } = request.body;

  try {
    if (completed === undefined) {
      throw new ValidationError("Completed field is required");
    }

    const updatedRows = await db("progress")
      .where({ id })
      .update({ completed });
    if (!updatedRows) {
      throw new NotFoundError("Progress not found", { progressId: id });
    }

    reply.send({ id, completed });
  } catch (err) {
    if (err instanceof ValidationError || err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to update progress", err.message);
  }
};

const deleteProgress = async (request, reply) => {
  const { id } = request.params;

  try {
    if (!id) {
      throw new ValidationError("Progress ID is required");
    }

    const deletedRows = await db("progress").where({ id }).del();
    if (!deletedRows) {
      throw new NotFoundError("Progress not found", { progressId: id });
    }

    reply.send({ message: "Progress deleted successfully" });
  } catch (err) {
    if (err instanceof ValidationError || err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to delete progress", err.message);
  }
};

const getProgressByLesson = async (request, reply) => {
  const { lessonId } = request.params;

  try {
    if (!lessonId) {
      throw new ValidationError("Lesson ID is required");
    }

    const progress = await db("progress").where({ lesson_id: lessonId });
    if (progress.length === 0) {
      throw new NotFoundError("No progress found for the given lesson", {
        lessonId,
      });
    }

    reply.send(progress);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to retrieve lesson progress", err.message);
  }
};

module.exports = {
  getProgressByLesson,
  addProgress,
  getProgressByUser,
  updateProgress,
  deleteProgress,
};
