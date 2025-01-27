const db = require("../../db");
const bcrypt = require("bcrypt");
const {
  createUser,
  getUsers,
  updateUserRole,
  updateOwnProfile,
} = require("../../controllers/userController");
const {
  ValidationError,
  NotFoundError,
  DatabaseError,
} = require("../../errors/customErrors");

jest.mock("../../db", () => jest.fn());

describe("User Controller Tests", () => {
  let mockReply;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReply = { send: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      db.mockImplementation(() => ({
        insert: jest.fn().mockResolvedValue([1]),
      }));

      const request = {
        body: { name: "John Doe", email: "john@example.com" },
      };

      await createUser(request, mockReply);

      expect(db).toHaveBeenCalledWith("users");
      expect(mockReply.send).toHaveBeenCalledWith({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      });
    });

    it("should throw ValidationError if name or email is missing", async () => {
      const request = { body: { name: "", email: "" } };

      await expect(createUser(request, mockReply)).rejects.toThrow(ValidationError);
    });

    it("should throw DatabaseError on DB failure", async () => {
      db.mockImplementation(() => ({
        insert: jest.fn().mockRejectedValue(new Error("DB failure")),
      }));

      const request = {
        body: { name: "John Doe", email: "john@example.com" },
      };

      await expect(createUser(request, mockReply)).rejects.toThrow(DatabaseError);
    });
  });

  describe("getUsers", () => {
    it("should fetch all users", async () => {
      db.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue([
          { id: 1, name: "Alice", email: "alice@example.com", role: "user" },
        ]),
      }));

      const request = {};

      await getUsers(request, mockReply);

      expect(db).toHaveBeenCalledWith("users");
      expect(mockReply.send).toHaveBeenCalledWith([
        { id: 1, name: "Alice", email: "alice@example.com", role: "user" },
      ]);
    });

    it("should throw DatabaseError if fetching fails", async () => {
      db.mockImplementation(() => ({
        select: jest.fn().mockRejectedValue(new Error("DB failure")),
      }));

      const request = {};

      await expect(getUsers(request, mockReply)).rejects.toThrow(DatabaseError);
    });
  });

  describe("updateUserRole", () => {
    it("should update user role successfully", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(1),
      }));

      const request = { params: { id: 1 }, body: { role: "admin" } };

      await updateUserRole(request, mockReply);

      expect(mockReply.send).toHaveBeenCalledWith({ id: 1, role: "admin" });
    });

    it("should throw ValidationError if role is missing", async () => {
      const request = { params: { id: 1 }, body: {} };

      await expect(updateUserRole(request, mockReply)).rejects.toThrow(ValidationError);
    });

    it("should throw NotFoundError if user does not exist", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(0),
      }));

      const request = { params: { id: 99 }, body: { role: "admin" } };

      await expect(updateUserRole(request, mockReply)).rejects.toThrow(NotFoundError);
    });

    it("should throw DatabaseError if update fails", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockRejectedValue(new Error("DB failure")),
      }));

      const request = { params: { id: 1 }, body: { role: "admin" } };

      await expect(updateUserRole(request, mockReply)).rejects.toThrow(DatabaseError);
    });
  });

  describe("updateOwnProfile", () => {
    it("should update user profile successfully", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue(1),
      }));

      const request = {
        user: { id: 1 },
        body: { name: "New Name", email: "new@example.com" },
      };

      await updateOwnProfile(request, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Profile updated successfully",
      });
    });

    it("should throw ValidationError if name or email is missing", async () => {
      const request = { user: { id: 1 }, body: {} };

      await expect(updateOwnProfile(request, mockReply)).rejects.toThrow(ValidationError);
    });

    it("should throw NotFoundError if user not found", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(0),
        first: jest.fn().mockResolvedValue(0),
      }));

      const request = {
        user: { id: 99 },
        body: { name: "John Doe", email: "john@example.com" },
      };

      await expect(updateOwnProfile(request, mockReply)).rejects.toThrow(NotFoundError);
    });

    it("should throw DatabaseError if update fails", async () => {
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockRejectedValue(new Error("DB failure")),
      }));

      const request = {
        user: { id: 1 },
        body: { name: "John Doe", email: "john@example.com" },
      };

      await expect(updateOwnProfile(request, mockReply)).rejects.toThrow(DatabaseError);
    });
  });
});