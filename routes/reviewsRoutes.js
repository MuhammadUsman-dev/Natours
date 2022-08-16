const express = require('express');
const reviewController = require('../controller/reviewsController');
const authController = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.auth);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

module.exports = router;
