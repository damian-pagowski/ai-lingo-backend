const Joi = require("joi");
const validateRequest = require("../../middleware/validateRequest");
const { ValidationError } = require("../../errors/customErrors");

describe("validateRequest Middleware", () => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .messages({ "any.required": "Name is required" }),
    email: Joi.string()
      .email()
      .required()
      .messages({ "string.email": "Email must be a valid email address" }),
  });

  let requestMock;

  beforeEach(() => {
    requestMock = {
      body: {},
    };
  });

  it("should allow valid request data", async () => {
    requestMock.body = {
      name: "John",
      email: "john@example.com",
    };

    await expect(
      validateRequest(schema)(requestMock, {})
    ).resolves.not.toThrow();
  });

  it("should throw ValidationError for missing required fields", async () => {
    requestMock.body = {
      email: "john@example.com",
    };

    await expect(validateRequest(schema)(requestMock, {})).rejects.toThrow(
      ValidationError
    );
    await expect(validateRequest(schema)(requestMock, {})).rejects.toThrow(
      "Validation failed"
    );
    await expect(
      validateRequest(schema)(requestMock, {})
    ).rejects.toMatchObject({
      details: ["Name is required"],
    });
  });

  it("should throw ValidationError for invalid email format", async () => {
    requestMock.body = {
      name: "John",
      email: "invalid-email",
    };

    await expect(validateRequest(schema)(requestMock, {})).rejects.toThrow(
      ValidationError
    );
    await expect(validateRequest(schema)(requestMock, {})).rejects.toThrow(
      "Validation failed"
    );
    await expect(
      validateRequest(schema)(requestMock, {})
    ).rejects.toMatchObject({
      details: ["Email must be a valid email address"],
    });
  });

  it("should throw ValidationError for multiple errors", async () => {
    requestMock.body = {};

    await expect(validateRequest(schema)(requestMock, {})).rejects.toThrow(
      ValidationError
    );
    await expect(validateRequest(schema)(requestMock, {})).rejects.toThrow(
      "Validation failed"
    );
    await expect(
      validateRequest(schema)(requestMock, {})
    ).rejects.toMatchObject({
      details: ["Name is required", '"email" is required'],
    });
  });
});
