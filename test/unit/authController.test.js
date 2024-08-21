const sinon = require('sinon');
const { expect } = require('chai');
const authController = require('../../controllers/authController'); // Ajusta la ruta según tu estructura
const authService = require('../../services/authService'); // Ajusta la ruta según tu estructura
const { mockRequest, mockResponse } = require('mock-req-res');

describe('authController', function () {
  describe('register', function () {
    it('Debería registrar un usuario correctamente y devolver status 201', async function () {
      const req = mockRequest({
        body: { email: 'testuser@example.com', password: 'password123' },
      });
      const res = mockResponse();

      sinon.stub(authService, 'register').resolves();

      await authController.register(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ message: 'User created' })).to.be.true;

      authService.register.restore();
    });

    it('Debería devolver error 500 si ocurre un error en el registro', async function () {
      const req = mockRequest({
        body: { email: 'testuser@example.com', password: 'password123' },
      });
      const res = mockResponse();

      sinon.stub(authService, 'register').throws(new Error('Error en el registro'));

      await authController.register(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error en el registro' })).to.be.true;

      authService.register.restore();
    });
  });

  describe('login', function () {
    it('Debería iniciar sesión correctamente y devolver el token', async function () {
      const req = mockRequest({
        body: { email: 'testuser@example.com', password: 'password123' },
      });
      const res = mockResponse();
      const token = 'mockToken';

      sinon.stub(authService, 'login').resolves({ token });

      await authController.login(req, res);

      expect(res.json.calledWith({ token })).to.be.true;

      authService.login.restore();
    });

    it('Debería devolver error 400 si las credenciales son inválidas', async function () {
      const req = mockRequest({
        body: { email: 'testuser@example.com', password: 'wrongpassword' },
      });
      const res = mockResponse();

      sinon.stub(authService, 'login').throws(new Error('Invalid credentials'));

      await authController.login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Invalid credentials' })).to.be.true;

      authService.login.restore();
    });
  });
});
