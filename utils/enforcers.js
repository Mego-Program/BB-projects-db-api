const enforceGet = (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.sendStatus(405);
    } else {
        next();
    }
};

const enforcePatch = (req, res, next) => {
    if (req.method !== 'PATCH') {
        res.sendStatus(405);
    } else {
        next();
    }
};

const enforcePost = (req, res, next) => {
    if (req.method !== 'POST') {
        res.sendStatus(405);
    } else {
        next();
    }
};

const enforceDelete = (req, res, next) => {
    if (req.method !== 'DELETE') {
        res.sendStatus(405);
    } else {
        next();
    }
};

export {
    enforceGet,
    enforcePatch,
    enforcePost,
    enforceDelete
}