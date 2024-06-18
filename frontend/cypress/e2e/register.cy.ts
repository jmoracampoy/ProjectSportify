describe('Página de Registro', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/register');
    cy.get('ion-content').should('be.visible');
    cy.get('ion-card').should('be.visible');
    cy.get('form').should('be.visible');
    cy.get('ion-input[formControlName="username"]').should('be.visible');
    cy.get('ion-input[formControlName="email"]').should('be.visible');
    cy.get('ion-input[formControlName="password"]').should('be.visible');
    cy.get('ion-button[type="submit"]').should('be.visible');
  });

  it('debería registrar correctamente', () => {
    const username = 'testuser';
    const email = 'testuser@example.com';
    const password = 'password123';

    cy.intercept('POST', '**/api/auth/register', {
      statusCode: 200,
      body: {
        message: 'Usuario registrado correctamente'
      },
    }).as('register');

    cy.get('ion-input[formControlName="username"]').type(username);
    cy.get('ion-input[formControlName="email"]').type(email);
    cy.get('ion-input[formControlName="password"]').type(password);
    cy.get('ion-button[type="submit"]').click();

    cy.url().should('include', '/login');
  });
});
