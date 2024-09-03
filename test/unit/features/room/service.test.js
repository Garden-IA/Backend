const mongoose = require('mongoose');
const Room = require('../../../../src/features/room/model'); // Ajusta la ruta según la ubicación del modelo
const House = require('../../../../src/features/house/model'); // Ajusta la ruta según la ubicación del modelo
const roomService = require('../../../../src/features/room/service');
const logger = require('../../../../src/config/logger');

// Mock de logger para evitar salida de logs en las pruebas
jest.mock('../../../../src/config/logger');

// Mock de Room y House usando mongoose-mock
jest.mock('../../../../src/features/room/model');
jest.mock('../../../../src/features/house/model');

describe('Room Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpiar mocks después de cada prueba
  });

  describe('createRoom', () => {
    it('should create a room and associate it with a house', async () => {
      const mockRoom = {
        _id: '60d21b4667d0d8992e610c85',
        name: 'Luxury Suite',
        type: 'bedroom',
        humidity: 'medium',
        airConditioner: true,
        radiator: false,
        light: 'high',
        plants: [],
        save: jest.fn().mockResolvedValue(this),
      };

      const mockHouse = {
        _id: '60d21b4667d0d8992e610c84',
        rooms: [],
        updateOne: jest.fn().mockResolvedValue({}),
      };

      Room.prototype.save = jest.fn().mockResolvedValue(mockRoom);
      House.findByIdAndUpdate = jest.fn().mockResolvedValue(mockHouse);

      const result = await roomService.createRoom('Luxury Suite', 'bedroom', 'medium', true, false, 'high', '60d21b4667d0d8992e610c84', []);

      expect(Room.prototype.save).toHaveBeenCalled();
      expect(House.findByIdAndUpdate).toHaveBeenCalledWith(
        '60d21b4667d0d8992e610c84',
        { $push: { rooms: mockRoom._id } },
        { new: true, useFindAndModify: false },
      );
      expect(result).toEqual(mockRoom);
    });

    it('should throw an error if there is an issue creating a room', async () => {
      Room.prototype.save = jest.fn().mockRejectedValue(new Error('Error creating room'));

      await expect(roomService.createRoom('Luxury Suite', 'bedroom', 'medium', true, false, 'high', '60d21b4667d0d8992e610c84', [])).rejects.toThrow(
        'Error creating room',
      );
    });
  });

  describe('getAllRooms', () => {
    it('should return all rooms', async () => {
      const mockRooms = [
        { _id: '60d21b4667d0d8992e610c85', name: 'Luxury Suite' },
        { _id: '60d21b4667d0d8992e610c86', name: 'Standard Room' },
      ];

      Room.find = jest.fn().mockResolvedValue(mockRooms);

      const result = await roomService.getAllRooms();

      expect(Room.find).toHaveBeenCalled();
      expect(result).toEqual(mockRooms);
    });

    it('should throw an error if there is an issue retrieving rooms', async () => {
      Room.find = jest.fn().mockRejectedValue(new Error('Error retrieving rooms'));

      await expect(roomService.getAllRooms()).rejects.toThrow('Error retrieving rooms');
    });
  });

  describe('getRoomById', () => {
    it('should return a room by ID', async () => {
      const mockRoom = { _id: '60d21b4667d0d8992e610c85', name: 'Luxury Suite' };

      Room.findById = jest.fn().mockResolvedValue(mockRoom);

      const result = await roomService.getRoomById('60d21b4667d0d8992e610c85');

      expect(Room.findById).toHaveBeenCalledWith('60d21b4667d0d8992e610c85');
      expect(result).toEqual(mockRoom);
    });

    it('should throw an error if the room is not found', async () => {
      Room.findById = jest.fn().mockResolvedValue(null);

      await expect(roomService.getRoomById('60d21b4667d0d8992e610c85')).rejects.toThrow('Room not found');
    });

    it('should throw an error if there is an issue retrieving the room', async () => {
      Room.findById = jest.fn().mockRejectedValue(new Error('Error retrieving room'));

      await expect(roomService.getRoomById('60d21b4667d0d8992e610c85')).rejects.toThrow('Error retrieving room');
    });
  });

  describe('updateRoom', () => {
    it('should update a room by ID', async () => {
      const mockUpdatedRoom = { _id: '60d21b4667d0d8992e610c85', name: 'Updated Suite' };

      Room.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedRoom);

      const result = await roomService.updateRoom('60d21b4667d0d8992e610c85', { name: 'Updated Suite' });

      expect(Room.findByIdAndUpdate).toHaveBeenCalledWith('60d21b4667d0d8992e610c85', { name: 'Updated Suite' }, { new: true, runValidators: true });
      expect(result).toEqual(mockUpdatedRoom);
    });

    it('should throw an error if the room is not found', async () => {
      Room.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await expect(roomService.updateRoom('60d21b4667d0d8992e610c85', { name: 'Updated Suite' })).rejects.toThrow('Room not found');
    });

    it('should throw an error if there is an issue updating the room', async () => {
      Room.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Error updating room'));

      await expect(roomService.updateRoom('60d21b4667d0d8992e610c85', { name: 'Updated Suite' })).rejects.toThrow('Error updating room');
    });
  });

  describe('deleteRoom', () => {
    it('should delete a room by ID', async () => {
      const mockRoom = { _id: '60d21b4667d0d8992e610c85' };

      Room.findByIdAndDelete = jest.fn().mockResolvedValue(mockRoom);
      House.updateMany = jest.fn().mockResolvedValue({});

      await roomService.deleteRoom('60d21b4667d0d8992e610c85');

      expect(Room.findByIdAndDelete).toHaveBeenCalledWith('60d21b4667d0d8992e610c85');
      expect(House.updateMany).toHaveBeenCalledWith({ rooms: '60d21b4667d0d8992e610c85' }, { $pull: { rooms: '60d21b4667d0d8992e610c85' } });
    });

    it('should throw an error if the room is not found', async () => {
      Room.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await expect(roomService.deleteRoom('60d21b4667d0d8992e610c85')).rejects.toThrow('Room not found');
    });

    it('should throw an error if there is an issue deleting the room', async () => {
      Room.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Error deleting room'));

      await expect(roomService.deleteRoom('60d21b4667d0d8992e610c85')).rejects.toThrow('Error deleting room');
    });
  });
});
