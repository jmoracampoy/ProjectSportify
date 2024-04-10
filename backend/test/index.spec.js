const request = require('supertest'); // Para realizar solicitudes HTTP
const app = require('../app'); // Reemplaza './app' con la ruta correcta a tu archivo de enrutador

describe('GET /', () => {
  test('responds with JSON containing health: ok', async () => {
    // Realiza una solicitud HTTP GET a la ruta /
    const response = await request(app).get('/');
    
    // Verifica que la respuesta tenga el código de estado 200 (OK)
    expect(response.statusCode).toBe(200);
    
    // Verifica que la respuesta tenga el contenido JSON esperado
    expect(response.body).toEqual({ health: 'ok' });
  });
});

