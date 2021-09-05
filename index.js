const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const mailer = require('nodemailer');
const mongoose = require('mongoose');
const emailModel = require("./model/email.js");
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
 
require('dotenv').config()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(cors())

let gfs;

let conn = mongoose.createConnection(process.env.DB_STRING, { 
  useNewUrlParser: true});

conn.once('open',()=>{
    //init stream
    gfs = Grid(conn.db,mongoose.mongo);
    gfs.collection('uploads')
    console.log('connected mongodb')
}).on('error',(error)=>{
    console.log(error)
})

//create storage object
const Storage = new GridFsStorage({
    url:process.env.DB_STRING,
    file:(req,file)=>{
        return new Promise((resolve,reject)=>{
            crypto.randomBytes(16,(err,buf)=>{
                if(err){
                    return reject(err);
                }
                const filename = buf.toString('hex')+path.extname(file.originalname);
                const fileInfo = {
                    filename,
                    bucketName:'uploads'
                }
                resolve(fileInfo);
            })
        })
    }
})

const upload = multer({Storage})

app.post("/sendMail",upload.single('file'),async(req,res)=>{
  
    const {name,emailFrom,emailTo,subject,content,file} = req.body;

    const emailObj = {
        name,
        emailFrom,
        emailTo,
        subject,
        content,
    }

    const transport = mailer.createTransport({
        host: process.env.HOST,
        auth:{
            user:process.env.USER,
            pass:process.env.PASS
        }
    })

        await transport.sendMail({
            from:emailFrom,
            to:emailTo,
            subject:subject||'',
            text:content,
            attachments:[{
                filename:file.substring(file.lastIndexOf("\\")+1),
            }]
        },(err,data)=>{
            if(err){
                emailObj.status = false;  
                emailObj.error = err;  
            } 
            else{
                 emailObj.status = true;  
                console.log('Email sent');
            
            } 
        emailModel.create(emailObj, (err, newEmail)=>{
          if(err)throw err;
          else console.log(newEmail);
     })   
        })
})





app.listen(process.env.PORT||5000,()=>{
    console.log("server started")
})