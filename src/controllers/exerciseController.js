const { DatabaseError } = require("../errors/customErrors");

const {
  voteExercise,
  getExerciseById,
} = require("../services/exerciseService");

const getExercise = async (req, reply) => {
  try {
    const exercise = await getExerciseById(req.params.id);
    reply.send(exercise);
  } catch (err) {
    throw new DatabaseError("Failed to fetch exercise", err.message);
  }
};
const gradeExercise = async (req, reply) => {
  try {
    reply.send({ result: 1 });
  } catch (err) {
    throw new DatabaseError("Failed to fetch lesson", err.message);
  }
};

const voteExerciseHandler = async (req, reply) => {
  try {
    const { exerciseId, voteType } = req.body;
    const updatedExercise = await voteExercise(exerciseId, voteType);
    reply.send({
      message: `Exercise ${voteType}d successfully`,
      exerciseId: exerciseId,
      newScore: updatedExercise.score,
    });
  } catch (err) {
    throw new DatabaseError("Failed to process vote", err.message);
  }
};

module.exports = {
  getExercise,
  gradeExercise,
  voteExercise: voteExerciseHandler,
};
