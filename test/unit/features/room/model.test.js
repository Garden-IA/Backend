const Room = require('../../../../src/features/room/model');
const { connect, disconnect } = require('mongoose');

describe('Room Model', () => {
  it('should create a room with required fields', async () => {
    const room = new Room({
      name: 'Luxury Suite',
      type: 'bedroom',
      humidity: 'medium',
      light: 'high',
    });

    await room.save();

    expect(room).toHaveProperty('_id');
    expect(room.name).toBe('Luxury Suite');
    expect(room.type).toBe('bedroom');
    expect(room.humidity).toBe('medium');
    expect(room.light).toBe('high');
    expect(room.createdAt).toBeDefined();
    expect(room.updatedAt).toBeDefined();
  });

  it('should update the updatedAt field before saving', async () => {
    const room = new Room({
      name: 'Standard Room',
      type: 'living room',
      humidity: 'low',
      light: 'medium',
    });

    await room.save();

    const createdAt = room.updatedAt;

    room.name = 'Updated Standard Room';
    await room.save();

    expect(room.updatedAt.getTime()).toBeGreaterThan(createdAt.getTime());
  });

  it('should have a default createdAt and updatedAt date', async () => {
    const room = new Room({
      name: 'Executive Room',
      type: 'office',
      humidity: 'high',
      light: 'low',
    });

    await room.save();

    expect(room.createdAt).toBeDefined();
    expect(room.updatedAt).toBeDefined();
  });

  it('should validate required fields', async () => {
    const room = new Room({
      type: 'bathroom',
      humidity: 'medium',
      light: 'low',
    });

    let error;
    try {
      await room.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.type).toBeUndefined();
    expect(error.errors.humidity).toBeUndefined();
    expect(error.errors.light).toBeUndefined();
  });

  it('should validate enum fields', async () => {
    const room = new Room({
      name: 'Invalid Room',
      type: 'kitchen',
      humidity: 'extreme', // Invalid value
      light: 'high',
    });

    let error;
    try {
      await room.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.humidity).toBeDefined();
  });
});
