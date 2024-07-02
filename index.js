const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors())
app.use(express.json())

// Database Name: Furnico-User
// Password: Fa0sYX9reRWsBPgi



// const uri = "mongodb+srv://Furnico-User:<password>@cluster0.uvq0yvv.mongodb.net/?appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvq0yvv.mongodb.net/?appName=Cluster0`;

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
    await client.connect();

    // All my codes will remain here.
    const database = client.db("furnico");
    const databaseCollection = database.collection("all-products");
    const cartCollection = database.collection('all-carts');
    const usersCollection = database.collection('all-usres');
    const paymentsCollection = database.collection('payments')

    // Get All Products
    app.get('/all-products', async (req, res) => {
      const cursor = await databaseCollection.find({}).toArray();
      res.send(cursor)
    })

    // Get Single Product
    app.get('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = { id: id };
      // console.log(id);
      const product = await databaseCollection.findOne(query);
      res.send(product);
    })

    app.post('/cart', async (req, res) => {
      const data = {
        name: req.body.name,
        price: req.body.price,
        email: req.body.email,
        image: req.body.image
      }
      const result = await cartCollection.insertOne(data);
      res.send(result);
    })

    app.get('/cart', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result)
    })

    app.post('/all-users', async(req, res) => {
      const data = {
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photoUrl
      }
      // console.log(data)
      const result = await usersCollection.insertOne(data);
      res.send(result);
    })

    app.post('/payments', async(req,res) => {
      const data = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        price: req.body.price,
        paymentMethod: req.body.paymentMethod,
      }
      const result = await paymentsCollection.insertOne(data);
      console.log(result);
      res.send(result);
    })

    app.delete('/cart', async (req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const result = await cartCollection.deleteMany(query);
      res.send(result);
    })

    app.delete('/cart-item/:id', async (req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      // console.log(id);
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


app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })