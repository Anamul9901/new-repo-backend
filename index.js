const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;

// middelware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lyb9tdm.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const userCollection = client.db("JobTask").collection("users");
    const taskCollection = client.db("JobTask").collection("tasks");
    const projectsCollection = client.db("JobTask").collection("projects");

    // user related api
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const createUser = req.body;
      const result = await userCollection.insertOne(createUser);
      res.send(result);
    });

    // projects related api
    app.get("/projects", async (req, res) => {
        const result = await projectsCollection.find().toArray();
        res.send(result);
      });
  
      app.post("/projects", async (req, res) => {
        const createProject = req.body;
        const result = await projectsCollection.insertOne(createProject);
        res.send(result);
      });

      app.get("/projects/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await projectsCollection.findOne(query);
        res.send(result);
      });
  
      app.delete("/projects/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await projectsCollection.deleteOne(query);
        res.send(result);
      });

      app.put("/projects/:id", async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        console.log(data);
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedTask = {
          $set: {
            name: data.name,
            priority: data.priority,
            description: data.description,
            position: data.position,
          },
        };
        const result = await taskCollection.updateOne(
          filter,
          updatedTask,
          options
        );
        res.send(result);
      });

    // task related api
    app.get("/tasks", async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    });

    app.post("/tasks", async (req, res) => {
      const createTask = req.body;
      const result = await taskCollection.insertOne(createTask);
      res.send(result);
    });

    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          position: data.position,
        },
      };
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTask = {
        $set: {
          name: data.name,
          title: data.title,
          priority: data.priority,
          dadline: data.dadline,
          description: data.description,
          position: data.position,
        },
      };
      const result = await taskCollection.updateOne(
        filter,
        updatedTask,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("job-task is running");
});

app.listen(port, () => {
  console.log(`Job-task is running on port ${port}`);
});
