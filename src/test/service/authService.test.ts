import { AuthService } from '../../service/authService';
import { UserRepository } from '../../repository/userRepository';
import { User } from '../../entity/user.entity';
import AppError from '../../utils/appError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginRequestModel } from '../../model/authModel';

// Mock dependencies
jest.mock('../../repository/userRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let bcryptCompareMock: jest.Mock;
  let jwtSignMock: jest.Mock;
  let jwtVerifyMock: jest.Mock;

  beforeEach(() => {
    // Create new mock instances for each test
    userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
    bcryptCompareMock = bcrypt.compare as jest.Mock;
    jwtSignMock = jwt.sign as jest.Mock;
    jwtVerifyMock = jwt.verify as jest.Mock;
    
    // Instantiate AuthService and manually assign the mock repository
    authService = new AuthService();
    authService.userRepository = userRepositoryMock;
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  // Test for login
  describe('login', () => {
    const loginPayload: LoginRequestModel = { email: 'test@example.com', password: 'password123' };
    const mockUser = new User();
    mockUser.id = 1;
    mockUser.email = 'test@example.com';
    mockUser.password = 'hashedPassword';

    it('should return a token on successful login', async () => {
      const mockToken = 'mock-jwt-token';
      userRepositoryMock.getUserByEmail.mockResolvedValue(mockUser);
      bcryptCompareMock.mockResolvedValue(true);
      jwtSignMock.mockReturnValue(mockToken);

      const result = await authService.login(loginPayload);

      expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith(loginPayload.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginPayload.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email },
        expect.any(String), // JWT_SECRET
        { expiresIn: expect.any(String) } // JWT_EXPIRES_IN
      );
      expect(result).toEqual({ token: mockToken });
    });

    it('should throw an AppError if user is not found', async () => {
      userRepositoryMock.getUserByEmail.mockResolvedValue(null as any);

      await expect(authService.login(loginPayload)).rejects.toThrow(
        new AppError("Invalid email or password", 401)
      );
    });

    it('should throw an AppError if password is not valid', async () => {
      userRepositoryMock.getUserByEmail.mockResolvedValue(mockUser);
      bcryptCompareMock.mockResolvedValue(false);

      await expect(authService.login(loginPayload)).rejects.toThrow(
        new AppError("Invalid email or password", 401)
      );
    });
  });

  // Test for generateToken
  describe('generateToken', () => {
    it('should call jwt.sign with correct parameters', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const mockToken = 'mock-token';
      jwtSignMock.mockReturnValue(mockToken);

      const result = authService.generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
      expect(result).toBe(mockToken);
    });
  });

  // Test for verifyToken
  describe('verifyToken', () => {
    it('should call jwt.verify with correct parameters and return decoded value', () => {
      const tokenPayload = { token: 'some-token', jwtSecret: 'secret' };
      const decodedValue = { id: 1 };
      jwtVerifyMock.mockReturnValue(decodedValue);

      const result = authService.verifyToken(tokenPayload);

      expect(jwt.verify).toHaveBeenCalledWith(tokenPayload.token, tokenPayload.jwtSecret);
      expect(result).toEqual(decodedValue);
    });
  });

  // Test for comparePassword
  describe('comparePassword', () => {
    it('should call bcrypt.compare and return its result', async () => {
      const comparePayload = { password: 'plain-password', hash: 'hashed-password' };
      bcryptCompareMock.mockResolvedValue(true);

      const result = await authService.comparePassword(comparePayload);

      expect(bcrypt.compare).toHaveBeenCalledWith(comparePayload.password, comparePayload.hash);
      expect(result).toBe(true);
    });
  });
});
