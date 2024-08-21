const sinon = require('sinon');
const { expect } = require('chai');
const User = require('../../models/user'); // Ajusta la ruta según tu estructura
const authService = require('../../services/authService'); // Ajusta la ruta según tu estructura
const { hashPassword, comparePassword } = require('../../utils/auth'); // Ajusta la ruta según tu estructura

describe('authService', function () {
  describe('register', function () {
    beforeEach(function () {
      sinon.stub(User.prototype, 'save').resolvesThis();
      sinon.stub(User, 'findOne').resolves(null); // No hay usuario con ese email
    });

    afterEach(function () {
      sinon.restore();
    });

    it('Debería registrar un nuevo usuario correctamente', async function () {
      const result = await authService.register('testuser@example.com', 'password123');
      expect(result).to.be.undefined;
      expect(User.prototype.save.calledOnce).to.be.true;
    });

    it('Debería lanzar un error si el email ya está en uso', async function () {
      User.findOne.resolves({ email: 'testuser@example.com' });
      try {
        await authService.register('testuser@example.com', 'password123');
      } catch (error) {
        expect(error.message).to.equal('Email already in use');
      }
    });
  });

  describe('login', function () {
    beforeEach(function () {
      sinon.stub(User, 'findOne').resolves({
        email: 'testuser@example.com',
        password: await hashPassword('password123'),
      });
    });

    afterEach(function () {
      sinon.restore();
    });

    it('Debería iniciar sesión correctamente con credenciales válidas', async function () {
      const result = await authService.login('testuser@example.com', 'password123');
      expect(result).to.have.property('token');
    });

    it('Debería lanzar un error con credenciales inválidas', async function () {
      User.findOne.resolves({
        email: 'testuser@example.com',
        password: await hashPassword('wrongpassword'),
      });
      try {
        await authService.login('testuser@example.com', 'password123');
      } catch (error) {
        expect(error.message).to.equal('Invalid credentials');
      }
    });
  });
});
