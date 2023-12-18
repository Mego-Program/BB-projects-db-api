
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
  //  try {
    //    const validUserIds = dataAllUsers().map(user => user.id);
    
      //  body.users.forEach(user => {
        //    if (!validUserIds.includes(user.id)) {
          //      return res.status(400).json({ error: 'There is an invalid user' });
           // }
        //});
            
    //}catch (error) {
      //  console.error('Error during user validation:', error);
        //return res.status(500).json({ error: 'Internal server error' });
    //}
