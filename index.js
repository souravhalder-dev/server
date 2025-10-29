const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;
const cors = require("cors");
app.get("/", (req, res) => {
  res.send("welcome smiple server");
});

app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://pass:qcQydcvZ54c0oPhh@cluster0.ik3guvg.mongodb.net/?appName=Cluster0";

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
    await client.connect;

    const userDB = client.db("userdb");
    const userCollection = userDB.collection("user");

    app.get("/user", async (req, res) => {
      const coursor = userCollection.find();
      const result = await coursor.toArray();
      res.send(result);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // add database related apis here
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("heting the user post api", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.patch("/user/:id", (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
        },
      };
      const option = {};
      const result = userCollection.updateOne(query, update, option);
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      console.log(req.params.id);
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

// mongodn Aletr
// smipleDBuser
// qcQydcvZ54c0oPhh

app.listen(port, () => {
  console.log(`smpile crud server port ${port}`);
});
