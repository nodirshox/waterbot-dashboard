const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String
    },
    id: {
        type: Number,
        required: true
    },
    registration: {
        type: Date,
        default: Date.now
    },
    phone_number: {
        type: String,
        required: true
    },
    busket: [{
        id: {type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: Number
    }],
    comment: {
        type: String,
        default: "-"
    },
    commentconfirm: {
        type: Number,
        default: 0
    },
    whichlocation: {
        type: Number,
        default: 0
    },
    lang: {
        type: String,
        default: "uz"
    },
    confirmation: {
        type: Number,
        default: 0
    },
    orderdate: {
        type: String
    },
    ordertime: {
        type: String
    },
    location: [{
        type: String,
        default: []
    }]
    
});

module.exports = mongoose.model('User', userSchema)