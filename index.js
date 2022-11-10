const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// ----------------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hm5pps9.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("photography").collection("service");
    const reviewCollection = client.db("photography").collection("reviews");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // limit
    app.get("/", async (req, res) => {
      const query = {};
      const cursor = serviceCollection
        .find(query)
        .sort({ currentTime: -1 })
        .limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });

    // for single service find
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // for insert a service
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    // for reviews add
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // get reviews
    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { reviewId: id };
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      console.log(query);
      res.send(result);
    });

    // delete
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      console.log(query);
      res.send(result);
    });

    app.get("/myreviews/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      console.log(query);
      res.send(result);
    });
    // --------------------------
    // upgrade
    app.get("/esreviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      console.log(query);
      res.send(result);
    });

    // ----------------
    app.patch("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updatedReview = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          message: updatedReview.message,
        },
      };
      const result = await reviewCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

// ----------------------------------
app.get("/", (req, res) => {
  res.send("server is runnig");
});

app.listen(port, () => {
  console.log(`server running port is: ${port}`);
});
