const express = require('express');
const router = express.Router();
const guesthouseController = require('../controllers/guesthouseController');
const {authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const { guesthouseCreateValidator } = require('../utils/validators');

router.get('/', guesthouseController.listGuesthouses);
router.post('/', authMiddleware, authorizeRoles('admin'), guesthouseCreateValidator, guesthouseController.createGuesthouse);

module.exports = router;
