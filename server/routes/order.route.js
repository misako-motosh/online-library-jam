import { Router } from 'express';
import { getAllOrders, getOrdersPerQueriedUser, createOrder, updateOrder } from '../controllers/order.controller.js';

const router = Router();

// *** get reserved books and borrowed books
// *** show reserve and borrowed books per user
// *** reserved books expire after 1 day from date reserved
// *** borrowed books due date is 7 days from date reserved
// *** limit book reservations to 5
router.route('/all').get(getAllOrders).post(createOrder);
router.route('/').get(getOrdersPerQueriedUser);

// *** from reservation to borrowed
// *** user can cancel reservation
router.route('/:id').put(updateOrder);

export default router;