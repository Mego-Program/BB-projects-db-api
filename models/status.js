const db = require('../connect');

const Status = db.model('Status', require('./schemas').statusSchema);

const ToDo = getDefaultStatus('To Do');
const InProgress = getDefaultStatus('In Progress');
const Done = getDefaultStatus('Done');

const defaultStatusDescriptions = {
    'To Do': 'Tasks that are yet to be started.',
    'In Progress': 'Tasks that are in progress.',
    'Done': 'Tasks that are completed.'
};
const defaultStatusPrecedences = {
    'To Do': 0,
    'In Progress': 50,
    'Done': 99
};

async function getDefaultStatus(name) {
    let query = await Status.findOne({ name: name });
    if (query) {
        console.log('retreived default status: '+ query.name)
        return query;
    } else {
    console.log('creating default status: '+ name);
    return new Status({
        name: name,
        description: defaultStatusDescriptions[name],
        creationDate: Date.now(),
        precedence: defaultStatusPrecedences[name]
    }).save();
};
};

const defaultStatuses = {
    ToDo: ToDo,
    InProgress: InProgress,
    Done: Done
}
module.exports = defaultStatuses;

// possible future feature: create custom statuses

// const express = require('express');
// const router = express.Router();

// router.all('/create', (req, res, next) => {
//     if (req.method !== 'POST') {
//         res.sendStatus(405);
//     } else {
//         next();
//     }
// });
// router.post('/create', (req, res) => {
//     let status = new Status(req.body);
//     status.save((err) => {
//         if (err) {
//             console.log(err);
//             res.sendStatus(500);
//         } else {
//             res.sendStatus(201);
//         }
//     });
// });

// router.all('/update', (req, res, next) => {
//     if (req.method !== 'PUT') {
//         res.sendStatus(405);
//     } else {
//         next();
//     }
// });
// router.put('/update', (req, res) => {
//     res.sendStatus(501);
// });

// router.all('/delete', (req, res, next) => {
//     if (req.method !== 'DELETE') {
//         res.sendStatus(405);
//     } else {
//         next();
//     }
// });
// router.delete('/delete', (req, res) => {
//     res.sendStatus(501);
// });

// module.exports = router;