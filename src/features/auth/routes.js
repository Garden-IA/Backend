const express = require('express');
const router = express.Router();
const authController = require('./controller');
const authMiddleware = require('../../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Registers a new user with an email and password. The server will create a new user and return a success message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address for the new user
 *                 example: user1@example.com
 *               password:
 *                 type: string
 *                 description: The password for the new user
 *                 example: password123
 *           required:
 *             - email
 *             - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Bad request, possibly due to invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     description: Logs in a user by verifying the email and password. Returns a JWT token if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user trying to log in
 *                 example: user1@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user trying to log in
 *                 example: password123
 *           required:
 *             - email
 *             - password
 *     responses:
 *       200:
 *         description: Successful login, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       400:
 *         description: Invalid credentials provided
 *       500:
 *         description: Internal server error
 */
router.post('/login', authController.login);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User-related endpoints
 */

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user profile information
 *     description: Retrieves the profile information of the currently authenticated user.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: User profile information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the user
 *                   example: 1
 *                 username:
 *                   type: string
 *                   description: The username of the user
 *                   example: user1
 *                 email:
 *                   type: string
 *                   description: The email address of the user
 *                   example: user1@example.com
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       500:
 *         description: Internal server error
 *     securitySchemes:
 *       Bearer:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);

/**
 * @swagger
 * /api/v1/users/update:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user profile information
 *     description: Updates the profile information of the currently authenticated user.
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username of the user
 *                 example: newuser1
 *               email:
 *                 type: string
 *                 description: The new email address of the user
 *                 example: newuser1@example.com
 *               password:
 *                 type: string
 *                 description: The new password for the user
 *                 example: newpassword123
 *           required:
 *             - username
 *             - email
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the user
 *                   example: 1
 *                 username:
 *                   type: string
 *                   description: The updated username of the user
 *                   example: newuser1
 *                 email:
 *                   type: string
 *                   description: The updated email address of the user
 *                   example: newuser1@example.com
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       400:
 *         description: Bad request, possibly due to invalid input
 *       500:
 *         description: Internal server error
 */
router.put('/update', authMiddleware.verifyToken, authController.updateProfile);

module.exports = router;
