const db = require('../connect');

const Status = db.model('Status', require('./schemas').statusSchema);

const Open = getDefaultStatus('Open');
const InProgress = getDefaultStatus('In Progress');
const Resolved = getDefaultStatus('Resolved');
const Closed = getDefaultStatus('Closed');

const defaultStatusDescriptions = {
    'Open': 'Tasks that are yet to be started.',
    'In Progress': 'Tasks that are in progress.',
    'Resolved': 'Tasks that are resolved.',
    'Closed': 'Tasks that are completed.'
};
const defaultStatusPrecedences = {
    'Open': 0,
    'In Progress': 50,
    'Resolved': 75,
    'Closed': 99
};

async function dbReady() {
    console.log('waiting for db');
    console.time('waiting for db');
    while (db.readyState !== 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
    };
    console.timeEnd('waiting for db');
    console.log('db ready');
}

async function getDefaultStatus(name) {
    if (name == 'Open') {
    await dbReady();
    }
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
    Open: Open,
    InProgress: InProgress,
    Resolved: Resolved,
    Closed: Closed
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