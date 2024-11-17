const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

let db;

const url =
  'mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true';
const dbName = 'demo';

const startApp = async () => {
  try {
    const client = await MongoClient.connect(url);
    db = client.db(dbName);
    console.log(`Connected to database ${dbName}`);

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
}

startApp()

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  console.log('GET /');
  try {
    const messages = await db.collection('messages').find().toArray();
    console.log(messages);
    res.render('index.ejs', { messages });
  } catch (error) {
    console.error('Failed to get messages:', error);
  }
});


app.post('/messages', async (req, res) => {
  console.log(req.body);
  const { name, msg } = req.body;
  try {
    await db
      .collection('messages')
      .insertOne({ name, msg, thumbUp: 0, thumbDown: 0 });
    console.log('saved to database');
    res.redirect('/');
  } catch (error) {
    console.log('Error saving to the database', error);
  }
});

app.put('/messages', async (req, res) => {
  console.log('patch update');

  const { name, msg, thumbUp, thumbDown } = req.body;
  console.log({ name, msg, thumbUp, thumbDown });
  let result; 
  try {
    if (thumbUp !== undefined) {
       result = await db.collection('messages').updateOne(
         { name, msg },
         {
           $set: {
             thumbUp: thumbUp + 1,
           },
         },
         {
           sort: { _id: -1 },
           upsert: true,
         }
       );
    }
    else if (thumbDown !== undefined) {
      result = await db.collection('messages').updateOne(
        { name, msg },
        {
          $inc: {
            thumbUp: -1,
          },
        },
        {
          sort: { _id: -1 },
          upsert: true,
        }
      );
    }
    console.log(result); 
    res.send(result); 
  } catch (error) {
    console.error('Error updating messages', error); 
    res.send('Error updating messages', error);
  }
});

app.delete('/messages', async (req, res) => {
  const { name, msg } = req.body; 
  try {
    const dbResponse = await db
      .collection('messages')
      .deleteOne({ name: name, msg: msg });
    res.send('message deleted!')
  } catch (error) {
    console.log('Error deleting message', error); 
    res.send('error deleting message');
  }
  
})

