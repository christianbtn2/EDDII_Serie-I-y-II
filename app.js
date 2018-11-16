var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Pizza = require('./Pizza.model');

var db = "mongodb://admin:password@ds241025.mlab.com:41025/datastructures";
//var db = "mongodb://localhost/myapp";
var db = mongoose.connect(db, function(err){
	if(err){
		console.log("Ocurrió un error al intentar conectar a la base de datos.");
		console.log("Intente montar la base de datos de manera local.");
	}
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
var port = 5000;

app.get('/:params', function(req, res){
	if(req.params.params == "pizzas" || !req.params.params){
		console.log("getting all pizzas");
		
			Pizza.find({}).exec(function(err, pizzas){
				if(err){
					console.log("an error has ocurred");
				}else{
					console.log(pizzas);
					//res.json(pizzas);
					res.render('pizzas.ejs', {data: pizzas});
				}
			});	}
	if(req.params.params != "pizzas")
		res.redirect("/pizzas");		
});

app.get('/', function(req, res){
	res.redirect('/a');
});

app.use(function(req, res, next){
	if(req.query._method == 'DELETE'){
		req.method = 'DELETE';
		req.url = req.path;
	}else if(req.query._method == 'PUT'){
		req.method='PUT';
		req.url = req.path;
	}
	next();
});

app.get('/pizzas/:id', function(req, res){
	if(req.params.id=="crear"){ //  pizzas/crear
		return res.render('crear.ejs', {data: null});
	}
	console.log('getting one pizza');
	Pizza.findOne({
		_id: req.params.id
	}).exec(function(err, pizza){
		if(err){
			res.render("404NotFound.ejs");
		}else{
			console.log(pizza);
			res.render('crear.ejs', {data: pizza});
		}
	});
});


app.post('/pizzas', function(req, res){
	req.body.quesoExtra = req.body.quesoExtra != undefined;
	Pizza.create(req.body, function(err, pizza){
		if(err){
			res.send("Error");
		}else{
			res.redirect("/pizzas");
		}
	});
});
app.post('/pizza/:params', function(req, res){
	if(req.params.params=="buscar"){
		Pizza.find({
		nombre: req.body.search
	}).exec(function(err, pizzas){
		if(err){
			res.send("ocurred an error");
		}else{
			res.render('pizzas.ejs', {data: pizzas});
		}
	});
	}
});
app.put('/pizza/:id', function(req, res){
	
	req.body.quesoExtra = req.body.quesoExtra != undefined;
	Pizza.findOneAndUpdate({
		_id: req.params.id
	},{
		$set:req.body
	},{upsert: true},
		function(err, newPizza){
			if(err)
				console.log("an error occured");
			else{
				console.log(newPizza);
				res.redirect("/pizzas");
			}
		}
	);
});

app.delete('/pizza/:id', function(req, res){
	Pizza.findOneAndRemove({
		_id: req.params.id
	}, function(err, pizza){
		if(err)
			 res.send("error");
		else{
			Pizza.find({}).exec(function(err, pizzas){
				if(err){
					console.log("an error has ocurred");
				}else{
					console.log(pizzas);
					//res.json(pizzas);
					res.redirect("/pizzas");
				}
			});
		}
	});
});

app.listen(port, function(){
	console.log("server is up!");
});