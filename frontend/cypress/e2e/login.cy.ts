describe('Página de Inicio de Sesión', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
    cy.get('ion-content').should('be.visible');
    cy.get('ion-card').should('be.visible');
    cy.get('form').should('be.visible');
    cy.get('ion-input[formControlName="email"]').should('be.visible');
    cy.get('ion-input[formControlName="password"]').should('be.visible');
    cy.get('ion-button[type="submit"]').should('be.visible');
  });

  it('debería iniciar sesión incorrectamente con credenciales incorrectas', () => {
    cy.intercept('POST', '**/api/login', {
      statusCode: 200,
      body: {
        token: 'mocked_token',
        message: 'Inicio de sesión realizado correctamente',
      },
    }).as('login');

    cy.get('ion-input[formControlName="email"]').type('testuser@example.com');
    cy.get('ion-input[formControlName="password"]').type('password123');
    cy.get('ion-button[type="submit"]').click();

    cy.url().should('include', '/login');
  });
});
