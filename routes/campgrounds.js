const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//IMPLEMENTING RESTFUL CRUD FUNCTIONALITY

//Create
router.get('/new', isLoggedIn, campgrounds.renderNewFrom); // Render Campground Form
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampGround)) // Actually make the campground

//Read
router.get('/', catchAsync(campgrounds.index)) //Reading all campgrounds
router.get('/:id', catchAsync(campgrounds.showCampground)) //Reading individual campgrounds


//Update
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) // Actually update the campground information
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm)) // Render campground edit form


//Delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) //Delete campground and all the related reviews

module.exports = router;