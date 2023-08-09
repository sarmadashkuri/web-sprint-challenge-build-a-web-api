const Project = require('./projects-model');

function logger(req, res, next) {
    const timestamp = new Date().toLocaleString();
    const method = req.method;
    const url = req.originalUrl;
    console.log(`[${timestamp}] ${method} to ${url}`);
    next();
}

async function validateProjectId(req, res, next) {
    try {
        const project = await Project.get(req.params.id);
        if (!project) {
            next({ status: 404, message: `project with id ${req.params.id} does not exist` });
        } else {
            req.project = project;
            next();
        }
    } catch (err) {
        res.status(500).json({
            message: 'problem fetching project,'
        });
    }
}

function validateProjectInput(req, res, next) {
    const { name, description } = req.body;
    if (!name || !description) {
        next({ status: 400, message: 'Please provide name and description for your project'});
    } else {
        next();
    }
}


module.exports = {
    logger,
    validateProjectId,
    validateProjectInput,
}