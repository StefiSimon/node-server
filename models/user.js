const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    name: String,
    password: String,
    department: String,
    mobile: String,
    mail: String,
    title: String
}));
