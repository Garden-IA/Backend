const express = require('express');
const router = express.Router();
const roomController = require('./controller');
const authMiddleware = require('../../middleware/auth');
const { logRequest } = require('../../middleware/loggerMiddleware');

router.use(logRequest);

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management endpoints
 */

/**
 * @swagger
 * /api/v1/rooms:
 *   post:
 *     tags: [Rooms]
 *     summary: Create a new room
 *     description: Creates a new room entry in the system. Requires the ID of the house to which the room belongs.
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
 *                 description: The name of the room
 *                 example: Living Room
 *               type:
 *                 type: string
 *                 description: The type of room (e.g., bedroom, living room)
 *                 example: Living Room
 *               humidity:
 *                 type: string
 *                 description: The humidity level in the room
 *                 enum: [low, medium, high]
 *                 example: medium
 *               airConditioner:
 *                 type: boolean
 *                 description: Indicates if there is an air conditioner in the room
 *                 example: true
 *               radiator:
 *                 type: boolean
 *                 description: Indicates if there is a radiator in the room
 *                 example: false
 *               light:
 *                 type: string
 *                 description: The light level in the room
 *                 enum: [low, medium, high]
 *                 example: high
 *               houseId:
 *                 type: string
 *                 description: The ID of the house to which the room belongs
 *                 example: 60b8d6f7c9d3466a7a5f2b4a
 *               plants:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Array of plant IDs in the room
 *                   example: [60b8d6f7c9d3466a7a5f2b4b, 60b8d6f7c9d3466a7a5f2b4c]
 *           required:
 *             - name
 *             - type
 *             - humidity
 *             - light
 *             - houseId
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the created room
 *                   example: 60b8d6f7c9d3466a7a5f2b4d
 *                 message:
 *                   type: string
 *                   example: Room created successfully
 *       400:
 *         description: Bad request, possibly due to invalid input
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post('/rooms', authMiddleware.verifyToken, roomController.createRoom);

/**
 * @swagger
 * /api/v1/rooms:
 *   get:
 *     tags: [Rooms]
 *     summary: Get all rooms
 *     description: Retrieves a list of all rooms.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of rooms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the room
 *                     example: 60b8d6f7c9d3466a7a5f2b4d
 *                   name:
 *                     type: string
 *                     description: The name of the room
 *                     example: Living Room
 *                   type:
 *                     type: string
 *                     description: The type of room
 *                     example: Living Room
 *                   humidity:
 *                     type: string
 *                     description: The humidity level in the room
 *                     example: medium
 *                   airConditioner:
 *                     type: boolean
 *                     description: Indicates if there is an air conditioner in the room
 *                     example: true
 *                   radiator:
 *                     type: boolean
 *                     description: Indicates if there is a radiator in the room
 *                     example: false
 *                   light:
 *                     type: string
 *                     description: The light level in the room
 *                     example: high
 *                   plants:
 *                     type: array
 *                     items:
 *                       type: string
 *                       description: Array of plant IDs in the room
 *                     example: [60b8d6f7c9d3466a7a5f2b4b, 60b8d6f7c9d3466a7a5f2b4c]
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/rooms', authMiddleware.verifyToken, roomController.getAllRooms);

/**
 * @swagger
 * /api/v1/rooms/{id}:
 *   get:
 *     tags: [Rooms]
 *     summary: Get room by ID
 *     description: Retrieves a specific room by its ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to retrieve
 *     responses:
 *       200:
 *         description: Room retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the room
 *                   example: 60b8d6f7c9d3466a7a5f2b4d
 *                 name:
 *                   type: string
 *                   description: The name of the room
 *                   example: Living Room
 *                 type:
 *                   type: string
 *                   description: The type of room
 *                   example: Living Room
 *                 humidity:
 *                   type: string
 *                   description: The humidity level in the room
 *                   example: medium
 *                 airConditioner:
 *                   type: boolean
 *                   description: Indicates if there is an air conditioner in the room
 *                   example: true
 *                 radiator:
 *                   type: boolean
 *                   description: Indicates if there is a radiator in the room
 *                   example: false
 *                 light:
 *                   type: string
 *                   description: The light level in the room
 *                   example: high
 *                 plants:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Array of plant IDs in the room
 *                   example: [60b8d6f7c9d3466a7a5f2b4b, 60b8d6f7c9d3466a7a5f2b4c]
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.get('/rooms/:id', authMiddleware.verifyToken, roomController.getRoomById);

/**
 * @swagger
 * /api/v1/rooms/{id}:
 *   put:
 *     tags: [Rooms]
 *     summary: Update room by ID
 *     description: Updates the details of an existing room by its ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the room
 *                 example: Living Room
 *               type:
 *                 type: string
 *                 description: The type of room (e.g., bedroom, living room)
 *                 example: Living Room
 *               humidity:
 *                 type: string
 *                 description: The humidity level in the room
 *                 enum: [low, medium, high]
 *                 example: medium
 *               airConditioner:
 *                 type: boolean
 *                 description: Indicates if there is an air conditioner in the room
 *                 example: true
 *               radiator:
 *                 type: boolean
 *                 description: Indicates if there is a radiator in the room
 *                 example: false
 *               light:
 *                 type: string
 *                 description: The light level in the room
 *                 enum: [low, medium, high]
 *                 example: high
 *               plants:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Array of plant IDs in the room
 *                   example: [60b8d6f7c9d3466a7a5f2b4b, 60b8d6f7c9d3466a7a5f2b4c]
 *           required:
 *             - name
 *             - type
 *             - humidity
 *             - light
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room updated successfully
 *       400:
 *         description: Bad request, possibly due to invalid input
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.put('/rooms/:id', authMiddleware.verifyToken, roomController.updateRoom);

/**
 * @swagger
 * /api/v1/rooms/{id}:
 *   delete:
 *     tags: [Rooms]
 *     summary: Delete room by ID
 *     description: Deletes a specific room by its ID.
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to delete
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Room deleted successfully
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.delete('/rooms/:id', authMiddleware.verifyToken, roomController.deleteRoom);

module.exports = router;
