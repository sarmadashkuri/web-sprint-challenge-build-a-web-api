const express = require('express');
const {
    validateActionId,
    validateActionInput,
} = require('./actions-middlware');

const Action = require('./actions-model');
const Project = require('../projects/projects-model');

const router = express.Router();

router.get('/', (req, res, next) => {
    Action.get()
        .then(action => {
            res.json(action);
        })
        .catch(next)
});

router.get('/:id', validateActionId, (req, res) => {
    res.json(req.action)
});

router.post('/', validateActionInput, async (req, res, next) => {
    try {
        const { project_id } = req.body;
        const project = await Project.get(project_id);
        if (!project) {
            next({ status: 400, message: 'id must match an existing project'});
        } else {
            const newAction = await Action.insert(req.body);
            console.log(req.body, newAction);
            res.status(201).json(newAction);
        }
    } catch (err) {
        next(err);
    }
});

router.put('/:id', validateActionId, (req, res, next) => {
    const { project_id, description, notes, completed } = req.body;
    console.log(req.body);
    if (!project_id || !description || !notes) {
        next({ status: 400, message: 'Please fill in the required fields'});
    } else if (completed === undefined) {
        next({ status: 400, message: 'Please update completed status'});
    } else {
        Action.update(req.params.id, req.body)
            .then(updatedAction => {
                res.status(200).json(updatedAction);
                console.log(updatedAction);
            })
            .catch(next);
    }
});

router.delete('/:id', validateActionId, (req, res, next) => {
    Action.remove(req.params.id)
        .then(() => {
            res.json(req.action);
        })
        .catch(next);
});

router.use((err, req, res, next) => { // eslint-disable-line
    res.status(err.status || 500).json({
        customMessage: 'something went wrong inside actions router',
        message: err.message,
        stack: err.stack,
    });
});

module.exports = router;
