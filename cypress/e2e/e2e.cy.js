/**
 * Test suite for user authentication.
 *
 * This suite includes tests for the following scenarios:
 * - Displaying the login page with necessary fields.
 * - Logging in with valid credentials.
 * - Showing an error message on invalid login attempts.
 * - Logging out from the application.
 */

describe('Login', () => {
  /**
   * Visits the login page before each test.
   */
  beforeEach(() => {
    cy.visit('http://localhost:5500/index.html');
  });

  /**
   * Test case to verify that the user can log in with valid credentials.
   *
   * It checks if the logout button is visible after a successful login.
   */
  it('should log in with valid credentials', () => {
    cy.get('#loginEmail').type('test@example.com');
    cy.get('#loginPassword').type('password123');
    cy.get('#loginForm button[type="submit"]').click();
    cy.get('button[data-auth="logout"]').should('be.visible');
  });

  /**
   * Test case to verify that the login form cannot be submitted with invalid credentials.
   * It checks if an appropriate error message is displayed.
   */
  it('should not allow submission of the login form with invalid credentials and display an error message', () => {
    cy.get('#loginEmail').type('invalid@example.com');
    cy.get('#loginPassword').type('wrongPassword');
    cy.get('#loginForm button[type="submit"]').click();

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains(
        'Either your username was not found or your password is incorrect',
      );
    });
  });

  /**
   * Test case to verify that the user can log out using the logout button.
   */
  it('should log out the user when the logout button is clicked', () => {
    cy.get('#loginEmail').type('test@example.com');
    cy.get('#loginPassword').type('password123');
    cy.get('#loginForm button[type="submit"]').click();

    cy.get('button[data-auth="logout"]').click();

    cy.contains('Login').should('be.visible');
  });
});
