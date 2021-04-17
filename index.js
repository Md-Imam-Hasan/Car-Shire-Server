const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mugev.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("car-shire").collection("services");
  const orderCollection = client.db("car-shire").collection("orders");

  app.post('/addService', (req, res) => {
    serviceCollection.insertOne(req.body)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addOrder', (req, res) => {
    orderCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/allService', (req, res) => {
    serviceCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/orders', (req, res) => {
    const queryEmail = req.query.email;
    orderCollection.find({ email: queryEmail })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.delete('/delete/:id', (req, res) => {
    serviceCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

});




app.get('/', (req, res) => {
  res.send("hello from db it's working working")
})

app.listen(port)