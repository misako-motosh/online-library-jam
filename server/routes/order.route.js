import { Router } from 'express';
import { getReservedBooks, getBorrowedBooks, getReservedBooksByUser, getBorrowedBooksByUser, createOrder, updateOrder } from '../controllers/order.controller.js';
import { verifyAccessToken } from '../modules/authenticator.js';

const router = Router();

router.route('/all').post(verifyAccessToken, createOrder);
router.route('/reserved/all').get(getReservedBooks);
router.route('/borrowed/all').get(getBorrowedBooks);
router.route('/reserved').get(verifyAccessToken, getReservedBooksByUser);
router.route('/borrowed').get(verifyAccessToken, getBorrowedBooksByUser);
router.route('/:id').put(updateOrder);

export default router; 