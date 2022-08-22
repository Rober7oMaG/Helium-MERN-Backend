import express from 'express';
import { getUser, updateUser, deleteUser, followUser, unfollowUser } from '../controllers/UserController';

const router = express.Router();

router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.put('/follow/:id', followUser);
router.put('/unfollow/:id', unfollowUser);

export default router;