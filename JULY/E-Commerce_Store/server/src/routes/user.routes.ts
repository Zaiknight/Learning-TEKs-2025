import { Router } from 'express';
import { UserController } from '../controllers/users.controller';

const router = Router();

//Creating API routes using the functions we defined in controller

// GET /users → get all users
router.get('/',UserController.getAllUsers);

// GET /users/:id → get a single user by iD
router.get('/:id',UserController.getUserById);

// GET /users/:id → get a single user by iD
router.get(`/by-email/:email`,UserController.getUserByEmail);

// POST /users → create a new user
router.post('/',UserController.createUser);

// PUT /users/:id → update a user
router.put("/:id",UserController.updateUser);

// DELETE /users/:id → delete a user
router.delete("/:id", UserController.deleteUser);


export default router;
