import { model, readyState } from '../connect';

const Status = model('Status', require('./schemas').default.statusSchema);

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
    while (readyState !== 1) {
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

const getStatus = async (name) => {
    return (await Status.findOne({ name: name }));
}


export default {defaultStatuses , getStatus};


// possible future feature: create custom statuses

// module.exports = router;

