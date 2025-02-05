const db = require("../db");
const { NotFoundError, DatabaseError } = require("../errors/customErrors");
const mapLevel = (response) => {
  switch (response) {
    case "Nothing, just starting and have no contact with the language.":
      return "none";
    case "I can understand TV shows or movies in the language.":
      return "beginner";
    case "I can read texts and understand the general sense.":
      return "intermediate";
    case "I can have simple conversations.":
      return "intermediate";
    case "I am advanced but want to perfect my skills.":
      return "advanced";
    default:
      return "none";
  }
};

const mapGoals = (goals) => {
  const goalMappings = {
    "I want to study or work in a country where this language is spoken.":
      "study_or_work",
    "I want to go there for a holiday.": "travel",
    "I want to learn new vocabulary.": "vocabulary",
    "I want to improve grammar.": "grammar",
  };
  return goals.map((goal) => goalMappings[goal] || goal);
};

const mapDomains = (domains) => {
  const domainMappings = {
    "Daily life": "daily_life",
    Work: "work",
    Travel: "traveling",
    "Social situations": "social_interactions",
  };
  return domains.map((domain) => domainMappings[domain] || domain);
};

// Generate course name based on preferences
const generateCourseName = (level, goals) => {
  const levelText = level.charAt(0).toUpperCase() + level.slice(1);
  const goalsText = goals.map((goal) => goal.replace("_", " ")).join(" and ");
  return `${levelText} course for ${goalsText}`;
};

const saveUserPreferences = async (request, reply) => {
  try {
    const userId = request.user.id;

    const { level, goals, domains, daily_lesson_commitment } = request.body; // 🔹 Added daily_lesson_commitment
    const current_level = mapLevel(level);
    const learning_goal = mapGoals(goals);
    const focus_areas = mapDomains(domains);

    const course_name = generateCourseName(current_level, learning_goal);

    const existingPreferences = await db("user_preferences")
      .where({ user_id: userId })
      .first();

    if (existingPreferences) {
      await db("user_preferences")
        .where({ user_id: userId })
        .update({
          current_level,
          learning_goal: JSON.stringify(learning_goal),
          focus_areas: JSON.stringify(focus_areas),
          daily_lesson_commitment: daily_lesson_commitment || 1, // 🔹 Ensure default value if not provided
          updated_at: new Date(),
        });

      await db("user_profiles").where({ user_id: userId }).update({
        course_name,
        level: current_level,
        updated_at: new Date(),
      });

      reply
        .status(200)
        .send({ message: "Preferences and profile updated successfully" });
    } else {
      await db("user_preferences").insert({
        user_id: userId,
        current_level,
        learning_goal: JSON.stringify(learning_goal),
        focus_areas: JSON.stringify(focus_areas),
        daily_lesson_commitment: daily_lesson_commitment || 1, // 🔹 Ensure default value if not provided
      });

      await db("user_profiles").insert({
        user_id: userId,
        course_name,
        level: current_level,
        progress: "0/10",
        streak: 0,
        current_lesson_id: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });

      reply
        .status(201)
        .send({ message: "Preferences and profile saved successfully" });
    }
  } catch (err) {
    throw new DatabaseError(
      "Failed to save preferences and update profile",
      err.message
    );
  }
};

const getUserPreferences = async (request, reply) => {
  try {
    const userId = request.user.id;
    const preferences = await db("user_preferences")
      .where({ user_id: userId })
      .first();
    if (!preferences) {
      throw new NotFoundError("User preferences not found", { userId });
    }
    reply.send({preferences});
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to fetch user preferences", err.message);
  }
};

module.exports = {
  saveUserPreferences,
  getUserPreferences,
};
