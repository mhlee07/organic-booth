const express = require('express')
const router = express.Router()
const Farm = require('../models/farm')
const fs = require('fs')
const path = require('path')
const uploadPath = path.join('public', Farm.imageBasePath)
const fileType = ['image/jpg', 'image/png']
const multer = require('multer')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {      
        callback(null, fileType.includes(file.mimetype))
    }
})

// All farms
router.get('/', async (req, res) => {
    const searchBar = {}
    if(req.query.name != null && req.query.name != '') {
        searchBar.name = new RegExp(req.query.name, 'i')
    }
    if(req.query.location != null && req.query.location != '') {
        searchBar.location = new RegExp(req.query.location, 'i') 
    }
    if(req.query.produce != null && req.query.produce != '') {
        searchBar.produce = new RegExp(req.query.produce, 'i') 
    }
    try {
        const farms = await Farm.find(searchBar)
        res.status(200).render('farms/searchFarm', {
            farms: farms,
            searchBar: req.query
        })
    } catch(err) {
        console.error(err.message)
        res.redirect('/')
    }
})

// New farms
router.get('/new', (req, res) => {
    res.render('farms/new', { farm : new Farm() })
})

// Create farms
router.post('/', upload.single('image'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const farm = new Farm({
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        produce: req.body.produce,
        image: fileName
    })

    try {
        const newFarm = await farm.save()
        res.status(200).render('farms/show', { farm : newFarm })
    } catch(err) {
        // Prevent image saved into folder if creating profile is failed
        if(farm.image != null) {
            removeImage(farm.image)
        }

        console.error(err.message)
        res.status(400).render('farms/new', {   
        farm: farm,
        errorMessage: 'Failed to create profile!'
        })
    }
}) 

function removeImage(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err.message)
    })
}


// Show farms
router.get('/:id', async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id)
        res.status(200).render('farms/show', { farm: farm })
    } catch {
        res.redirect('/farms')
    }
})

// Edit farms
router.get('/:id/edit', async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id)
        res.status(200).render('farms/edit', { farm : farm })
    } catch(err) {
        console.error(err.message)
        res.status(400).redirect('/farms')
    }
})

// Update farms
router.put('/:id', upload.single('image'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null    
    let farm
    
    try {
        farm = await Farm.findById(req.params.id)

        farm.name = req.body.name
        farm.location = req.body.location
        farm.description = req.body.description
        farm.produce = req.body.produce

        // Check if image needs to be modified
        if(req.file != null) {
            farm.image = fileName
        }

        await farm.save()
        res.status(200).redirect(`/farms/${req.params.id}`)
    } catch(err) {
        if(farm == null) {
            res.redirect('/farms')
        } else {
            console.error(err.message)
            res.status(400).render('farms/edit', {
            farm: farm,
            errorMessage: 'Failed to update profile!'
            })
        }
    }
})

// Delete farms
router.delete('/:id', async (req, res) => {
    let farm

    try {
        farm = await Farm.findById(req.params.id)
        await farm.remove()
        res.status(200).render('farms/doneDelete', {
            farm : farm,
            message : 'The info below was deleted.'
        })
    } catch(err) {
        if(farm == null) {
            res.redirect('/farms')
        }
        console.error(err.message)
        res.status(503).redirect(`/farms/${farm.id}`)
    }
})


// Export router
module.exports = router