const {
  addProgress,
  getProgressByUser,
  updateProgress,
  deleteProgress,
  getProgressByLesson,
} = require("../../controllers/progressController");
const db = require("../../db");
const {
  DatabaseError,
  NotFoundError,
  ValidationError,
} = require("../../errors/customErrors");

jest.mock("../../db");

describe("Progress Controller", () => {
  let request, reply;

  beforeEach(() => {
    jest.clearAllMocks();

    request = {
      body: {},
      params: {},
    };
    reply = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe("addProgress", () => {
    it("should add progress and return the progress data", async () => {
      request.body = {
        user_id: 1,
        lesson_id: 1,
        completed: true,
      };

      db.mockReturnValue({
        insert: jest.fn().mockResolvedValue([1]),
      });

      await addProgress(request, reply);

      expect(db().insert).toHaveBeenCalledWith({
        user_id: 1,
        lesson_id: 1,
        completed: true,
      });
      expect(reply.send).toHaveBeenCalledWith({
        id: 1,
        user_id: 1,
        lesson_id: 1,
        completed: true,
      });
    });

    it("should throw a ValidationError if required fields are missing", async () => {
      request.body = {
        user_id: 1,
      };

      await expect(addProgress(request, reply)).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw a DatabaseError if db.insert fails", async () => {
      request.body = {
        user_id: 1,
        lesson_id: 1,
        completed: true,
      };

      db.mockReturnValue({
        insert: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await expect(addProgress(request, reply)).rejects.toThrow(DatabaseError);
    });
  });

  describe("getProgressByUser", () => {
    it("should fetch progress for a user", async () => {
      request.params = { userId: 1 };

      db.mockReturnValue({
        where: jest.fn().mockResolvedValue([
          { id: 1, user_id: 1, lesson_id: 1, completed: true },
          { id: 2, user_id: 1, lesson_id: 2, completed: false },
        ]),
        select: jest.fn().mockReturnThis(),
      });

      await getProgressByUser(request, reply);

      expect(db().where).toHaveBeenCalledWith({ user_id: 1 });
      expect(reply.send).toHaveBeenCalledWith([
        { id: 1, user_id: 1, lesson_id: 1, completed: true },
        { id: 2, user_id: 1, lesson_id: 2, completed: false },
      ]);
    });

    it("should throw a ValidationError if userId is missing", async () => {
      request.params = {};

      await expect(getProgressByUser(request, reply)).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw a NotFoundError if no progress is found", async () => {
      request.params = { userId: 1 };

      db.mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
        select: jest.fn().mockReturnThis(),
      });

      await expect(getProgressByUser(request, reply)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw a DatabaseError if db.where fails", async () => {
      request.params = { userId: 1 };

      db.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await expect(getProgressByUser(request, reply)).rejects.toThrow(
        DatabaseError
      );
    });
  });

  describe("updateProgress", () => {
    it("should update progress and return the updated progress", async () => {
      request.params = { id: 1 };
      request.body = { completed: true };

      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(1),
      });

      await updateProgress(request, reply);

      expect(db().where).toHaveBeenCalledWith({ id: 1 });
      expect(db().update).toHaveBeenCalledWith({ completed: true });
      expect(reply.send).toHaveBeenCalledWith({ id: 1, completed: true });
    });

    it("should throw a ValidationError if completed field is missing", async () => {
      request.params = { id: 1 };
      request.body = {};

      await expect(updateProgress(request, reply)).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw a NotFoundError if progress is not found", async () => {
      request.params = { id: 1 };
      request.body = { completed: true };

      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(0),
      });

      await expect(updateProgress(request, reply)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw a DatabaseError if db.update fails", async () => {
      request.params = { id: 1 };
      request.body = { completed: true };

      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await expect(updateProgress(request, reply)).rejects.toThrow(
        DatabaseError
      );
    });
  });

  describe("deleteProgress", () => {
    it("should delete progress and return a success message", async () => {
      request.params = { id: 1 };

      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockResolvedValue(1),
      });

      await deleteProgress(request, reply);

      expect(db().where).toHaveBeenCalledWith({ id: 1 });
      expect(db().del).toHaveBeenCalled();
      expect(reply.send).toHaveBeenCalledWith({
        message: "Progress deleted successfully",
      });
    });

    it("should throw a ValidationError if progressId is missing", async () => {
      request.params = {};

      await expect(deleteProgress(request, reply)).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw a NotFoundError if progress is not found", async () => {
      request.params = { id: 1 };

      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockResolvedValue(0),
      });

      await expect(deleteProgress(request, reply)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw a DatabaseError if db.del fails", async () => {
      request.params = { id: 1 };

      db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await expect(deleteProgress(request, reply)).rejects.toThrow(
        DatabaseError
      );
    });
  });

  describe("getProgressByLesson", () => {
    it("should fetch progress for a lesson", async () => {
      request.params = { lessonId: 1 };

      db.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([
          { id: 1, user_id: 1, lesson_id: 1, completed: true },
          { id: 2, user_id: 2, lesson_id: 1, completed: false },
        ]),
      });

      await getProgressByLesson(request, reply);

      expect(db().where).toHaveBeenCalledWith({ lesson_id: 1 });
      expect(reply.send).toHaveBeenCalledWith([
        { id: 1, user_id: 1, lesson_id: 1, completed: true },
        { id: 2, user_id: 2, lesson_id: 1, completed: false },
      ]);
    });

    it("should throw a ValidationError if lessonId is missing", async () => {
      request.params = {};

      await expect(getProgressByLesson(request, reply)).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw a NotFoundError if no progress is found", async () => {
      request.params = { lessonId: 1 };

      db.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      });

      await expect(getProgressByLesson(request, reply)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw a DatabaseError if db.where fails", async () => {
      request.params = { lessonId: 1 };

      db.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await expect(getProgressByLesson(request, reply)).rejects.toThrow(
        DatabaseError
      );
    });
  });
});
