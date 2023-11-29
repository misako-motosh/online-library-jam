import { Router } from 'express';

const router = Router();

// *** get reserved books and borrowed books
router.route('/').get();

// *** show reserve and borrowed books per user
// *** from reservation to borrowed
// *** user can cancel reservation
router.route('/orders').get().post().put().delete();

// *** reserved books expire after 2 hours
// *** borrowed books due date is 7 days from date borrowed
// *** limit book reservations to 5

export default router;