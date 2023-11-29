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
    const upvoteCollection= client.db('TechBoat').collection("upvotes");
    const downoteCollection= client.db('TechBoat').collection("downvotes");
    const reportCollection= client.db('TechBoat').collection("reports");
    const featureCollection= client.db('TechBoat').collection("features");
    const couponCollection= client.db('TechBoat').collection("coupons");
    const userCollection  = client.db('TechBoat').collection("users");



    //get all products

  app.get('/allproducts', async (req,res)=>{      
   const cursor = productsCollection.find();
   const result = await cursor.toArray();
   res.send(result);
})

//all products by id

app.get('/allproducts/:id', async(req,res) =>{
  const id = req.params.id;
  console.log(res.params);
  const query = { _id: new ObjectId(id)}
  const result = await productsCollection.findOne(query);
  res.send(result)
})
//delete all product by id
app.delete('/allproducts/:id', async (req,res) =>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}

  const result = await productsCollection.deleteOne(query)
  res.send(result);
})


    //client api
app.get('/products', async (req,res)=>{

 
       const query = {
        status: 'accepted' 
               }
    const cursor = productsCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
})

//post product
app.post('/products', async (req,res) =>{
  const products = req.body;
  console.log(products);
  const result = await productsCollection.insertOne(products)
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

//delete all product by id
app.delete('/products/:id', async (req,res) =>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}

  const result = await productsCollection.deleteOne(query)
  res.send(result);
})

//get product by owner


app.get('/product/:email', async (req,res) =>{
  const email = req.params.email;
  console.log(res.params);

 
   const  query = {email: req?.params?.email}
  const result = await productsCollection.find(query).toArray();
res.send(result);
})

//update product

app.put('/products/:id', async(req,res)=>{
  const id = req.params.id;
  const filter ={_id : new ObjectId(id)}
  const options = {upsert: true};
  const updatedProducts= req.body;
  const info ={
      $set: {
           name: updatedProducts.name, 
           image: updatedProducts.image, 
          external_link: updatedProducts.external_link, 
          description: updatedProducts.description, 
          tags: updatedProducts.tags, 
          OwnerName: updatedProducts.OwnerName, 
          email: updatedProducts.email,
          OwnerImage: updatedProducts.OwnerImage,
          status: updatedProducts.status,
          time: updatedProducts.time
      }
  }

  const result = await productsCollection.updateOne(filter, info)
  
  res.send(result);
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


//upvote get

app.get('/upvotes', async (req,res)=>{
  
const cursor = upvoteCollection.find();
const result = await cursor.toArray();
res.send(result);
})


//post uovotes
app.post('/upvotes', async (req,res) =>{
  const upvotes = req.body;
  console.log(upvotes);
  const result = await upvoteCollection.insertOne(upvotes)
  res.send(result);
})

//upvotes by products id
app.get('/upvotes/products', async (req,res) =>{
  let query= {};

if(req.query?.product_id){
    query = {product_id: req.query.product_id}
}
  const result = await upvoteCollection.find(query).toArray();
res.send(result);
})

//upvotes by email
app.get('/upvotes/email', async (req,res) =>{
  let query= {};

  if(req.query?.email){
    query = {user_mail: req?.query?.email}
}
  const result = await upvoteCollection.find(query).toArray();
res.send(result);
})

//downvote get

app.get('/downvotes', async (req,res)=>{
  
const cursor = downoteCollection.find();
const result = await cursor.toArray();
res.send(result);
})


//post downvotes
app.post('/downvotes', async (req,res) =>{
  const upvotes = req.body;
  console.log(upvotes);
  const result = await downoteCollection.insertOne(upvotes)
  res.send(result);
})

//downvotes by products id
app.get('/downvotes/products', async (req,res) =>{
  let query= {};

if(req.query?.product_id){
    query = {product_id: req.query.product_id}
}
  const result = await downoteCollection.find(query).toArray();
res.send(result);
})

//downvotes by email
app.get('/downvotes/email', async (req,res) =>{
  let query= {};

  if(req.query?.email){
    query = {user_mail: req?.query?.email}
}
  const result = await downoteCollection.find(query).toArray();
res.send(result);
})



//report get

app.get('/reports', async (req,res)=>{
  
  const cursor = reportCollection.find();
  const result = await cursor.toArray();
  res.send(result);
  })


  //post report
app.post('/reports', async (req,res) =>{
  const reports = req.body;
  console.log(reports);
  const result = await reportCollection.insertOne(reports)
  res.send(result);
})


  //get report by id


app.get('/reports/:id', async(req,res) =>{
  const id = req.params.id;
  console.log(res.params);
  const query = { _id: new ObjectId(id)}
  const result = await reportCollection.findOne(query);
  res.send(result)
})

//delete all product by id
app.delete('/reports/:id', async (req,res) =>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}

  const result = await reportCollection.deleteOne(query)
  res.send(result);
})


