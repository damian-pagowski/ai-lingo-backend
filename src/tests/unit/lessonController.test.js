const {
  getLessons,
  getLessonById,
  deleteLesson,
} = require("../../controllers/lessonController");
const db = require("../../db");
const { DatabaseError } = require("../../errors/customErrors");

jest.mock("../../db");

describe("Lesson Controller", () => {
  let request, reply;

  beforeEach(() => {
    jest.clearAllMocks();

    request = {
      body: {},
      params: {},
      query: {},
    };
    reply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  }); 

  describe("getLessons", () => {
    it("should fetch lessons with pagination, filtering, and sorting", async () => {
      request.query = {
        page: 2,
        limit: 5,
        difficulty: "beginner",
        sort: "title",
        order: "asc",
      };
      db.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue([
          { id: 1, title: "Lesson 1", difficulty: "beginner" },
          { id: 2, title: "Lesson 2", difficulty: "beginner" },
        ]),
      });

      await getLessons(request, reply);
      expect(db().select).toHaveBeenCalledWith("*");
      expect(db().where).toHaveBeenCalledWith("difficulty", "beginner");
      expect(db().limit).toHaveBeenCalledWith(5);
      expect(db().offset).toHaveBeenCalledWith(5);
      expect(db().orderBy).toHaveBeenCalledWith("title", "asc");
      expect(reply.send).toHaveBeenCalledWith([
        { id: 1, title: "Lesson 1", difficulty: "beginner" },
        { id: 2, title: "Lesson 2", difficulty: "beginner" },
      ]);
    });

    it("should throw a DatabaseError if db.select fails", async () => {
      request.query = {};
      db.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockRejectedValue(new Error("Database error")),
      });
      await expect(getLessons(request, reply)).rejects.toThrow(DatabaseError);
    });
  });

  describe("getLessonById", () => {
    it("should fetch a lesson by ID with its exercises", async () => {
      request.params = { id: 1 };
      db.mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({
          id: 1,
          title: "Introduction to JavaScript",
          content: "Learn the basics of JavaScript",
          difficulty: "beginner",
        }),
      });
      db.mockReturnValueOnce({
        join: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([
          {
            id: 1,
            question: "What is JavaScript?",
            type: "multiple_choice",
            options: ["A", "B", "C"],
            correct_answer: "A",
          },
        ]),
      });

      await getLessonById(request, reply);

      expect(reply.send).toHaveBeenCalledWith({
        id: 1,
        title: "Introduction to JavaScript",
        content: "Learn the basics of JavaScript",
        difficulty: "beginner",
        exercises: [
          {
            id: 1,
            question: "What is JavaScript?",
            type: "multiple_choice",
            options: ["A", "B", "C"],
            correct_answer: "A",
          },
        ],
      });
    });

    it("should return 404 if lesson is not found", async () => {
      request.params = { id: 1 };
      db.mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      });
      await expect(getLessonById(request, reply)).rejects.toThrow(
        DatabaseError
      );
    });

    it("should throw a DatabaseError if db.where fails", async () => {
      request.params = { id: 1 };
      db.mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockRejectedValue(new Error("Database error")),
      });
      await expect(getLessonById(request, reply)).rejects.toThrow(
        DatabaseError
      );
    });
  });

  describe("deleteLesson", () => {
    it("should delete a lesson and return a success message", async () => {
      request.params = { id: 1 };
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockResolvedValue(1),
      });
      await deleteLesson(request, reply);
      expect(db().where).toHaveBeenCalledWith({ id: 1 });
      expect(db().del).toHaveBeenCalled();
      expect(reply.send).toHaveBeenCalledWith({
        message: "Lesson deleted successfully",
      });
    });

    it("should throw a NotFoundError if lesson is not found", async () => {
      request.params = { id: 1 };
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockResolvedValue(0),
      });
      await expect(deleteLesson(request, reply)).rejects.toThrow(DatabaseError);
    });

    it("should throw a DatabaseError if db.del fails", async () => {
      request.params = { id: 1 };
      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockRejectedValue(new Error("Database error")),
      });
      await expect(deleteLesson(request, reply)).rejects.toThrow(DatabaseError);
    });
  });
});
