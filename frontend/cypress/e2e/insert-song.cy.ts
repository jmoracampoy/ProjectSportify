describe('Formulario de Canción', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/add-song');

  });

  it('debería insertar la canción correctamente', () => {
    const song = {
      name: 'Canción de prueba',
      artist: 'Artista de prueba',
      imageUrl: 'https://example.com/image.png'
    };

    cy.intercept('POST', '**/api/songs', {
      statusCode: 200,
      body: song,
    }).as('addSong');

    cy.get('ion-input[formControlName="name"]').type(song.name);
    cy.get('ion-input[formControlName="artist"]').type(song.artist);
    cy.get('ion-input[formControlName="imageUrl"]').type(song.imageUrl);


    cy.get('ion-input[formControlName="name"]').should('have.value', song.name);
    cy.get('ion-input[formControlName="artist"]').should('have.value', song.artist);
    cy.get('ion-input[formControlName="imageUrl"]').should('have.value',song.imageUrl);

    cy.get('ion-button.submit-button').click();

    cy.url().should('include', '/add-song');

  });
});

