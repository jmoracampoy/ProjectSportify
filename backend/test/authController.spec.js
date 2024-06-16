const request = require("supertest");
const { app, connectToMongoDB } = require("../app"); // Ajusta la ruta según la ubicación de tu app
const User = require("../models/user"); // Ajusta la ruta según la ubicación de tu modelo User

describe("Auth Controller", () => {
  // Antes de las pruebas, conecta a MongoDB
  beforeAll(async () => {
    await connectToMongoDB();
  });

  // Después de las pruebas, cierra la conexión y limpia los mocks si es necesario
  afterAll(async () => {
    await mongoose.connection.close();
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    // Mockear la función save del modelo User para simular el registro exitoso
    const mockSave = jest.spyOn(User.prototype, "save");
    mockSave.mockResolvedValue();

    const newUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password1234",
    };

    const res = await request(app)
      .post("/api/auth/register")
      .send(newUser);

    expect(res.statusCode).toEqual(201); // Verifica el código de estado 201 correctamente
    expect(res.body.message).toBe("User registered successfully");

    // Restaurar el mock después de la prueba
    mockSave.mockRestore();
  });

  it("should login a user", async () => {
    // Mockear la función findOne del modelo User para simular el inicio de sesión exitoso
    const mockFindOne = jest.spyOn(User, "findOne");
    mockFindOne.mockResolvedValue({
      _id: "someUserId",
      email: "testuser@example.com",
      password: "$2a$10$12345678901234567890", // bcrypt hashed password
    });

    const credentials = {
      email: "testuser@example.com",
      password: "password123",
    };

    const res = await request(app)
      .post("/api/auth/login")
      .send(credentials);

    expect(res.statusCode).toEqual(200); // Verifica el código de estado 200 correctamente
    expect(res.body).toHaveProperty("token");

    // Restaurar el mock después de la prueba
    mockFindOne.mockRestore();
  });
});
