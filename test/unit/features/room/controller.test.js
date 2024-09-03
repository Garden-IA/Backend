const request = require('supertest');
const app = require('../../../../app'); // Cambia la ruta según tu configuración
const roomService = require('../../../../src/features/room/service');
const logger = require('../../../../src/config/logger');

// Mock de roomService
jest.mock('../../../../src/features/room/service');

describe('Room Controller', () => {
  let server;

  beforeAll(() => {
    server = app.listen(); // Inicia el servidor antes de las pruebas
  });

  afterAll(() => {
    server.close(); // Cierra el servidor después de las pruebas
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia mocks después de cada prueba
  });

  describe('POST /api/v1/rooms', () => {
    it('should create a room successfully', async () => {
      const mockRoom = {
        _id: '60d21b4667d0d8992e610c85',
        name: 'Luxury Suite',
        type: 'bedroom',
        humidity: 'medium',
        airConditioner: true,
        radiator: false,
        light: 'high',
        houseId: '60d21b4667d0d8992e610c84',
        plants: [],
      };

      roomService.createRoom.mockResolvedValue(mockRoom);

      const response = await request(server).post('/api/v1/rooms').send({
        name: 'Luxury Suite',
        type: 'bedroom',
        humidity: 'medium',
        airConditioner: true,
        radiator: false,
        light: 'high',
        houseId: '60d21b4667d0d8992e610c84',
        plants: [],
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.message).toBe('Room created successfully');
      expect(roomService.createRoom).toHaveBeenCalledWith('Luxury Suite', 'bedroom', 'medium', true, false, 'high', '60d21b4667d0d8992e610c84', []);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(server).post('/api/v1/rooms').send({
        type: 'bedroom',
        humidity: 'medium',
        light: 'high',
        houseId: '60d21b4667d0d8992e610c84',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name, type, and house ID are required');
    });
  });

  describe('GET /api/v1/rooms', () => {
    it('should return all rooms', async () => {
      const mockRooms = [
        { _id: '60d21b4667d0d8992e610c85', name: 'Luxury Suite' },
        { _id: '60d21b4667d0d8992e610c86', name: 'Standard Room' },
      ];

      roomService.getAllRooms.mockResolvedValue(mockRooms);

      const response = await request(server).get('/api/v1/rooms');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRooms);
    });

    it('should return 500 if an error occurs', async () => {
      roomService.getAllRooms.mockRejectedValue(new Error('Database error'));

      const response = await request(server).get('/api/v1/rooms');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('GET /api/v1/rooms/:id', () => {
    it('should return a room by ID', async () => {
      const mockRoom = { _id: '60d21b4667d0d8992e610c85', name: 'Luxury Suite' };

      roomService.getRoomById.mockResolvedValue(mockRoom);

      const response = await request(server).get('/api/v1/rooms/60d21b4667d0d8992e610c85');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRoom);
    });

    it('should return 404 if the room is not found', async () => {
      roomService.getRoomById.mockRejectedValue(new Error('Room not found'));

      const response = await request(server).get('/api/v1/rooms/60d21b4667d0d8992e610c85');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Room not found');
    });
  });

  describe('PUT /api/v1/rooms/:id', () => {
    it('should update a room by ID', async () => {
      const mockUpdatedRoom = { _id: '60d21b4667d0d8992e610c85', name: 'Updated Suite' };

      roomService.updateRoom.mockResolvedValue(mockUpdatedRoom);

      const response = await request(server).put('/api/v1/rooms/60d21b4667d0d8992e610c85').send({ name: 'Updated Suite' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Room updated successfully');
      expect(response.body.room).toEqual(mockUpdatedRoom);
    });

    it('should return 404 if the room is not found', async () => {
      roomService.updateRoom.mockRejectedValue(new Error('Room not found'));

      const response = await request(server).put('/api/v1/rooms/60d21b4667d0d8992e610c85').send({ name: 'Updated Suite' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Room not found');
    });

    it('should return 400 if the request body is missing', async () => {
      const response = await request(server).put('/api/v1/rooms/60d21b4667d0d8992e610c85');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Request body is missing');
    });
  });

  describe('DELETE /api/v1/rooms/:id', () => {
    it('should delete a room by ID', async () => {
      roomService.deleteRoom.mockResolvedValue();

      const response = await request(server).delete('/api/v1/rooms/60d21b4667d0d8992e610c85');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Room deleted successfully');
    });

    it('should return 404 if the room is not found', async () => {
      roomService.deleteRoom.mockRejectedValue(new Error('Room not found'));

      const response = await request(server).delete('/api/v1/rooms/60d21b4667d0d8992e610c85');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Room not found');
    });

    it('should return 400 if the room ID is not provided', async () => {
      const response = await request(server).delete('/api/v1/rooms/');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Room ID is required');
    });
  });
});
