const express = require('express');
const router = express.Router();
const { getHospitals, getHospital, searchHospitals, getNearbyHospitals, addReview, getReviews, toggleFavorite } = require('../controllers/hospital');

router.get('/', getHospitals);
router.get('/search', searchHospitals);
router.get('/nearby', getNearbyHospitals);
router.get('/:id', getHospital);
router.get('/:id/reviews', getReviews);
router.post('/:id/reviews', addReview);
router.post('/:id/favorite', toggleFavorite);
router.delete('/:id/favorite', toggleFavorite);

module.exports = router;