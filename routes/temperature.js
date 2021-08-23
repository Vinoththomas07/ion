const express = require("express");
const router = express.Router();
const app = express();
const fs = require('fs');
const fileUpload = require('express-fileupload');
const JSONStream = require('JSONStream');
const mongoose = require("mongoose")

app.use(fileUpload());
app.use(express.json());
app.use(express.static('public'));

const Temperature = require("../models/temperature");

router.post("/", async (req, res) => {
    try {
        await req.files.file.mv('./uploads/data.json');
        new Promise((resolve, reject) => {
            var stream = fs.createReadStream('./uploads/data.json', {flags: 'r', encoding: 'utf-8'});
            var jsonStream = JSONStream.parse('*')
            stream.pipe(jsonStream)
            var batchData = []
            var count = 0
            jsonStream.on('data', (data)=> {
                if(count<50000){
                    var date = new Date(data.ts);
                    let arr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    var month = date.getMonth();
                    var date_ =  date.getDate();
                    var year = date.getFullYear();
                    var monthT = arr[Number(month)]
                    var yearT = String(year).split("").slice(2,4).join("")
                    let hour = date.getHours()
                    let minute = date.getMinutes()
                    let sec = date.getSeconds()
                    let time = date_+"-"+monthT+"-"+yearT+" "+hour+":"+minute+":"+sec
                    data.time = time
                    batchData.push(data);
                    count+=1
                } else {
                    try {
                        Temperature.insertMany(batchData).then(()=>{
                            // console.log("pushed data")
                        }).catch(error => console.log('error', error));
                    } catch (error) {
                        res.status(400).json({ message: JSON.stringify(err)});
                    }
                    count=0
                    batchData=[]
                }
            })
            stream.on('error', function (error) {
                reject(error);
            })
            stream.on('end', function () {
               resolve("completed");
            })
        }).then(()=>{
            res.status(200).json({ message: true });
        }).catch (error=>{
            res.status(400).json({ message: error });
        })
    } catch (err) {
        res.status(501).json({message:err.message})
    }
})

router.get('/', async(req,res)=>{
    try {
        // sort in descending (-1) order by length
        const sort = { ts: -1 };
        const limit = 50000;
        let index = req.query?req.query.index:0
        const cursor = await Temperature.find({},{ _id:0, time:1, val:1 }).sort(sort).limit(limit).skip(index*limit);
        cursor.push({nextIndex: Number(index)+1})
        res.json(cursor)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.delete('/', async(req, res)=>{
    try {
        var Delete = await Temperature.deleteMany()
        res.status(200).json({ message: Delete})
    } catch (error) {
        res.status(401).json({ message: error})
    }
})

module.exports = router
