const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
const {submitTestimonial, getTestimonials} = require('../Controllers/testimonial.controller');

router.post('/',submitTestimonial);
router.get('/',getTestimonials);

module.exports = router;