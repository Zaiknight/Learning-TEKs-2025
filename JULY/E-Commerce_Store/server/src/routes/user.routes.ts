import { Router } from 'express';
import { UserController } from '../controllers/users.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

//Creating API routes using the functions we defined in controller

// GET /users → get all users
router.get('/',UserController.getAllUsers);

// GET /users/:id → get a single user by iD
router.get('/:id',UserController.getUserById);

// GET /users/email/:email → get a single user by iD
router.get(`/email/:email`,UserController.getUserByEmail);

router.get('/profile', authenticateJWT, UserController.getProfile);

// POST /users → create a new user
router.post('/',UserController.createUser);
// POST /users/login → login user and return token
router.post('/login', UserController.login);

// PUT /users/:id → update a user
router.put("/:id",UserController.updateUser);
router.put('/update/:id', authenticateJWT, UserController.updateUser);

// DELETE /users/:id → delete a user
router.delete("/:id", UserController.deleteUser);


export default router;
