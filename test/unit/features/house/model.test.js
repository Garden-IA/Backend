const House = require('../../../../src/features/house/model');

describe('House Model', () => {
  it('should create a house with required fields', async () => {
    const house = new House({
      name: 'Spacious Villa',
      location: 'Beverly Hills',
    });

    await house.save();

    expect(house).toHaveProperty('_id');
    expect(house.name).toBe('Spacious Villa');
    expect(house.location).toBe('Beverly Hills');
    expect(house.createdAt).toBeDefined();
    expect(house.updatedAt).toBeDefined();
  });

  it('should update the updatedAt field before saving', async () => {
    const house = new House({
      name: 'Cozy Cottage',
      location: 'Aspen',
    });

    await house.save();

    const createdAt = house.updatedAt;

    house.name = 'Cozy Cottage Updated';
    await house.save();

    expect(house.updatedAt.getTime()).toBeGreaterThan(createdAt.getTime());
  });

  it('should have a default createdAt and updatedAt date', async () => {
    const house = new House({
      name: 'Modern Loft',
      location: 'New York',
    });

    await house.save();

    expect(house.createdAt).toBeDefined();
    expect(house.updatedAt).toBeDefined();
  });

  it('should validate required fields', async () => {
    const house = new House({ location: 'San Francisco' });

    let error;
    try {
      await house.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
  });
});
