const User = require('../models/users.model.js');
const Joi = require('@hapi/joi');
const UserServices = require('../services/users.js');

const schema = Joi.object().keys({
    firstName: Joi.string().required().messages({
        'string.base': `"fistName" must be a 'string'`,
        'string.empty': `"firstName" cannot be empty`,
        'any.required': `Please enter your "firstName"`
    }),
    lastName: Joi.string().required().messages({
        'string.base': `"lastName" must be a 'string'`,
        'string.empty': `"lastName" cannot be empty`,
        'any.required': `Please enter your "lastName"`
    }),
    username: Joi.string().required().messages({
        'string.base': `"username" must be a 'string'`,
        'string.empty': `"username" cannot be empty`,
        'any.required': `Please enter your "username"`
    }),
    phoneNumber: Joi.string().allow(null, '').optional().messages({
        'string.base': `"phoneNumber" must be a 'string'`
    }),
    email: Joi.string().email().allow('').messages({
        'string.base': `"email" must have type 'example@gmail.com'`,
        'string.email': `"email" must have type 'example@gmail.com'`,
        'any.required': `Please enter your email "email"`
    }),
    avatar: Joi.string().allow(null, '').optional().messages({
        'string.base': `"avatar" must be a 'string'`
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': `"password" must be a string`,
        'string.min': `"password" must have at least 6 letter`,
        'string.empty': `"password" cannot be empty`,
        'any.required': `Please enter your "password"`
    }),
    role: Joi.string().optional().messages({
        'string.base': `"role" must be a 'string'`
    })
}).unknown();

const updateSchema = Joi.object().keys({
    firstName: Joi.string().optional().messages({
        'string.base': `"fistName" must be a 'string'`,
        'string.empty': `"firstName" cannot be empty`
    }),
    lastName: Joi.string().optional().messages({
        'string.base': `"lastName" must be a 'string'`,
        'string.empty': `"lastName" cannot be empty`
    }),
    username: Joi.string().optional().messages({
        'string.base': `"username" must be a 'string'`,
        'string.empty': `"username" cannot be empty`
    }),
    phoneNumber: Joi.string().allow(null, '').optional().messages({
        'string.base': `"phoneNumber" must be a 'string'`
    }),
    email: Joi.string().email().allow('').messages({
        'string.base': `"email" must have type 'example@gmail.com'`,
        'string.email': `"email" must have type 'example@gmail.com'`
    }),
    avatar: Joi.string().allow(null, '').optional().messages({
        'string.base': `"avatar" must be a 'string'`
    }),
    password: Joi.string().min(6).optional().messages({
        'string.base': `"password" must be a string`,
        'string.min': `"password" must have at least 6 letter`,
        'string.empty': `"password" cannot be empty`
    }),
    role: Joi.string().optional().messages({
        'string.base': `"role" must be a 'string'`
    })
})

exports.signUp = async (req, res, next) => {
    try {
        console.log("haha ", req);
        const validate = schema.validate(req.body);
        if (validate.error) {
          return next(res.status(400).send(validate.error));
        }
    
        const data = req.body;
        if(data.role !== null){
            data.role = "user";
        }
        let avatar = req.files.avatar;
        avatar.mv('./uploads/' + avatar.name);
        data.avatar = avatar.name;
        const user = await UserServices.userSignup(data);

        if(!user){
            res.status(403).send({
                messages: "Người Dùng Này Đã Tồn Tại"
            });
        }
        else{
            res.send(user);
        }
        return next();
    }catch(err){
        throw err
    }
}

exports.login = async (req, res) =>{
    try{
        const data = {
            username: req.body.username,
            password: req.body.password
        }
        const userlogin = await UserServices.login(data)
        if(!userlogin){
            res.status(401).send({
                messages: "Incorrect username"
            });
        }else if(userlogin.correct_password == false){
            res.status(401).send({
                messages: "Incorrect password"
            });
        }
        else{
            res.status(200).send(
                userlogin
           );
        }
    }catch(err){
        throw err;
    }
}

exports.findAllUsers = async (req, res, next) =>{
    try {
        if(req.user == null){
            return res.status(404).send({
                message: "Your login sessions is out of date"
            });
        }else{
            if(req.user.role == "admin"){
                User.find()
                .then(users => {
                    return res.send(users);
                }).catch(err => {
                    return res.status(401).send({
                        message: "Some error occurerd, please check your internet or database connection"
                    });
                });
            }else{
                res.status(401).send({
                    message: "You must be a 'admin' to do this action"
                })
            }
        }
    }catch(err){
        throw err;
    }
}

exports.updateUserByToken = async (req, res, next) =>{
    const validate = updateSchema.validate(req.body);
    if (validate.error) {
        return next(res.status(400).send(validate.error));
    }
    if(req.user == null){
        return res.status(404).send({
            message: "Your login sessions is out of date"
        })
    }else{
        User.findByIdAndUpdate(req.user._id, req.body, {new: true} )
        .then(user => {
            res.send(user);
        }).catch(err => {
            return res.status(500).send({
                message: "Error updating this user"
            });
        });
    }
}

