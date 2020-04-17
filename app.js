var express = require('express');
var bodyParser = require('body-parser');
//var todoController = require('./controller/todoController');
var mongoose = require('mongoose');


//connect to mongodb(name of database being todoData)
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/todaData',{ useNewUrlParser: true})
    .then(() => console.log('connected to local databse'))
    .catch((err)=>console.log('err'));

//blueprint of data in database
var todoSchema = new mongoose.Schema({
    item:String
});

var Todo = mongoose.model('Todo' , todoSchema);

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false});

app.set('view engine' , 'ejs');

//app.use(express.static('./public'));

app.get('/todo',function(req,res){
     //get data from mongodb and pass it to view
    Todo.find({},function(err,data){
        if(err) throw err;
        res.render('index',{todos:data});
    });
});
app.post('/todo', urlencodedParser, function(req, res) {
    //get data from view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err,data){
        if(err) throw err;
        res.json(data);
    })
});
    
app.delete('/todo/:item',function(req,res){
      //deleted the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
        if (err) throw err;
        res.json(data);
    });
});

//todoController(app);

app.listen(8080);
console.log('You are listening to port 8080');