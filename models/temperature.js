const mongoose = require("mongoose")
const temperatureSchema = new mongoose.Schema({
    ts: {
        type: Number,
        required: true
    },
    time:{
        type: String,
        required: false
    },
    val:{
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Temperature", temperatureSchema)