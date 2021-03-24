module.exports = router => {
    const user = require('../controller/users.controller.js');

    router.post('/signup', user.signUp);
    router.post('/login', user.login);
    router.get('/users/list', Authorization, user.findAllUsers);
    router.put('/users/update', Authorization, user.updateUserByToken);
}