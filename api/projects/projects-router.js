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
    Project.insert(req.body)
        .then(newProject => {
            console.log(newProject);
            res.status(201).json(newProject);
        })
        .catch(next);
});

router.put('/:id', validateProjectId, (req, res, next) => {
    const { name, description, completed } = req.body;
    console.log(req.body);
    if (!name || !description) {
        res.status(400).json({ message: 'please fill in the required fields'});
    } else if (completed === undefined) {
        res.status(400).json({ message: 'Please provide the completed field' });
    } else {
        Project.update(req.params.id, req.body)
        .then(updatedProject => {
            res.status(200).json(updatedProject)
            console.log(updatedProject);
        })
        .catch(next);
    }
});

router.delete('/:id', validateProjectId, (req, res, next) => {
    Project.remove(req.params.id,)
        .then(() => {
            res.json(req.project);
        })
        .catch(next);
});

router.get('/:id/actions', validateProjectId, (req, res, next) => {
    Project.getProjectActions(req.params.id)
        .then(actions => {
            res.json(actions)
        })
        .catch(next);
});

router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        customMessage: 'something went wrong inside projects router',
        message: err.message,
        stack: err.stack,
    });
});

module.exports = router;