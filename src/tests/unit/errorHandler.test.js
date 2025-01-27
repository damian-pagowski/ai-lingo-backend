const errorHandler = require('../../middleware/errorHandler');
const { AppError } = require('../../errors/customErrors');

describe('Error Handler Middleware', () => {
  let mockRequest, mockReply;

  beforeEach(() => {
    mockRequest = { log: { error: jest.fn() } };
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it('should handle AppError correctly', () => {
    const error = new AppError('Resource not found', 404);

    errorHandler(error, mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(404);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: true,
      message: 'Resource not found',
    });
  });

  it('should handle AppError with details correctly', () => {
    const error = new AppError('Validation failed', 400, {
      field: 'email',
      message: 'Invalid email',
    });

    errorHandler(error, mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: true,
      message: 'Validation failed',
      details: { field: 'email', message: 'Invalid email' },
    });
  });

  it('should handle validation errors correctly', () => {
    const error = { validation: [{ message: 'Invalid input' }, { message: 'Required field missing' }] };

    errorHandler(error, mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: true,
      message: 'Validation error',
      details: ['Invalid input', 'Required field missing'],
    });
  });

  it('should handle unexpected errors correctly', () => {
    const error = new Error('Something went wrong');

    errorHandler(error, mockRequest, mockReply);

    expect(mockRequest.log.error).toHaveBeenCalledWith('Unexpected Error:', error);
    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: true,
      message: 'Something went wrong',
    });
  });
});