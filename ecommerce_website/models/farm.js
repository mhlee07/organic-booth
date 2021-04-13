const mongoose = require('mongoose')
const imageBasePath = 'uploads/images'    // Set up image basic path
const path = require('path')

const farmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    produce: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
})

// Create virtual property
farmSchema.virtual('imagePath').get(function() {
    if(this.image != null) {
        return path.join('/', imageBasePath, this.image)
    }
})

// Export
module.exports = mongoose.model('Farm', farmSchema)
module.exports.imageBasePath = imageBasePath
