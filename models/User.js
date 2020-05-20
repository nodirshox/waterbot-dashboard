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
    location: {
        lat : String,
        lon : String
    },
    busket: [{
        id: {type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: Number
    }],
    money: {
        type: String,
        default: "naqt"
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
    }
    
});

module.exports = mongoose.model('User', userSchema)