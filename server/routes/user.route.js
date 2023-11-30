import { Router } from 'express';
import {
  getUsers,
  createUser,
  loginUser,
  updateRoleToAdmin, 
  deleteUser,
  getSearchUser,
} from '../controllers/user.controller.js';

const router = Router();

router.route('/').get(getUsers);
router.route('/search').get(getSearchUser);
router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/:id').put(updateRoleToAdmin);
router.route('/:id').delete(deleteUser);

export default router;