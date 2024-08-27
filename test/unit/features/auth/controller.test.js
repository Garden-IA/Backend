const { createHouse, getAllHouses, getHouseById, updateHouse, deleteHouse } = require('../../../../src/features/house/controller');
const houseService = require('../../../../src/features/house/service');
const logger = require('../../../../src/config/logger');

jest.mock('../../../../src/features/house/service'); // Mocks para houseService
jest.mock('../../../../src/config/logger'); // Mocks para logger

describe('House Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createHouse', () => {
    it('should create a new house successfully', async () => {
      const req = {
        body: {
          name: 'Beautiful House',
          location: 'New York',
          description: 'A beautiful house in New York',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockHouse = { _id: '123456' };

      houseService.createHouse.mockResolvedValue(mockHouse);

      await createHouse(req, res);

      expect(houseService.createHouse).toHaveBeenCalledWith('Beautiful House', 'New York', 'A beautiful house in New York');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: mockHouse._id, message: 'House created successfully' });
    });

    it('should return 400 if name or location is missing', async () => {
      const req = {
        body: {
          name: 'House Without Location',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createHouse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Name and location are required' });
    });

    it('should handle internal server error', async () => {
      const req = {
        body: {
          name: 'Another House',
          location: 'Los Angeles',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      houseService.createHouse.mockRejectedValue(new Error('Database error'));

      await createHouse(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', error: 'Database error' });
    });
  });

  describe('getAllHouses', () => {
    it('should get all houses successfully', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockHouses = [{ name: 'House 1' }, { name: 'House 2' }];

      houseService.getAllHouses.mockResolvedValue(mockHouses);

      await getAllHouses(req, res);

      expect(houseService.getAllHouses).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockHouses);
    });

    it('should handle internal server error', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      houseService.getAllHouses.mockRejectedValue(new Error('Database error'));

      await getAllHouses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', error: 'Database error' });
    });
  });

  describe('getHouseById', () => {
    it('should get a house by ID successfully', async () => {
      const req = { params: { id: '123456' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockHouse = { name: 'House by ID' };

      houseService.getHouseById.mockResolvedValue(mockHouse);

      await getHouseById(req, res);

      expect(houseService.getHouseById).toHaveBeenCalledWith('123456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockHouse);
    });

    it('should return 404 if house not found', async () => {
      const req = { params: { id: '999999' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      houseService.getHouseById.mockRejectedValue(new Error('House not found'));

      await getHouseById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'House not found' });
    });

    it('should handle internal server error', async () => {
      const req = { params: { id: '123456' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      houseService.getHouseById.mockRejectedValue(new Error('Database error'));

      await getHouseById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', error: 'Database error' });
    });
  });

  describe('updateHouse', () => {
    it('should update a house by ID successfully', async () => {
      const req = {
        params: { id: '123456' },
        body: { name: 'Updated House', location: 'Updated Location' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockUpdatedHouse = { name: 'Updated House', location: 'Updated Location' };

      houseService.updateHouse.mockResolvedValue(mockUpdatedHouse);

      await updateHouse(req, res);

      expect(houseService.updateHouse).toHaveBeenCalledWith('123456', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'House updated successfully', house: mockUpdatedHouse });
    });

    it('should return 404 if house to update not found', async () => {
      const req = {
        params: { id: '999999' },
        body: { name: 'Nonexistent House' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      houseService.updateHouse.mockRejectedValue(new Error('House not found'));

      await updateHouse(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'House not found' });
    });

    it('should handle internal server error', async () => {
      const req = {
        params: { id: '123456' },
        body: { name: 'Error House' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      houseService.updateHouse.mockRejectedValue(new Error('Database error'));

      await updateHouse(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', error: 'Database error' });
    });
  });

  describe('deleteHouse', () => {
    it('should delete a house by ID successfully', async () => {
      const req = { params: { id: '123456' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      houseService.deleteHouse.mockResolvedValue();

      await deleteHouse(req, res);

      expect(houseService.deleteHouse).toHaveBeenCalledWith('123456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'House deleted successfully' });
    });

    it('should return 404 if house to delete not found', async () => {
      const req = { params: { id: '999999' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      houseService.deleteHouse.mockRejectedValue(new Error('House not found'));

      await deleteHouse(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'House not found' });
    });

    it('should handle internal server error', async () => {
      const req = { params: { id: '123456' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      houseService.deleteHouse.mockRejectedValue(new Error('Database error'));

      await deleteHouse(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', error: 'Database error' });
    });
  });
});
