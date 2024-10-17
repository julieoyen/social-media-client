/**
 * Auth Module
 *
 * This module handles user authentication, including login and logout functionality.
 *
 * @module Auth
 */

import { login } from '../src/js/api/auth/login';
import { logout } from '../src/js/api/auth/logout';
import { save, remove } from '../src/js/storage/index';

// Mock the storage functions
jest.mock('../src/js/storage/index', () => ({
  save: jest.fn(),
  load: jest.fn(() => 'mockToken'),
  remove: jest.fn(),
}));

// Mock the fetch function globally
global.fetch = jest.fn();

/**
 * Test suite for the Auth Module
 */
describe('Auth Module', () => {
  /**
   * Reset mocks before each test
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test suite for the login function
   */
  describe('login function', () => {
    /**
     * Test case to verify that the login function stores token and profile
     * upon successful login.
     *
     * @async
     * @returns {Promise<void>}
     */
    it('should store token and profile on successful login', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          accessToken: 'mockToken',
          name: 'mockName',
        }),
      });

      const profile = await login('juloye@stud.noroff.no', 'password123');

      expect(save).toHaveBeenCalledWith('token', 'mockToken');
      expect(save).toHaveBeenCalledWith('profile', { name: 'mockName' });
      expect(profile).toEqual({ name: 'mockName' });
    });

    /**
     * Test case to verify that the login function throws an error
     * on a failed login attempt.
     *
     * @async
     * @returns {Promise<void>}
     */
    it('should throw an error on failed login', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
      });

      await expect(
        login('invalid@stud.noroff.no', 'wrongPassword'),
      ).rejects.toThrow('Unauthorized');
    });
  });

  /**
   * Test suite for the logout function
   */
  describe('logout function', () => {
    /**
     * Test case to verify that the logout function removes the token
     * and profile from storage.
     */
    it('should remove token and profile from storage', () => {
      logout();

      expect(remove).toHaveBeenCalledWith('token');
      expect(remove).toHaveBeenCalledWith('profile');
    });
  });
});
