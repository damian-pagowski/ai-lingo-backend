const db = require("../db");
const { NotFoundError, BadRequestError } = require("../errors/customErrors");

const voteExercise = async (exerciseId, voteType) => {
  if (!["upvote", "downvote"].includes(voteType)) {
    throw new BadRequestError("Invalid vote type");
  }

  const exercise = await db("exercises").where({ id: exerciseId }).first();
  if (!exercise) {
    throw new NotFoundError("Exercise not found");
  }

  const scoreChange = voteType === "upvote" ? 1 : -1;
  await db("exercises")
    .where({ id: exerciseId })
    .increment("score", scoreChange);

  return db("exercises").where({ id: exerciseId }).first();
};

const fetchExercises = async (
  focusAreas,
  difficultyRange,
  allowedTypes,
  limit = 10
) => {
  return db("exercises")
    .whereIn("topic", focusAreas)
    .whereBetween("difficulty", difficultyRange)
    .whereIn("type", allowedTypes)
    .orderByRaw("RANDOM()")
    .limit(limit);
};
module.exports = { voteExercise, fetchExercises };
