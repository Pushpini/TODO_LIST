const express = require('express');
const { resolve } = require('path');
const port = 8083;
const db = require('./config/mongoose');
const  Task  = require('./models/task');
const app = express();

app.use(express.static("./views"));
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', function(req, res){
    const studentContacts=Task.find({}).exec();
    studentContacts.then((data,task)=>{
        console.log(data);
        res.render('home',{ tittle: "Home",task: data});
    }).catch(err=>{
        console.log("error while fetchimg from db");
    });
});

app.post('/create-task', function(req, res){
  const stu_data=new Promise((resolve,reject)=>{
    Task.create({
        description: req.body.description,
         category: req.body.category,
         date: req.body.date
    }).then(newData=>{
        console.log("*new data*",newData);
        resolve(newData);
    }).catch(err=>{
        console.log("Error is",err);
        reject(err);
    });
  });
  stu_data.then(newData=>{
    res.redirect('back');
  }).catch(err=>{
    console.log("Error is",err);
  });
});

app.get('/delete-task', function(req, res){
    var id = req.query;
    var count = Object.keys(id).length;
    var deletePromises = [];
    for(let i=0; i < count ; i++){
        deletePromises.push(Task.findByIdAndDelete(Object.keys(id)[i]));
    }

    Promise.all(deletePromises).then(function(){
        return res.redirect('back'); 
    }).catch(function(err){
        console.log('error in deleting task', err);
        return res.redirect('back');
    });
});

// make the app to listen on asigned port number
app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});
