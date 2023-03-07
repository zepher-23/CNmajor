const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const port = 8000;

const bodyParser = require('body-parser');
const fs = require('fs'); //TO READ JSON FILE

app.use(bodyParser.urlencoded({ extended: true }));


//verify connection to mongodb
const uri = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
}

connect();

async function insertData(jsonData) {
  try {
    connect()
    const db = client.db('mydb');
    const collection = db.collection('todo');
    const documents = jsonData.map((d) => ({ ...d }));
    const result = await collection.insertMany(documents);
    console.log(result);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

//use express router
app.use('/', require('./routes'));
app.use(express.static('views'));

//setup view engine 
app.set('view engine','ejs');
app.set('views','./views');

  
async function deleteAllDocumentsInCollection() {
  connect()
  const db = client.db('mydb');
  const collection = db.collection('todo');
  
  try {
    const result = await collection.deleteMany({});
    console.log(result.deletedCount + ' documents deleted');
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
}




//HANDLES THE THE FORM DATA WHEN SUBMITTED
app.post('/', function(req, res) {
  let data =[];
  console.log('added task');
const currentData = req.body;
const raw = fs.readFileSync('data.json');

//CHECK IF JSON FILE IS EMPTY AND HANDLE ACCORDINGLY
if(raw == ''){
  data.push(currentData);
}
else{
   let firstElement = JSON.parse(raw);
   //EXISTING JSON DATA IS CONVERTED TO AN ARRAY AND PUSHED INTO THE NEW ARRAY
   //THIS STEP IS DUE TO THE NESTING FORMED IN JSON DATA WHEN TRIED TO PUSH ARRAY DATA DIRECTLY INTO JSON FILE
   firstElement.forEach(element => {
    data.push(element);
   });
  data.push(currentData);
  
}

 
// Convert JavaScript array back to JSON and write to file
fs.writeFile('data.json', JSON.stringify(data), 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.send('write error');
        }
});
  
  deleteAllDocumentsInCollection()
  insertData(data)
  var home = 'home';
  
  res.render('home', { data: data, title:home });
  
  
});

//remove task 
app.post('/remove', function(req, res) {
  let data =[];
  console.log('remove');

const raw = fs.readFileSync('data.json');
//CHECK IS JSON FILE IS EMPTY AND HANDLE ACCORDINGLY
if(raw == ''){
  console.log("removed empty");
  res.render('home', { data: data, title:home });
}
else{
  let firstElement = JSON.parse(raw);
  //EXISTING JSON DATA IS CONVERTED TO AN ARRAY AND PUSHED INTO THE NEW ARRAY
  //THIS STEP IS DUE TO THE NESTING FORMED IN JSON DATA WHEN TRIED TO PUSH ARRAY DATA DIRECTLY INTO JSON FILE
  firstElement.forEach(element => {
   data.push(element);
  });
 data.pop();
 console.log("popped")
}

 
// Convert JavaScript array back to JSON and write to file
fs.writeFile('data.json', JSON.stringify(data), 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.send('write error');
        } else {
            console.log("remove and write success");
          
        }
      });
  if (data !== '') {
    console.log('all documents deleted')
    deleteAllDocumentsInCollection()
  }
  
insertData(data)
  console.log(data);
  res.render('home.ejs', { data: data, title:'home' });
  
  
});
// console.log(MongoClient.getMongo());

app.listen(port, function(err){
    if(err){
        
        console.log(`Error in running server: ${err}`);

    }
    console.log(`Server is running on port:${port}`);
})