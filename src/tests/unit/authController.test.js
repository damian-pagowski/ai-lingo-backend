const { registerUser, loginUser } = require('../../controllers/authController');
const db = require('../../db');
const bcrypt = require('bcrypt');
const { DatabaseError, UnauthorizedError } = require('../../errors/customErrors');

jest.mock('../../db');
jest.mock('bcrypt');

describe('User Controller', () => {        
    let request, reply;

    beforeEach(() => {
        jest.clearAllMocks();
        request = {
            body: {},
            server: {
                jwt: {
                    sign: jest.fn().mockReturnValue('mockToken'),
                },
            },
        };
        reply = {
            send: jest.fn(),
        };
    });

    describe('registerUser', () => {
        it('should register a user and return the user data', async () => {
            request.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };
            bcrypt.hash.mockResolvedValue('hashedPassword');
            db.mockReturnValue({
                insert: jest.fn().mockResolvedValue([1]),
            });
            await registerUser(request, reply);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(db().insert).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedPassword',
            });
            expect(reply.send).toHaveBeenCalledWith({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
            });
        });

        it('should throw a DatabaseError if db.insert fails', async () => {
            request.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };
            bcrypt.hash.mockResolvedValue('hashedPassword');
            db.mockReturnValue({
                insert: jest.fn().mockRejectedValue(new Error('Database error')),
            });
            await expect(registerUser(request, reply)).rejects.toThrow(DatabaseError);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(db().insert).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedPassword',
            });
        });
    });

    describe('loginUser', () => {
        it('should login a user and return a token', async () => {
            request.body = {
                email: 'john@example.com',
                password: 'password123',
            };
            db.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue({
                    id: 1,
                    email: 'john@example.com',
                    password: 'hashedPassword',
                    role: 'user',
                }),
            });
            bcrypt.compare.mockResolvedValue(true);
            await loginUser(request, reply);
            expect(db().where).toHaveBeenCalledWith({ email: 'john@example.com' });
            expect(db().first).toHaveBeenCalled();
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(request.server.jwt.sign).toHaveBeenCalledWith({
                id: 1,
                email: 'john@example.com',
                role: 'user',
            });
            expect(reply.send).toHaveBeenCalledWith({ token: 'mockToken' });
        });

        it('should throw an UnauthorizedError if user is not found', async () => {
            request.body = {
                email: 'john@example.com',
                password: 'password123',
            };
            db.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(null),
            });
            await expect(loginUser(request, reply)).rejects.toThrow(UnauthorizedError);
            expect(db().where).toHaveBeenCalledWith({ email: 'john@example.com' });
            expect(db().first).toHaveBeenCalled();
        });

        it('should throw an UnauthorizedError if password is invalid', async () => {
            request.body = {
                email: 'john@example.com',
                password: 'password123',
            };
            db.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue({
                    id: 1,
                    email: 'john@example.com',
                    password: 'hashedPassword',
                    role: 'user',
                }),
            });
            bcrypt.compare.mockResolvedValue(false);
            await expect(loginUser(request, reply)).rejects.toThrow(UnauthorizedError);
            expect(db().where).toHaveBeenCalledWith({ email: 'john@example.com' });
            expect(db().first).toHaveBeenCalled();
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
        });
    });
});