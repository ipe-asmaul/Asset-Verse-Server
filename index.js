const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI
const PORT = process.env.SERVER_PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get('/', (req, res)=>{
        res.send('server is running ? ')
    })
    app.post('/user-register', async(req, res)=>{
        const DB = client.db('Asset-Verse')
        const collection = DB.collection('users')
        const data = req.body;
        const isInList = await collection.findOne({email: data.email});
        if(isInList){
            return res.send({message: 'User already exists'})
        }
        const result = await collection.insertOne(data);
        res.send(result)
    })

  app.get('/user', async(req, res)=>{
    const DB = client.db('Asset-Verse')
    const collection = DB.collection('users')
    const email = req.query.email;
    const query = {email: email}  
    const result = await collection.findOne(query);
    res.send(result)
  })

  app.post('/add-asset', async(req, res)=>{
    const DB = client.db('Asset-Verse')
    const collection = DB.collection('assets')
    const data = req.body;
    const result = await collection.insertOne(data);
    res.send(result)
  })


  app.get('/my-assets', async(req, res)=>{
    const DB = client.db('Asset-Verse')
    const collection = DB.collection('assets')
    const query = {}
    const email = req.query.email;
    if(email){
        query.hrEmail = email
    }
   
    const result = await collection.find(query).toArray();
    res.send(result)

  })

  app.post('/requests', async(req, res)=>{
    const DB = client.db('Asset-Verse')
    const collection = DB.collection('requests')  
    const data = req.body;
    const result = await collection.insertOne(data);
    res.send(result)
  })
  app.get('/requests', async(req, res)=>{
    const DB = client.db('Asset-Verse')
    const collection = DB.collection('requests')
    const query = {}
    const email = req.query.email;
    if(email){
        query.hrEmail = email
    } 
    
    const result = await collection.find(query).toArray();
    res.send(result)

  })


  app.patch('/requests', async(req, res)=>{
    const DB = client.db('Asset-Verse')
    const collection = DB.collection('requests') 
    const data = req.body; 
    const id = req.query.id;
    const result = await collection.updateOne({_id: new ObjectId(id)}, {$set: {requestStatus: data.requestStatus, approvalDate: data.approvalDate, processedBy: data.processedBy}});
    res.send(result)
  })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(PORT)