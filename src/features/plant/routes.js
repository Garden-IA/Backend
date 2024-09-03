const express = require('express');
const router = express.Router();
const plantController = require('./controller');
const authMiddleware = require('../../middleware/auth');
const { logRequest } = require('../../middleware/loggerMiddleware');

router.use(logRequest);

/**
 * @swagger
 * tags:
 *   name: Plants
 *   description: Plant management endpoints
 */

/**
 * @swagger
 * /api/v1/plants:
 *   post:
 *     tags: [Plants]
 *     summary: Create a new plant
 *     description: Creates a new plant entry in the system.
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The common name of the plant
 *                 example: Aloe Vera
 *               scientificName:
 *                 type: string
 *                 description: The scientific name of the plant
 *                 example: Aloe barbadensis miller
 *               species:
 *                 type: string
 *                 description: The species of the plant
 *                 example: Succulent
 *               waterFrequency:
 *                 type: number
 *                 description: The number of days between waterings
 *                 example: 7
 *               sunlight:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 description: The amount of sunlight required by the plant
 *                 example: Medium
 *               room:
 *                 type: string
 *                 description: The ID of the room where the plant is located
 *                 example: 60b8d6f7c9d3466a7a5f2b4a
 *           required:
 *             - name
 *             - waterFrequency
 *             - sunlight
 *             - room
 *     responses:
 *       201:
 *         description: Plant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the created plant
 *                   example: 60b8d6f7c9d3466a7a5f2b4a
 *                 message:
 *                   type: string
 *                   example: Plant created successfully
 *       400:
 *         description: Bad request, possibly due to invalid input
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post('/plants', authMiddleware.verifyToken, plantController.createPlant);

/**
 * @swagger
 * /api/v1/plants:
 *   get:
 *     tags: [Plants]
 *     summary: Get all plants
 *     description: Retrieves a list of all plants for the authenticated user.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of plants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the plant
 *                     example: 60b8d6f7c9d3466a7a5f2b4a
 *                   name:
 *                     type: string
 *                     description: The common name of the plant
 *                     example: Aloe Vera
 *                   scientificName:
 *                     type: string
 *                     description: The scientific name of the plant
 *                     example: Aloe barbadensis miller
 *                   species:
 *                     type: string
 *                     description: The species of the plant
 *                     example: Succulent
 *                   waterFrequency:
 *                     type: number
 *                     description: The number of days between waterings
 *                     example: 7
 *                   sunlight:
 *                     type: string
 *                     enum: [Low, Medium, High]
 *                     description: The amount of sunlight required by the plant
 *                     example: Medium
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/plants', authMiddleware.verifyToken, plantController.getAllPlants);

/**
 * @swagger
 * /api/v1/plants/{id}:
 *   get:
 *     tags: [Plants]
 *     summary: Get plant by ID
 *     description: Retrieves a specific plant by its ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the plant to retrieve
 *     responses:
 *       200:
 *         description: Plant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the plant
 *                   example: 60b8d6f7c9d3466a7a5f2b4a
 *                 name:
 *                   type: string
 *                   description: The common name of the plant
 *                   example: Aloe Vera
 *                 scientificName:
 *                   type: string
 *                   description: The scientific name of the plant
 *                   example: Aloe barbadensis miller
 *                 species:
 *                   type: string
 *                   description: The species of the plant
 *                   example: Succulent
 *                 waterFrequency:
 *                   type: number
 *                   description: The number of days between waterings
 *                   example: 7
 *                 sunlight:
 *                   type: string
 *                   enum: [Low, Medium, High]
 *                   description: The amount of sunlight required by the plant
 *                   example: Medium
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: Plant not found
 *       500:
 *         description: Internal server error
 */
router.get('/plants/:id', authMiddleware.verifyToken, plantController.getPlantById);

/**
 * @swagger
 * /api/v1/plants/{id}:
 *   put:
 *     tags: [Plants]
 *     summary: Update plant by ID
 *     description: Updates the details of an existing plant by its ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the plant to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The common name of the plant
 *                 example: Aloe Vera
 *               scientificName:
 *                 type: string
 *                 description: The scientific name of the plant
 *                 example: Aloe barbadensis miller
 *               species:
 *                 type: string
 *                 description: The species of the plant
 *                 example: Succulent
 *               waterFrequency:
 *                 type: number
 *                 description: The number of days between waterings
 *                 example: 7
 *               sunlight:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 description: The amount of sunlight required by the plant
 *                 example: Medium
 *               room:
 *                 type: string
 *                 description: The ID of the room where the plant is located
 *                 example: 60b8d6f7c9d3466a7a5f2b4a
 *           required:
 *             - name
 *             - waterFrequency
 *             - sunlight
 *             - room
 *     responses:
 *       200:
 *         description: Plant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plant updated successfully
 *       400:
 *         description: Bad request, possibly due to invalid input
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: Plant not found
 *       500:
 *         description: Internal server error
 */
router.put('/plants/:id', authMiddleware.verifyToken, plantController.updatePlant);

/**
 * @swagger
 * /api/v1/plants/{id}:
 *   delete:
 *     tags: [Plants]
 *     summary: Delete plant by ID
 *     description: Deletes a specific plant by its ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the plant to delete
 *     responses:
 *        200:
 *         description: Plant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plant deleted successfully
 *        401:
 *          description: Unauthorized, token is missing or invalid
 *        404:
 *          description: Plant not found
 *        500:
 *          description: Internal server error
 */
router.delete('/plants/:id', authMiddleware.verifyToken, plantController.deletePlant);

module.exports = router;
