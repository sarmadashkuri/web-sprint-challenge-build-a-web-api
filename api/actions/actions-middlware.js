const Action = require('./actions-model');

async function validateActionId(req, res, next) {
    try {
        const action = await Action.get(req.params.id);
        if (!action) {
            next({ status: 404, message: `action with id ${req.params.id} does not exist` });
        } else {
            req.action = action;
            next();
        }

    } catch (err) {
        res.status(500).json({
            message: 'problem fetching action'
        })
    }
}

function validateActionInput(req, res, next) {
    const { description, notes } = req.body;
    if (!description || !notes) {
        next({ status: 400, message: 'Please provide a descriptiion and a note for your project'});
    } else {
        next();
    }
}

module.exports = {
    validateActionId,
    validateActionInput,
}