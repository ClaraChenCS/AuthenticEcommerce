/**
 * Created by Tech-team on 11/4/15.
 */
/* Object/Relational mapping for instances of the Users class.
 - classes correspond to tables
 - instances correspond to rows
 - fields correspond to columns
 In other words, this code defines how a row in the postgres order table
 maps to the JS Order object.
 */
var hash = require('../authentication/passencrypt').hash;

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("User", {
        email: {type: DataTypes.STRING, allowNull: false},
        password: {type: DataTypes.TEXT, allowNull: false},
        name: {type: DataTypes.STRING, allowNull: false},
        address: {type: DataTypes.STRING, allowNull: true},
        phone: {type: DataTypes.STRING, allowNull: true},
        social: {type: DataTypes.STRING, allowNull: true},
        salt: {type: DataTypes.TEXT, allowNull: false},
        hash: {type: DataTypes.TEXT, allowNull: false}
    },
        {
            classMethods: {
                createUser: function(req, callback) {
                    var _User = this;
                    hash(req.body.password, function (err, salt, hash) {
                        if (err) throw err;

                        var newUser = _User.build({
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            address: req.body.address,
                            phone: req.body.phone,
                            social: 'local',
                            salt: salt,
                            hash: hash
                        });

                        newUser.save().then(function (savedUser) {
                            req.login(savedUser, function (err) {
                                if (err) {
                                    sendErrorEmail(err, newUser);
                                    return next(err);
                                }
                                callback(savedUser);
                            });
                        });
                    });
                },
                userExist: function(req, callback) {
                    var _User = this;
                    _User.count({where: {email: req.body.email}}).then(function (count) {
                        if (count > 0) {
                            callback(true);
                        } else {
                            callback(false)
                        }
                    });
                },
                getUser: function(req, callback) {
                    var _User = this;
                    var userId;

                    try {
                        userId = req.user.id;
                    }
                    catch (error) {
                        userId = 0;
                    }

                    if (req.body.email) {

                         _User.findOne({
                            where: {email: req.body.email}
                            }).then(function (user) {
                            // project will be the first entry of the Projects table with the title 'aProject' || null
                            // project.title will contain the name of the project
                            callback(user);
                        })
                    } else {
                        _User.findOne({
                            where: {id: userId}
                        }).then(function(user){
                            callback(user);
                        })
                    }
                },

                updateuser: function(req, callback) {
                    var _User = this;

                    _User.update(
                        {
                            name:req.body.name,
                            email:req.body.email,
                            password:req.body.password,
                            address:req.body.address,
                            phone:req.body.phone
                        } /* set attributes' value */,
                        {where: {id: req.user.id}} /* where criteria */
                    ).then(function (affectedRows) {
                            callback(affectedRows);
                        });

                }


            }
        });
};