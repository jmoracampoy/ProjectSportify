const { register } = require('../controllers/authController');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

jest.mock('../models/user');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Registro de usuario', () => {
  it('debería registrar un usuario correctamente', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(), 
      send: jest.fn(),
    };

    User.mockImplementationOnce(() => ({
      save: jest.fn().mockResolvedValue(),
    }));

    await register(req, res);
    expect(res.send).toHaveBeenCalledWith({ message: 'Registro realizado correctamente' });
  });

  it('debería manejar errores al intentar registrar un usuario', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    User.mockResolvedValueOnce({ save: jest.fn().mockRejectedValue(new Error('Error al guardar')) });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(expect.any(Error));
  });
});