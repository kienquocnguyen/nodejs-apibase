const User = require('../models/users.model.js');
const jwt = require('jsonwebtoken');
const config = require('../../../../api/config/config.js');
var bcrypt = require('bcryptjs');

exports.userSignup = async (data) => {
    try {
            const user = new User(data);
            const check_exists = User.find( { $or: [ { username: user.username }, { email: user.email }, { _id: user._id } ] } );
            const user_exists = await check_exists;
            var BCRYPT_SALT_ROUNDS = 12;
            if( user_exists.length > 0 ){
                return;
            }
            else{
                bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS)
                .then(async (hashedPassword) => {
                    user.password = hashedPassword;
                    return await user.save();
                })
                .then(async () => {
                    return;
                })
                .catch(async (error) =>{
                    return error;
                });
                return user;
            }
    }catch(e){
        throw e;
    }
}

exports.login = async (data) => {
    try {
        const user = await User.findOne(  { username: data.username } )
        if(!user){
            return;
        }else{
            const correct_password = bcrypt.compareSync(data.password, user.password);
            if(correct_password == true){
                const token = jwt.sign({ sub: user._id }, config.secret, { expiresIn: '7d' });
                return {
                    token
                };
            }else{
                return{
                    correct_password
                };
            }
        }
    }catch(e){
        throw e;
    }
}