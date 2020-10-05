const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xu8lv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology:true });
client.connect(err => {
  //console.log(err);
  const volunteers = client.db("serviceDb").collection("volunteers");
  const addEventCollections=client.db("serviceDb").collection("addEvents");
 console.log('database connected')

 app.post('/addRegister',(req,res)=>{
  const newRegister=req.body;
  volunteers.insertOne(newRegister)
      .then(result=>{
      
        res.send(result.insertedCount>0);
      })
 
})



app.post('/addEvent',(req,res)=>{
  const newEvent=req.body;
 // console.log(newEvent)
  addEventCollections.insertMany(newEvent)
      .then(result=>{
        //console.log(result)
        res.send(result.insertedCount);
      })
 
})



app.get('/volunteers',(req,res)=>{
  volunteers.find({email:req.query.email})
  .toArray((err,documents)=>{
    res.send(documents);
  })
})

app.get('/addEvents', (req, res) => {
  addEventCollections.find({})
  .toArray( (err, documents) => {
      res.send(documents);
  })
})




});


app.listen(process.env.PORT||port)