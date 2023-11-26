const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const cookieParsar = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId, ReturnDocument } = require('mongodb');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000;





console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ennn1mj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // await client.connect();



    const productsCollection = client.db('TechBoat').collection("Products");
    const reviewCollection= client.db('TechBoat').collection("Reviews");



    //client api
app.get('/products', async (req,res)=>{

 
       const query = {
        status: 'accepted' 
               }
    const cursor = productsCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
})


app.get('/products/search', async (req,res)=>{

    const filter = req.query
    console.log(filter);  
       const query = {
        status: 'accepted' ,
        'tags.text': {$regex: filter.search , $options: 'i'}
        }
    const cursor = productsCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
})

//get product by id


app.get('/products/:id', async(req,res) =>{
    const id = req.params.id;
    console.log(res.params);
    const query = { _id: new ObjectId(id)}
    const result = await productsCollection.findOne(query);
    res.send(result)
})

//post review
app.post('/reviews', async (req,res) =>{
    const Reviews = req.body;
    console.log(Reviews);
    const result = await reviewCollection.insertOne(Reviews)
    res.send(result);
})

//get all review
app.get('/reviews',  async(req,res)=>{
    const cursor = reviewCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

//reveiw by products 
app.get('/review/products', async (req,res) =>{
      let query= {};
  
    if(req.query?.gadget_id){
        query = {gadget_id: req.query.gadget_id}
    }
      const result = await reviewCollection.find(query).toArray();
    res.send(result);
})

//vote update

app.put('/products/:id', async(req,res)=>{
    const id = req.params.id;
    console.log('id' ,id);
    const filter ={_id : new ObjectId(id)}
    const options = {upsert: true};
    const updatedBookings= req.body;
    const info ={
        $set: {
            vote_count: updatedBookings. upvote, 
             
        }
    }

    const result = await productsCollection.updateOne(filter, info)
    
    res.send(result);
})












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) =>{
    res.send('TechBoat is running')
})
app.listen(port , () => {
    console.log(`TechBoat is running on port ${port}`);
})