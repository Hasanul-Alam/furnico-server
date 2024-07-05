const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvq0yvv.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // All my codes will remain here.
    const database = client.db("furnico");
    const productsCollection = database.collection("all-products");
    const cartCollection = database.collection("all-carts");
    const usersCollection = database.collection("all-usres");
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");

    // Get All Products
    app.get("/all-products", async (req, res) => {
      const cursor = await productsCollection.find({}).toArray();
      res.send(cursor);
    });

    // Get Single Product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    // Add a Product
    app.post("/products", async (req, res) => {
      const data = req.body;
      const result = await productsCollection.insertOne(data);
      res.send(result);
    });

    // Delete a Product
    app.delete('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    })

    app.post("/cart", async (req, res) => {
      const data = {
        name: req.body.name,
        price: req.body.price,
        email: req.body.email,
        image: req.body.image,
      };
      const result = await cartCollection.insertOne(data);
      res.send(result);
    });

    // Get Cart
    app.get("/cart", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    // Create an User
    app.post("/all-users", async (req, res) => {
      const data = {
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photoUrl,
        role: req.body.role,
      };
      // console.log(data)
      const result = await usersCollection.insertOne(data);
      res.send(result);
    });

    // Post Order
    app.post("/orders", async (req, res) => {
      const data = req.body;
      const result = await ordersCollection.insertOne(data);
      console.log(result);
      res.send(result);
    });

    // Get All Orders
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = await ordersCollection.find(query).toArray();
      res.send(cursor);
    });

    // Delete Order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });

    // Delete The Cart When User Made Payment
    app.delete("/cart", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.deleteMany(query);
      res.send(result);
    });

    // Delete a Single Item From Cart
    app.delete("/cart-item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      // console.log(id);
      res.send(result);
    });

    // Get a Single User
    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // Get All Users
    app.get("/all-users", async (req, res) => {
      const cursor = await usersCollection.find({}).toArray();
      res.send(cursor);
    });

    // Update User Role
    app.patch("/all-users/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      console.log(result);
      res.send(result);
    });

    // Delete User
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // Get All Orders
    app.get("/all-orders", async (req, res) => {
      const cursor = await ordersCollection.find({}).toArray();
      res.send(cursor);
    });

    // Get All Reviews
    app.get('/review', async(req, res) => {
      const result = await reviewsCollection.find({}).toArray();
      res.send(result);
    })

    // Post Review
    app.post('/review', async(req, res) => {
      const data = req.body;
      const result = await reviewsCollection.insertOne(data);
      res.send(result);
    })

    // Update Order With Status (pending/approved)
    app.patch("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedData = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: updatedData,
      };
      const result = await ordersCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
