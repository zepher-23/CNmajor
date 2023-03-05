const express = require('express');
const app = express();
const port = 8000;

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mySchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
});

const MyModel = mongoose.model('MyModel', mySchema);

const newData = new MyModel({
  name: 'John',
  age: 30,
  email: 'john@example.com',
});

newData.save((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Data saved successfully.');
  }
});


//use express router
app.use('/', require('./routes'));
app.use(express.static('views'));
//setup view engine 
app.set('view engine','ejs');
app.set('views','./views');

  

const bodyParser = require('body-parser');
const fs = require('fs'); //TO READ JSON FILE

app.use(bodyParser.urlencoded({ extended: true }));



//HANDLES THE THE FORM DATA WHEN SUBMITTED
app.post('/', function(req, res) {
  let data =[];
  console.log('hello');
const currentData = req.body;
const raw = fs.readFileSync('data.json');

//CHECK IS JSON FILE IS EMPTY AND HANDLE ACCORDINGLY
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
        } else {
            
          res.send('Success');
        }
      });

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