const authorizeRoles = require('../../middleware/authorizeRoles');
const { UnauthorizedError, ForbiddenError } = require('../../errors/customErrors');

describe('authorizeRoles middleware', () => {
    let mockRequest;

    beforeEach(() => {
        mockRequest = {
            jwtVerify: jest.fn(),
            user: { role: 'student' },
        };
    });

    it('should allow access when user has the correct role', async () => {
        const middleware = authorizeRoles(['student', 'admin']);

        await expect(middleware(mockRequest, {})).resolves.toBeUndefined();
    });

    it('should throw UnauthorizedError if no user object', async () => {
        mockRequest.user = null;
        const middleware = authorizeRoles(['student']);

        await expect(middleware(mockRequest, {})).rejects.toThrow(UnauthorizedError);
        await expect(middleware(mockRequest, {})).rejects.toThrow('User authentication failed');
    });

    it('should throw ForbiddenError if user role is not allowed', async () => {
        const middleware = authorizeRoles(['admin']);
        
        await expect(middleware(mockRequest, {})).rejects.toThrow(ForbiddenError);
        await expect(middleware(mockRequest, {})).rejects.toThrow('Access denied: insufficient permissions');
    });

    it('should throw UnauthorizedError when no authorization token is provided', async () => {
        mockRequest.jwtVerify.mockRejectedValue(new Error('No Authorization token'));
        const middleware = authorizeRoles(['student']);

        await expect(middleware(mockRequest, {})).rejects.toThrow(UnauthorizedError);
        await expect(middleware(mockRequest, {})).rejects.toThrow('No authentication token provided');
    });

    it('should throw ForbiddenError on unexpected errors', async () => {
        mockRequest.jwtVerify.mockRejectedValue(new Error('Unexpected error'));
        const middleware = authorizeRoles(['student']);

        await expect(middleware(mockRequest, {})).rejects.toThrow(ForbiddenError);
        await expect(middleware(mockRequest, {})).rejects.toThrow('Unauthorized access attempt');
    });
});