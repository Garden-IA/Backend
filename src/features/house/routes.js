const express = require('express');
const router = express.Router();
const houseController = require('./controller');
const authMiddleware = require('../../middleware/auth');
const { logRequest } = require('../../middleware/loggerMiddleware');

router.use(logRequest);

/**
 * @swagger
 * tags:
 *   name: Houses
 *   description: House management endpoints
 */

/**
 * @swagger
 * /api/v1/houses:
 *   post:
 *     tags: [Houses]
 *     summary: Create a new house
 *     description: Creates a new house entry in the system.
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
 *                 description: The name of the house
 *                 example: My House
 *               location:
 *                 type: string
 *                 description: The location of the house
 *                 example: 123 Main St
 *               description:
 *                 type: string
 *                 description: Optional description of the house
 *                 example: A cozy house with a beautiful garden
 *           required:
 *             - name
 *             - location
 *     responses:
 *       201:
 *         description: House created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the created house
 *                   example: 60b8d6f7c9d3466a7a5f2b4a
 *                 message:
 *                   type: string
 *                   example: House created successfully
 *       400:
 *         description: Bad request, possibly due to invalid input
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post('/houses', authMiddleware.verifyToken, houseController.createHouse);

/**
 * @swagger
 * /api/v1/houses:
 *   get:
 *     tags: [Houses]
 *     summary: Get all houses
 *     description: Retrieves a list of all houses.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of houses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the house
 *                     example: 60b8d6f7c9d3466a7a5f2b4a
 *                   name:
 *                     type: string
 *                     description: The name of the house
 *                     example: My House
 *                   location:
 *                     type: string
 *                     description: The location of the house
 *                     example: 123 Main St
 *                   description:
 *                     type: string
 *                     description: Optional description of the house
 *                     example: A cozy house with a beautiful garden
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/houses', authMiddleware.verifyToken, houseController.getAllHouses);

/**
 * @swagger
 * /api/v1/houses/{id}:
 *   get:
 *     tags: [Houses]
 *     summary: Get house by ID
 *     description: Retrieves a specific house by its ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the house to retrieve
 *     responses:
 *       200:
 *         description: House retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the house
 *                   example: 60b8d6f7c9d3466a7a5f2b4a
 *                 name:
 *                   type: string
 *                   description: The name of the house
 *                   example: My House
 *                 location:
 *                   type: string
 *                   description: The location of the house
 *                   example: 123 Main St
 *                 description:
 *                   type: string
 *                   description: Optional description of the house
 *                   example: A cozy house with a beautiful garden
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: House not found
 *       500:
 *         description: Internal server error
 */
router.get('/houses/:id', authMiddleware.verifyToken, houseController.getHouseById);

/**
 * @swagger
 * /api/v1/houses/{id}:
 *   put:
 *     tags: [Houses]
 *     summary: Update house by ID
 *     description: Updates the details of an existing house by its ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the house to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the house
 *                 example: My House
 *               location:
 *                 type: string
 *                 description: The location of the house
 *                 example: 123 Main St
 *               description:
 *                 type: string
 *                 description: Optional description of the house
 *                 example: A cozy house with a beautiful garden
 *           required:
 *             - name
 *             - location
 *     responses:
 *       200:
 *         description: House updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: House updated successfully
 *       400:
 *         description: Bad request, possibly due to invalid input
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: House not found
 *       500:
 *         description: Internal server error
 */
router.put('/houses/:id', authMiddleware.verifyToken, houseController.updateHouse);

/**
 * @swagger
 * /api/v1/houses/{id}:
 *   delete:
 *     tags: [Houses]
 *     summary: Delete house by ID
 *     description: Deletes a specific house by its ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the house to delete
 *     responses:
 *       200:
 *         description: House deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: House deleted successfully
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: House not found
 *       500:
 *         description: Internal server error
 */
router.delete('/houses/:id', authMiddleware.verifyToken, houseController.deleteHouse);

module.exports = router;
