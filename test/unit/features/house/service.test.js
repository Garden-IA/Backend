const mongoose = require('mongoose');
const House = require('../../../../src/features/house/model');
const houseService = require('../../../../src/features/house/service');
const logger = require('../../../../src/config/logger');

jest.mock('../../../../src/features/house/model');
jest.mock('../../../../src/config/logger');

describe('House Service', () => {
  const mockId = new mongoose.Types.ObjectId(); // Ejemplo de ObjectId de MongoDB

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
  });

  describe('createHouse', () => {
    it('should create a new house and return it', async () => {
      const mockHouse = {
        _id: mockId,
        name: 'Test House',
        location: 'Test Location',
        description: 'Test Description',
        save: jest.fn().mockResolvedValueOnce(this),
      };

      House.mockImplementation(() => mockHouse);

      const result = await houseService.createHouse('Test House', 'Test Location', 'Test Description');

      expect(House).toHaveBeenCalledWith({
        name: 'Test House',
        location: 'Test Location',
        description: 'Test Description',
      });
      expect(mockHouse.save).toHaveBeenCalled();
      expect(result).toEqual(mockHouse);
      expect(logger.info).toHaveBeenCalledWith('service.js | Entrando en la función createHouse()');
      expect(logger.info).toHaveBeenCalledWith(`service.js | Casa con nombre Test House creada con éxito`);
    });

    it('should throw an error if house creation fails', async () => {
      House.mockImplementation(() => ({
        save: jest.fn().mockRejectedValueOnce(new Error('Save failed')),
      }));

      await expect(houseService.createHouse('Test House', 'Test Location', 'Test Description')).rejects.toThrow('Error creating house');
      expect(logger.error).toHaveBeenCalledWith('service.js | Error al crear casa con nombre Test House');
      expect(logger.debug).toHaveBeenCalledWith('service.js | Error: Save failed');
    });
  });

  describe('getAllHouses', () => {
    it('should return all houses', async () => {
      const mockHouses = [
        { _id: mockId, name: 'House 1', location: 'Location 1' },
        { _id: new mongoose.Types.ObjectId(), name: 'House 2', location: 'Location 2' },
      ];

      House.find.mockResolvedValueOnce(mockHouses);

      const result = await houseService.getAllHouses();

      expect(House.find).toHaveBeenCalled();
      expect(result).toEqual(mockHouses);
      expect(logger.info).toHaveBeenCalledWith('service.js | Entrando en la función getAllHouses()');
      expect(logger.info).toHaveBeenCalledWith('service.js | Recuperadas todas las casas con éxito');
    });

    it('should throw an error if retrieval fails', async () => {
      House.find.mockRejectedValueOnce(new Error('Find failed'));

      await expect(houseService.getAllHouses()).rejects.toThrow('Error retrieving houses');
      expect(logger.error).toHaveBeenCalledWith('service.js | Error al recuperar las casas');
      expect(logger.debug).toHaveBeenCalledWith('service.js | Error: Find failed');
    });
  });

  describe('getHouseById', () => {
    it('should return the house if found', async () => {
      const mockHouse = { _id: mockId, name: 'House 1', location: 'Location 1' };

      House.findById.mockResolvedValueOnce(mockHouse);

      const result = await houseService.getHouseById(mockId);

      expect(House.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockHouse);
      expect(logger.info).toHaveBeenCalledWith(`service.js | Entrando en la función getHouseById() con ID: ${mockId}`);
      expect(logger.info).toHaveBeenCalledWith(`service.js | Casa con ID ${mockId} recuperada con éxito`);
    });

    it('should throw an error if house is not found', async () => {
      House.findById.mockResolvedValueOnce(null);

      await expect(houseService.getHouseById(mockId)).rejects.toThrow('House not found');
      expect(logger.warn).toHaveBeenCalledWith(`service.js | Casa con ID ${mockId} no encontrada`);
    });

    it('should throw an error if retrieval fails', async () => {
      House.findById.mockRejectedValueOnce(new Error('FindById failed'));

      await expect(houseService.getHouseById(mockId)).rejects.toThrow('FindById failed');
      expect(logger.error).toHaveBeenCalledWith(`service.js | Error al recuperar casa con ID ${mockId}`);
      expect(logger.debug).toHaveBeenCalledWith('service.js | Error: FindById failed');
    });
  });

  describe('updateHouse', () => {
    it('should update the house and return the updated house', async () => {
      const mockHouse = { _id: mockId, name: 'Updated House', location: 'Updated Location' };

      House.findByIdAndUpdate.mockResolvedValueOnce(mockHouse);

      const result = await houseService.updateHouse(mockId, { name: 'Updated House', location: 'Updated Location' });

      expect(House.findByIdAndUpdate).toHaveBeenCalledWith(
        mockId,
        { name: 'Updated House', location: 'Updated Location' },
        { new: true, runValidators: true },
      );
      expect(result).toEqual(mockHouse);
      expect(logger.info).toHaveBeenCalledWith(`service.js | Entrando en la función updateHouse() con ID: ${mockId}`);
      expect(logger.info).toHaveBeenCalledWith(`service.js | Casa con ID ${mockId} actualizada con éxito`);
    });

    it('should throw an error if house is not found for update', async () => {
      House.findByIdAndUpdate.mockResolvedValueOnce(null);

      await expect(houseService.updateHouse(mockId, { name: 'Updated House' })).rejects.toThrow('House not found');
      expect(logger.warn).toHaveBeenCalledWith(`service.js | Casa con ID ${mockId} no encontrada para actualizar`);
    });

    it('should throw an error if update fails', async () => {
      House.findByIdAndUpdate.mockRejectedValueOnce(new Error('Update failed'));

      await expect(houseService.updateHouse(mockId, { name: 'Updated House' })).rejects.toThrow('Update failed');
      expect(logger.error).toHaveBeenCalledWith(`service.js | Error al actualizar casa con ID ${mockId}`);
      expect(logger.debug).toHaveBeenCalledWith('service.js | Error: Update failed');
    });
  });

  describe('deleteHouse', () => {
    it('should delete the house successfully', async () => {
      const mockHouse = { _id: mockId, name: 'House 1' };

      House.findByIdAndDelete.mockResolvedValueOnce(mockHouse);

      await houseService.deleteHouse(mockId);

      expect(House.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(logger.info).toHaveBeenCalledWith(`service.js | Entrando en la función deleteHouse() con ID: ${mockId}`);
      expect(logger.info).toHaveBeenCalledWith(`service.js | Casa con ID ${mockId} eliminada con éxito`);
    });

    it('should throw an error if house is not found for deletion', async () => {
      House.findByIdAndDelete.mockResolvedValueOnce(null);

      await expect(houseService.deleteHouse(mockId)).rejects.toThrow('House not found');
      expect(logger.warn).toHaveBeenCalledWith(`service.js | Casa con ID ${mockId} no encontrada para eliminar`);
    });

    it('should throw an error if deletion fails', async () => {
      House.findByIdAndDelete.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(houseService.deleteHouse(mockId)).rejects.toThrow('Delete failed');
      expect(logger.error).toHaveBeenCalledWith(`service.js | Error al eliminar casa con ID ${mockId}`);
      expect(logger.debug).toHaveBeenCalledWith('service.js | Error: Delete failed');
    });
  });
});
