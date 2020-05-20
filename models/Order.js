const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    firstname: {
        type: String
    },
    id: {
        type: Number
    },
    registration: {
        type: Date,
        default: Date.now
    },
    phone: {
        type: String
    },
    money: {
        type: String
    },
    order: {
        type: String
    },
    location: {
        lat : String,
        lon : String
    },
    orderdate: {
        type: String
    },
    ordertime: {
        type: String
    },
    location_name: {
        type: String
    }
    
});

module.exports = mongoose.model('Order', orderSchema)