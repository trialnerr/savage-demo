const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

let db, collection;

const url =
  'mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true';
const dbName = 'demo';

app.listen(3000, () => {
    MongoClient.connect(url, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  db.collection('messages')
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      res.render('index.ejs', { messages: result });
    });
});

app.post('/messages', (req, res) => {
  const { name, msg } = req.body;
  db.collection('messages').insertOne(
    { name, msg, thumbUp: 0, thumbDown: 0 },
    (err, result) => {
      if (err) return console.log(err);
      console.log('saved to database');
      res.redirect('/');  
    }
  );
});

app.put('/messages', (req, res) => {
  const { name, msg, thumbUp } = req.body;
  db.collection('messages').updateOne(
    { name, msg },
    {
      $set: {
        thumbUp: thumbUp + 1,
      },
    },
    {
      sort: { _id: -1 },
      upsert: true,
    },
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});

app.delete('/messages', (req, res) => {
  db.collection('messages').deleteOne(
    { name: req.body.name, msg: req.body.msg },
    (err, result) => {
      if (err) return res.send(500, err);
      res.send('Message deleted!');
    }
  );
});
