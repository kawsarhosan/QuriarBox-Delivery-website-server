const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port =  process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//user: deliveryService
//pass: 6aMoUPonCVusFnSk

const uri = "mongodb+srv://deliveryService:6aMoUPonCVusFnSk@cluster0.gqp1q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        
        const database = client.db('DeliveryService');
        const userCollection = database.collection('services')
        
        //get api declaration
        app.get('/services', async(req, res)=>{
            const cursor = userCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //get single service
        // app.get('services/:id', async(req, res)=>{
            
        //     const id = req.params.id;
        //     console.log('hitting the id', id); 
        //     const query ={ _id: ObjectId(id) };

        //     const service = await userCollection.findOne(query);
        //     res.json(service);
        // })


        //post api declaration
        app.post('/services', async (req, res) => {
            const newSerivce = req.body;
            const result = await userCollection.insertOne(newSerivce);


            console.log('hiting the post', req.body);
            res.json(result);
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