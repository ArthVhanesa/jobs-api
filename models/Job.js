const mongoose = require('mongoose')

const JobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide a company name'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['Interview', 'Declined', 'Pending'],
        default: 'Pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: [true, 'Please provide user']
    }
}, { timestamps: true }) 

module.exports = mongoose.model('Job', JobSchema)