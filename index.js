const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const app = express();
const port =  process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqp1q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        
        const database = client.db('DeliveryService');
        const userCollection = database.collection('services');
        const orderCollection = database.collection('orders')
        
        //get api declaration
        app.get('/services', async(req, res)=>{
            const cursor = userCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //get order
        app.get('/neworder', async(req, res)=>{

            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            console.log("hitting the orders", req.body);
            res.send(orders);
        })

       // get single service
        app.get('/placeorder/:id', async(req, res)=>{
            
            const id = req.params.id;
            console.log('hitting the id', id); 
            const query ={ _id: ObjectId(id) };

            const service = await userCollection.findOne(query);
            res.json(service);
        })


        //post api declaration
        app.post('/services', async (req, res) => {
            const newSerivce = req.body;
            const result = await userCollection.insertOne(newSerivce);


            console.log('hiting the post', req.body);
            res.json(result);
          })
        
        //post orders
        app.post('/neworder', async(req, res) =>{
            const newOrder = req.body;
            console.log(newOrder);
            const order = await orderCollection.insertOne(newOrder);

            console.log("hitting the orders", req.body);
            res.json(order);
        })

        //Delete API
        app.delete('/neworder/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id:ObjectId(id)}

            const result= await orderCollection.deleteOne(query);
            console.log(id);
            res.json(result);
        })
        app.put('/neworder/:id', async(req, res)=>{
            const id = req.params.id;

            const statusChanged = req.body;
            const query = { _id:ObjectId(id)}
            const updateDoc ={
                $set:{
                    status: statusChanged.status
                }
            }
            const result = await orderCollection.updateOne(query, updateDoc)
            console.log(result);
            
            res.json(result)
        })

    }
    finally{
        // await client.close();

    }
}

run().catch(console.dir)



app.get('/', (req, res)=>{
    res.send('running my crud file');
})
app.listen(port, ()=>{
    console.log('running my file')
})