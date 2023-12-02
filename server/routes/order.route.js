import { Router } from 'express';
import { getAllOrders, getOrdersPerQueriedUser, createOrder, updateOrder } from '../controllers/order.controller.js';

const router = Router();

// *** get reserved books and borrowed books
// *** show reserve and borrowed books per user
router.route('/all').get(getAllOrders).post(createOrder);
router.route('/').get(getOrdersPerQueriedUser);

router.route('/:id').put(updateOrder);
// *** from reservation to borrowed
// *** user can cancel reservation

// *** reserved books expire after 2 hours
// *** borrowed books due date is 7 days from date borrowed
// *** limit book reservations to 5

export default router;