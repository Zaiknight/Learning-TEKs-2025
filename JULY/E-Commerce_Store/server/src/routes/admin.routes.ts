import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

//Creating API routes using the functions we defined in controller

// GET /admins → get all admins
router.get('/',AdminController.getAllAdmins);

// GET /admins/:id → get a single admin by iD
router.get('/:id',AdminController.getAdminById);

// GET /admins/email/:email → get a single admin by iD
router.get(`/email/:email`,AdminController.getAdminByEmail);

router.get('/profile', authenticateJWT, AdminController.getProfile);

// POST /admins → create a new admin
router.post('/',AdminController.createAdmin);
// POST /admins/login → login admin and return token
router.post('/login', AdminController.login);

// PUT /admins/:id → update a admin
router.put("/:id",AdminController.updateAdmin);
router.put('/update/:id', authenticateJWT, AdminController.updateAdmin);

// DELETE /admins/:id → delete a admin
router.delete("/:id", AdminController.deleteAdmin);


export default router;
