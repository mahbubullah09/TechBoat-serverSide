const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const cookieParsar = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId, ReturnDocument } = require('mongodb');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000;




app.use(cors());
app.use(express.json());

app.get('/', (req,res) =>{
    res.send('TechBoat is running')
})
app.listen(port , () => {
    console.log(`TechBoat is running on port ${port}`);
})