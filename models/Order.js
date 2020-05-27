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
    comment: {
        type: String,
        default: "-"
    },
    order: {
        type: String
    },
    location: {
        type: String
    },
    orderdate: {
        type: String
    },
    ordertime: {
        type: String
    },
    status: {
        type: Number,
        default: 3
    },
    delivery_person: {
        type: String
    },
    total: {
        type: Number
    },
    towhom: {
        type: Number
    }

    
});

module.exports = mongoose.model('Order', orderSchema)