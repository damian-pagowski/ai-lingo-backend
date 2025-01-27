const db = require("../../db");
const {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
} = require("../../controllers/userProfileController");
const {
  NotFoundError,
  ValidationError,
  DatabaseError,
} = require("../../errors/customErrors");

jest.mock("../../db", () => jest.fn());

describe("UserProfile Controller Tests", () => {
  let mockReply;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReply = { send: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  describe("getUserProfile", () => {

    it("should return user profile successfully", async () => {
      db.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest
          .fn()
          .mockResolvedValueOnce({
            id: 1,
            name: "Damian",
            email: "damian@example.com",
            role: "student",
            created_at: "2024-01-01",
          })
          .mockResolvedValueOnce({
            course_name: "Spanish for Beginners",
            level: "A1",
            progress: "5/10",
            streak: 7,
            current_lesson_id: 2,
          }),
      }));
    
      const request = { user: { id: 1 } };
    
      await getUserProfile(request, mockReply);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: "Damian",
          email: "damian@example.com",
          role: "student",
          created_at: "2024-01-01",
        })
      );
    });

    it("should throw NotFoundError when user is not found", async () => {
      db.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      }));

      const request = { user: { id: 99 } };

      await expect(getUserProfile(request, mockReply)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw DatabaseError on failure", async () => {
      db.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockRejectedValue(new Error("DB failure")),
      }));

      const request = { user: { id: 1 } };

      await expect(getUserProfile(request, mockReply)).rejects.toThrow(
        DatabaseError
      );
    });
  });

  describe("createUserProfile", () => {
    it("should create user profile successfully", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
        insert: jest.fn().mockResolvedValue([1]),
      }));

      const request = {
        user: { id: 1 },
        body: {
          course_name: "Spanish for Beginners",
          level: "A1",
          progress: "5/10",
          streak: 7,
          current_lesson_id: 2,
        },
      };

      await createUserProfile(request, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "User profile created successfully",
      });
    });

    it("should throw ValidationError when required fields are missing", async () => {
      const request = {
        user: { id: 1 },
        body: { course_name: "", level: "", current_lesson_id: null },
      };

      await expect(createUserProfile(request, mockReply)).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError if user profile already exists", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ user_id: 1 }),
      }));

      const request = {
        user: { id: 1 },
        body: {
          course_name: "Spanish for Beginners",
          level: "A1",
          progress: "5/10",
          streak: 7,
          current_lesson_id: 2,
        },
      };

      await expect(createUserProfile(request, mockReply)).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw DatabaseError on DB failure", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockRejectedValue(new Error("DB failure")),
      }));

      const request = {
        user: { id: 1 },
        body: {
          course_name: "Spanish for Beginners",
          level: "A1",
          progress: "5/10",
          streak: 7,
          current_lesson_id: 2,
        },
      };

      await expect(createUserProfile(request, mockReply)).rejects.toThrow(
        DatabaseError
      );
    });
  });

  describe("updateUserProfile", () => {
    it("should update user profile successfully", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({
          course_name: "Spanish for Beginners",
          level: "A1",
          progress: "5/10",
          streak: 7,
          current_lesson_id: 2,
        }),
        update: jest.fn().mockResolvedValue(1),
      }));

      const request = {
        user: { id: 1 },
        body: {
          course_name: "Updated Course",
          level: "A2",
          progress: "6/10",
          streak: 10,
          current_lesson_id: 3,
        },
      };

      await updateUserProfile(request, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "User profile updated successfully",
      });
    });

    it("should throw NotFoundError if user profile does not exist", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      }));

      const request = {
        user: { id: 1 },
        body: {
          course_name: "Updated Course",
          level: "A2",
          progress: "6/10",
          streak: 10,
          current_lesson_id: 3,
        },
      };

      await expect(updateUserProfile(request, mockReply)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw DatabaseError on DB failure", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockRejectedValue(new Error("DB failure")),
      }));

      const request = {
        user: { id: 1 },
        body: {
          course_name: "Updated Course",
          level: "A2",
          progress: "6/10",
          streak: 10,
          current_lesson_id: 3,
        },
      };

      await expect(updateUserProfile(request, mockReply)).rejects.toThrow(
        DatabaseError
      );
    });
  });
});
