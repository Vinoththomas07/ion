const express = require('express')
const app = express()
const port = 3001
const mongoose = require('mongoose')
const fs = require('fs');
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(express.json()) 

mongoose.connect("mongodb://localhost/temperature", {useNewUrlParser: true, useUnifiedTopology:true});
const db = mongoose.connection
db.on("error", (error) => console.log(error))
db.on("open", (error) => console.log("connected to db"))

const upload = require('./routes/temperature')

app.use("/upload", upload)

var server = app.listen(port, () => {
  console.log(`Ion app listening at http://localhost:${port}`)
})
server.timeout = 900000;