//feature product add
//post product
app.post('/features', async (req,res) =>{
  const products = req.body;
  console.log(products);
  const result = await featureCollection.insertOne(products)
  res.send(result);
})


//get feature
app.get('/features', async (req,res)=>{      
  const cursor = featureCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

//all features by id

app.get('/features/:id', async(req,res) =>{
 const id = req.params.id;
 console.log(res.params);
 const query = { _id: new ObjectId(id)}
 const result = await featureCollection.findOne(query);
 res.send(result)
})


app.post('/coupons', async (req,res) =>{
  const coupons = req.body;
  console.log(coupons);
  const result = await couponCollection.insertOne(coupons)
  res.send(result);
})


//get coupons
app.get('/coupons', async (req,res)=>{      
  const cursor = couponCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

//all coupons by id

app.get('/coupons/:id', async(req,res) =>{
  const id = req.params.id;
  console.log(res.params);
  const query = { _id: new ObjectId(id)}
  const result = await couponCollection.findOne(query);
  res.send(result)
 })

 //delete coupons
app.delete('/coupons/:id', async (req,res) =>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}

  const result = await couponCollection.deleteOne(query)
  res.send(result);
})

//update coupon

app.put('/coupons/:id', async(req,res)=>{
  const id = req.params.id;
  const filter ={_id : new ObjectId(id)}
  const options = {upsert: true};
  const updatedcoupon= req.body;
  const info ={
      $set: {
           code: updatedcoupon.code, 
           date: updatedcoupon.date, 
          discount: updatedcoupon.discount, 
          description: updatedcoupon.description, 
        
      }
  }

  const result = await couponCollection.updateOne(filter, info)
  
  res.send(result);
})

//user add

app.post("/users", async (req, res) => {
  const user = req.body;
  // insert email to check if user already exists
  const query = { email: user.email };
  const existingUser = await userCollection.findOne(query);
  if (existingUser) {
    return res.send({ message: "user already exists", insertedId: null });
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
});

//user get

app.get('/users', async (req,res)=>{
  
  const cursor = userCollection.find();
  const result = await cursor.toArray();
  res.send(result);
  })
  //all users by id

app.get('/users/:id', async(req,res) =>{
  const id = req.params.id;
  console.log(res.params);
  const query = { _id: new ObjectId(id)}
  const result = await userCollection.findOne(query);
  res.send(result)
 })


 //update user

app.put('/users/:id', async(req,res)=>{
  const id = req.params.id;
  const filter ={_id : new ObjectId(id)}
  const options = {upsert: true};
  const updateduser= req.body;
  const info ={
      $set: {
           name: updateduser.name, 
           email: updateduser.email, 
          role: updateduser.role
       
        
      }
  }

  const result = await userCollection.updateOne(filter, info)
  
  res.send(result);
})
  
//verifyToken, verifyAdmin,
app.get("/admin-stats",  async (req, res) => {
  const users = await userCollection.estimatedDocumentCount();
  const products = await productsCollection.estimatedDocumentCount();
  const reviews = await reviewCollection.estimatedDocumentCount();

  res.send([
    { users: users },
    { products: products },
    { reviews: reviews },
  ]);
});
  













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