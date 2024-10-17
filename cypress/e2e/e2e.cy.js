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
    cy.get('.btn.btn-outline-success.me-2').contains('Login').click();
    cy.get('#loginModal').should('be.visible');
  });

  /**
   * Test case to verify that the user can log in with valid credentials.
   */
  it('should login with valid credentials', () => {
    cy.intercept(
      'POST',
      'https://nf-api.onrender.com/api/v1/social/auth/login',
    ).as('loginRequest');

    cy.get('#loginEmail').type('juloye@stud.noroff.no');
    cy.get('#loginPassword').type('password123');
    cy.get('#loginForm button[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '?view=profile');
    cy.get('button[data-auth="logout"]').should('be.visible');
  });

  /**
   * Test case to verify that the login form cannot be submitted with invalid credentials and display an error message.
   */
  it('should not allow submission of the login form with invalid credentials and display an error message', () => {
    cy.intercept(
      'POST',
      'https://nf-api.onrender.com/api/v1/social/auth/login',
    ).as('loginRequest');

    cy.get('#loginEmail').type('invalid@stud.noroff.no');
    cy.get('#loginPassword').type('wrongPassword');
    cy.get('#loginForm button[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

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
    cy.intercept(
      'POST',
      'https://nf-api.onrender.com/api/v1/social/auth/login',
    ).as('loginRequest');
    cy.intercept(
      'GET',
      'https://nf-api.onrender.com/api/v1/social/profiles/**',
    ).as('profileRequest');

    cy.get('#loginEmail').type('juloye@stud.noroff.no');
    cy.get('#loginPassword').type('password123');
    cy.get('#loginForm button[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.wait('@profileRequest').its('response.statusCode').should('eq', 200);

    cy.url().should('include', '?view=profile');
    cy.get('button[data-auth="logout"]').click();
    cy.url().should('include', '/');
    cy.contains('Login').should('be.visible');
  });
});
