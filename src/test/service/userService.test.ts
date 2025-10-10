import { UserService } from '../../service/userService';
import { UserRepository } from '../../repository/userRepository';
import { User } from '../../entity/user.entity';
import AppError from '../../utils/appError';
import bcrypt from 'bcryptjs';
import { CreateUserModel, UpdateUserModel } from '../../model/userModel';

// Mock dependencies
jest.mock('../../repository/userRepository');
jest.mock('bcryptjs');

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let bcryptHashMock: jest.Mock;

  beforeEach(() => {
    // Create a new mock instance for each test
    userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
    bcryptHashMock = bcrypt.hash as jest.Mock;
    
    // Instantiate UserService and manually assign the mock repository
    userService = new UserService();
    userService.userRepository = userRepositoryMock;
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  // Test for createUser
  describe('createUser', () => {
    it('should hash the password and create a new user', async () => {
      const payload: CreateUserModel = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const hashedPassword = 'hashedPassword';
      const createdUser = new User();
      
      bcryptHashMock.mockResolvedValue(hashedPassword);
      userRepositoryMock.createUser.mockResolvedValue(createdUser);

      const result = await userService.createUser(payload);

      expect(bcrypt.hash).toHaveBeenCalledWith(payload.password, 10);
      expect(userRepositoryMock.createUser).toHaveBeenCalledWith({
        ...payload,
        password: hashedPassword,
      });
      expect(result).toEqual(createdUser);
    });
  });

  // Test for getUsers
  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [new User(), new User()];
      userRepositoryMock.getUsers.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(result).toEqual(mockUsers);
      expect(userRepositoryMock.getUsers).toHaveBeenCalledTimes(1);
    });
  });

  // Test for getUserById
  describe('getUserById', () => {
    it('should return a user when a valid ID is provided', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      userRepositoryMock.getUserById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(userRepositoryMock.getUserById).toHaveBeenCalledWith(1);
    });

    it('should throw an AppError when the user is not found', async () => {
      const error = new AppError('User not found', 404);
      userRepositoryMock.getUserById.mockRejectedValue(error);

      await expect(userService.getUserById(999)).rejects.toThrow(error);
    });
  });

  // Test for getUserByEmail
  describe('getUserByEmail', () => {
    it('should return a user when a valid email is provided', async () => {
        const mockUser = new User();
        mockUser.email = 'test@example.com';
        userRepositoryMock.getUserByEmail.mockResolvedValue(mockUser);

        const result = await userService.getUserByEmail('test@example.com');

        expect(result).toEqual(mockUser);
        expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw an AppError when the user is not found', async () => {
        const error = new AppError('User not found', 404);
        userRepositoryMock.getUserByEmail.mockRejectedValue(error);

        await expect(userService.getUserByEmail('nonexistent@example.com')).rejects.toThrow(error);
    });
  });

  // Test for updateUser
  describe('updateUser', () => {
    it('should call the repository with the correct update payload', async () => {
      const userId = 1;
      const payload: UpdateUserModel = { name: 'Updated Name', email: 'updated@example.com', password: 'newpassword' };
      const updatedUser = new User();
      userRepositoryMock.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(userId, payload);

      expect(userRepositoryMock.updateUser).toHaveBeenCalledWith({
        id: userId,
        ...payload,
      });
      expect(result).toEqual(updatedUser);
    });
  });

  // Test for deleteUserById
  describe('deleteUserById', () => {
    it('should return the deleted user on successful deletion', async () => {
        const deletedUser = new User();
        deletedUser.id = 1;
        userRepositoryMock.deleteUserById.mockResolvedValue(deletedUser);

        const result = await userService.deleteUserById(1);

        expect(result).toEqual(deletedUser);
        expect(userRepositoryMock.deleteUserById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if no user is found to delete', async () => {
        const error = new AppError('No active user found', 404);
        userRepositoryMock.deleteUserById.mockRejectedValue(error);

        await expect(userService.deleteUserById(999)).rejects.toThrow(error);
    });
  });

  // Test for restoreUserById
  describe('restoreUserById', () => {
    it('should return the restored user on successful restoration', async () => {
        const restoredUser = new User();
        restoredUser.id = 1;
        userRepositoryMock.restoreUserById.mockResolvedValue(restoredUser);

        const result = await userService.restoreUserById(1);

        expect(result).toEqual(restoredUser);
        expect(userRepositoryMock.restoreUserById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if no user is found to restore', async () => {
        const error = new AppError('No deleted user found', 404);
        userRepositoryMock.restoreUserById.mockRejectedValue(error);

        await expect(userService.restoreUserById(999)).rejects.toThrow(error);
    });
  });
});