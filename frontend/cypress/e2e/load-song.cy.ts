describe('Lista de Canciones', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/home');
  });

  it('debería mostrar la lista de canciones correctamente', () => {
    const mockSongs = [
      {
        _id: '1',
        name: 'Canción 1',
        artist: 'Artista 1',
        releaseDate: new Date(),
        imageUrl: 'https://example.com/song1.png',
        comments: [
          {
            text: 'Comentario 1',
            author: 'Autor 1',
            stars: 5,
            createdAt: new Date(),
          },
          {
            text: 'Comentario 2',
            author: 'Autor 2',
            stars: 4,
            createdAt: new Date(),
          },
        ],
      },
      {
        _id: '2',
        name: 'Canción 2',
        artist: 'Artista 2',
        releaseDate: new Date(),
        imageUrl: 'https://example.com/song2.png',
        comments: [],
      },
    ];

    cy.intercept('GET', '**/api/songs', {
      statusCode: 200,
      body: mockSongs,
    }).as('getSongs');

    cy.wait('@getSongs', { timeout: 10000 });

    cy.get('ion-item').should('have.length', 4);
  });
});
