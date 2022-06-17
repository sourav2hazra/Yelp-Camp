const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


//READ ALL CAMPGROUNDS
//Render all campgrounds: GET
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds: campgrounds});
}

//Render Individual Campground: GET
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Campground does not exist!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground: campground})
}


//CREATE NEW CAMPGROUNDS
//Render Campground Making Form: GET
module.exports.renderNewFrom = (req, res) => {
    res.render('campgrounds/new');
}

//Actually Creating new campground: POST
module.exports.createCampGround = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground)
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.author = req.user._id;
    newCampground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    console.log(newCampground);
    await newCampground.save();
    req.flash('success', 'Successfully created new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`)
}

//UPDATE
//Render the update form: GET
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Campground does not exist!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground: campground})
}

//Actually update the campground content: PUT
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}


//DELETE
//Delete a campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}