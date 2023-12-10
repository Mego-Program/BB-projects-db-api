
export default function (users) {
    if (!Array.isArray(users)) {
        return false;
    };
    if (users.length === 0) {
        return false;
    };
    for (let user of users) {
        if (typeof user !== 'string') {
            return false;
        };
    };
    return true;
};

