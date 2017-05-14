const Promise = require('promise');
const RedisPromisified = require('./util/RedisPromisified.js');
const dbOperation = require('./util/dbUtil.js').dbOperation;
const dbMessage = require('./util/dbUtil.js').dbMessage;
const dbStatusMaker = require('./util/dbUtil.js').dbStatusMaker;

const db = {
    findUser: function(id) {
        return new Promise((fulfill, reject) => {
            RedisPromisified.hgetall(id).then(
                (res) => {
                    if(res !== 0)
                        fulfill(dbStatusMaker(dbOperation.FIND_USER, true, res));
                    else
                        fulfill(dbStatusMaker(dbOperation.FIND_USER, false, dbMessage.USER_NOT_EXIST));
                },
                (err) => {
                    reject(dbStatusMaker(dbOperation.FIND_USER, false, dbMessage.DB_FAILED));
                }
            );
        });
    },
    
    newUser: function(id, token, email, name) {
        return new Promise((fulfill, reject) => {
            RedisPromisified.hmset(id, {
                'google.email': email,
                'google.name': name,
                'google.token': token
            }).then(
                (res) => {
                    if(res === 'OK')
                        fulfill(dbStatusMaker(dbOperation.ADD_USER, true, dbMessage.USER_ADDED));
                    else
                        fulfill(dbStatusMaker(dbOperation.ADD_USER, false, dbMessage.USER_NOT_ADDED));
                },
                (err) => {
                    reject(dbStatusMaker(dbOperation.ADD_USER, false, dbMessage.DB_FAILED));
                }
            );
        });
    },

    deleteUser: function(id) {
        return new Promise((fulfill, reject) => {
            RedisPromisified.del(id).then(
                (res) => {
                    if(res === 1)
                        fulfill(dbStatusMaker(dbOperation.DELETE_USER, true, dbMessage.USER_DELETED));
                    else
                        fulfill(dbStatusMaker(dbOperation.DELETE_USER, false, dbMessage.USER_NOT_DELETED));
                },
                (err) => {
                    reject(dbStatusMaker(dbOperation.DELETE_USER, false, dbMessage.DB_FAILED));
                }
            )
        });
    },

    existUser: function(id) {
        return new Promise((fulfill, reject) => {
            RedisPromisified.exists(id).then(
                (res) => {
                    if(res === 1)
                        fulfill(dbStatusMaker(dbOperation.EXIST_USER, true, dbMessage.USER_EXIST));
                    else
                        fulfill(dbStatusMaker(dbOperation.EXIST_USER, false, dbMessage.USER_NOT_EXIST));
                },
                (err) => {
                    reject(dbStatusMaker(dbOperation.EXIST_USER, false, dbMessage.DB_FAILED));
                }
            )
        });
    },
};
/*
db.findUser(233).then(console.log, console.log);
db.newUser('ngchenhon3213@gmail.com', '123', 'ngchenhon@gmail.com', 'chen hon').then(console.log, console.log);
db.findUser('ngchenhon3213@gmail.com').then(console.log, console.log);
db.existUser('ngchenhon3213@gmail.com').then(console.log, console.log);
db.deleteUser('ngchenhon3213@gmail.com').then(console.log, console.log);
*/

module.exports = db;