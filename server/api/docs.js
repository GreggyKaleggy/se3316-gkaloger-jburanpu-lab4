const express = require('express');
const Docs = require('../schema/documentSchema');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const userSchema = require('../schema/userSchema');
const instructions = require('../schema/instructionsSchema');
router.use(express.json())


// @route   GET api/docs
// @desc    Get all docs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const docs = await Docs.find();
        res.json(docs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/newdoc',
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required, up to 1000 characters').not().isEmpty().isLength({ min: 1, max: 1000 }),
    auth, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const currentUser = await userSchema.findById(req.user.id);
            if (!currentUser.isAdmin) {
                return res.status(401).json({ msg: 'You are not authorized to perform this action' });
            }
            const { title, content } = req.body;
            const newDoc = new Docs({
                title,
                content
            });
            const doc = await newDoc.save();
            res.json(doc);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

router.put('/editdoc/:id', [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required, up to 1000 characters').not().isEmpty().isLength({ min: 1, max: 1000 })
], auth, async (req, res) => {
    try {
        const currentUser = await userSchema.findById(req.user.id);
        if (!currentUser.isAdmin) {
            return res.status(401).json({ msg: 'You are not authorized to perform this action' });
        }
        const { title, content } = req.body;
        const doc = await Docs.findOneAndUpdate({ _id: req.params.id }, { title, content, modified: Date.now() }, { new: true });
        if (!doc) {
            return res.status(404).json({ msg: 'Document not found' });
        }
        res.json(doc);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/deletedoc/:name', auth, async (req, res) => {
    try {
        const currentUser = await userSchema.findById(req.user.id);
        if (!currentUser.isAdmin) {
            return res.status(401).json({ msg: 'You are not authorized to perform this action' });
        }
        const doc = await Docs.findOneAndDelete({ title: req.params.name });
        if (!doc) {
            return res.status(404).json({ msg: 'Document not found' });
        }
        res.json("Document deleted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/find/:id', async (req, res) => {
    try {
        const doc = await Docs.findOne({ _id: req.params.id });
        if (!doc) {
            return res.status(404).json({ msg: 'Document not found' });
        }
        res.json(doc);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/instructions', auth, async (req, res) => {
    try {
        const user = await userSchema.findById(req.user.id);
        if (!user.isAdmin) {
            return res.status(401).json({ msg: 'You are not authorized to perform this action' });
        }
        const instruction = await instructions.findOne({ title: 'DMCA and Takedown Policy How to' });
        res.json(instruction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = { router };