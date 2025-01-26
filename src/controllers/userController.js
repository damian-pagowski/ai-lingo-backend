const db = require("../db");
const {
  ValidationError,
  NotFoundError,
  DatabaseError,
} = require("../errors/customErrors");

const createUser = async (request, reply) => {
  const { name, email } = request.body;

  try {
    if (!name || !email) {
      throw new ValidationError("Name and email are required", { name, email });
    }

    const [id] = await db("users").insert({ name, email });

    const newUser = { id, name, email };
    reply.send(newUser);
  } catch (err) {
    if (err instanceof ValidationError) {
      throw err;
    }
    throw new DatabaseError("Failed to add user", err.message);
  }
};

const getUsers = async (request, reply) => {
  try {
    const users = await db("users").select(
      "id",
      "name",
      "email",
      "role",
      "created_at"
    );
    reply.send(users);
  } catch (err) {
    throw new DatabaseError("Failed to fetch users", err.message);
  }
};

const updateUserRole = async (request, reply) => {
  const { id } = request.params;
  const { role } = request.body;

  try {
    if (!role) {
      throw new ValidationError("Role is required");
    }

    const updatedRows = await db("users").where({ id }).update({ role });

    if (!updatedRows) {
      throw new NotFoundError("User not found", { userId: id });
    }

    reply.send({ id, role });
  } catch (err) {
    if (err instanceof ValidationError || err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to update user role", err.message);
  }
};

const updateOwnProfile = async (request, reply) => {
  try {
    const userId = request.user.id;
    const { email, name } = request.body;

    if (!email || !name) {
      throw new ValidationError("Email and name are required", { email, name });
    }

    const existingUser = await db("users")
      .where({ email })
      .andWhere("id", "!=", userId)
      .first();

    if (existingUser) {
      throw new ValidationError("Email is already taken", { email });
    }

    const updatedRows = await db("users").where({ id: userId }).update({
      email,
      name,
    });

    if (!updatedRows) {
      throw new NotFoundError("User not found", { userId });
    }

    reply.status(200).send({ message: "Profile updated successfully" });
  } catch (err) {
    if (err instanceof ValidationError || err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to update profile", err.message);
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUserRole,
  updateOwnProfile,
};
