const express = require('express');
const {
    validateProjectId,
    validateProjectInput,
} = require('./projects-middleware');

const Project = require('./projects-model');
const Action = require('../actions/actions-model');

const router = express.Router();

router.get('/', (req, res, next) => {
    Project.get()
        .then(project => {
            res.json(project);
        })
        .catch(next);
});

router.get('/:id', validateProjectId, (req, res) => {
    res.json(req.project)
});

router.post('/', validateProjectInput, (req, res, next) => {
    // console.log(req.body);
    Project.insert({ name: req.body.name, description: req.body.description })
        .then(newProject => {
            res.status(201).json(newProject);
            console.log(newProject);
        })
        .catch(next);
});

router.put('/:id', validateProjectId, (req, res, next) => {
});

router.delete('/:id', validateProjectId, (req, res, next) => {
});

router.get('/:id/actions', validateProjectId, (req, res, next) => {
});

router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        customMessage: 'something went wrong inside projects router',
        message: err.message,
        stack: err.stack,
    });
});

module.exports = router;