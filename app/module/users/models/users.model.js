const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const UserSchema = ({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    username:{
        type: String
    },
    phoneNumber:{
        type: String
    },
    email: {
        type: String
    },
    avatar: {
        type: String,
    },
    password:{
        type: String
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: "user",
        index: true
    }
})

module.exports = mongoose.model('User', UserSchema);