const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

const admin = { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: ['Admin'] };

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.name;
    user.email = req.body.email;
    user.password = '123456';
    user.phone = req.body.phone;
    user.role = req.body.role;
    user.save((err, doc) => {
        if (!err)
            res.status(200).json({
                status: true,
                message: 'User Registeration was Successfully',
            });
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }
    });
}

module.exports.authenticate = (req, res, next) => {
    if (req.body.email === admin.username && admin.password === req.body.password) {
        return res.status(200).json({
            "token": jwt.sign({
                _id: admin._id,
                role: admin.role
            },
                process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXP
            })

        });
    } else {
        passport.authenticate('local', (err, user, info) => {
            if (err) return res.status(400).json(err);
            else if (user) return res.status(200).json({
                "token": user.generateJwt()
            });
            else return res.status(404).json(info);
        })(req, res);
    }
}

module.exports.fetchUserProfile = (req, res, next) => {
    User.findOne({
        email: req.body.id
    }, {
        fullName: 1,
        phone: 1,
        _id: 0,
        email: 1,
        role: 1
    },
        (err, user) => {
            if (!user)
                return res.status(404).json({
                    status: false,
                    message: 'User record not found.'
                });
            else
                return res.status(200).json({
                    status: true,
                    user: user
                });
        }
    );
}


module.exports.fetchAllUserProfile = (req, res) => {
    User.find({}, {
        fullName: 1,
        phone: 1,
        _id: 0,
        email: 1,
        role: 1
    }, (err, users) => {
        if (err) {
            return res.status(404).json({
                status: false,
                message: 'Something went wrong, Please try again later'
            });
        } else {
            return res.status(200).json({
                status: true,
                users
            });
        }
    })
}


module.exports.updateUserDetails = (req, res) => {
    console.log(req.body)
    User.findOneAndUpdate({
        'email': req.body.email
    }, {
        'email': req.body.updatedEmail,
        'phone': req.body.phone,
        'fullName': req.body.name,
        'role': req.body.role
    }, (err, user) => {
        if (err) {
            return res.status(422).json({
                status: false,
                message: 'Something went wrong, Please try again later'
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'User Updated Successfully',
            });
        };
    })
}



module.exports.resetPassword = (req, res) => {
    let password = req.body.password
    let email = req.body.email;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            password = hash;
            this.saltSecret = salt;
            User.findOneAndUpdate({
                'email': email
            }, {
                'password': password,
            }, (err, user) => {
                if (err) {
                    return res.status(404).json({
                        status: false,
                        message: 'Failed to reset the password'
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        message: 'Password was resseted successfully'
                    });
                };
            })

        });
    });
}


module.exports.deleteUser = (req, res) => {
    User.findOneAndDelete({
        'email': req.body.email
    }, (err, user) => {
        if (err) {
            return res.status(404).json({
                status: false,
                message: 'Failed to delete the document'
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Document Deleted Successfully'
            });
        };
    });
}