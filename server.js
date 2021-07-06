var express = require("express");  
var path = require("path");  
var mongoose = require('mongoose');   
var bodyParser = require('body-parser');   
var morgan = require("morgan");  
var db = require("./config.js");  
var ejs = require('ejs');

var app = express();  
var port = process.env.port || 8888;  
var srcpath  =path.join(__dirname,'/public') ;  
app.use(express.static('public'));  
app.use(bodyParser.json());    
app.use(bodyParser.urlencoded({extended:true}));  
  
// Database Connectivity
var Schema = mongoose.Schema;  
var studentScheema = new Schema({      
    usn: { type: String, unique : true, dropDups: true  },       
    studentname: { type: String   },    
    email: { type: String   }, 
    phoneno: { type: String   }, 
    sem: { type: String   },         
},{ versionKey: false });  
var model = mongoose.model('student', studentScheema, 'student');  

app.get('/home', function (req, res) {  
    console.log("Got a GET request for the homepage");  
    res.sendFile(path.join(__dirname+'/Welcome.html'));
 })
 
 app.get('/about', function (req, res) {  
    console.log("Got a GET request for /about"); 
    res.sendFile(path.join(__dirname+'/about.html'));
 })
//api for INSERT data from database  
app.post("/api/savedata",function(req,res){   
       
    var mod = new model(req.body);  
	req.body.serverMessage = "NodeJS replying to REACT"
	mod.save(function (err, result){                       
        if(err) 
		{ 
			console.log(err.message); 
			//res.send("Duplicate student ID")
			res.json({
			status: 'fail'
		    })
		} 
		else
		{
            console.log('student Inserted');
			/*Sending the respone back to the angular Client */
			res.json({
			msg: 'We received your data!!!(nodejs)',
			status: 'success',mydata:req.body
			})
		}
       })     
})  

 // get data from database DISPLAY  
 app.get('/display', function (req, res) { 
//------------- USING EMBEDDED JS -----------
 model.find().sort({usn:1}).exec(
 		function(err , i){
        if (err) return console.log(err)
        res.render('disp.ejs',{students: i})  
     })
//---------------------// sort({usn:-1}) for descending order -----------//
})

app.get('/delete.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "delete.html" );    
})

//api for Delete data from database  
app.get("/delete", function(req, res) {
	//var usnnum=parseInt(req.query.usn)  // if usn is an integer
	var usnnum=req.query.usn;
	
        model.remove({"usn":usnnum},function(err, obj){
				if (err) {
					console.log("Failed to remove data.");
			} else {
				if (obj.result.n>=1)
				{
				res.send("<br/>"+usnnum+":"+"<b>student Deleted</b>");
				console.log("student Deleted")
				}
				else
					res.send("student Not Found")
			}
        });
  })
  
  
//Update data from database  
app.get('/update.html', function (req, res) {
    res.sendFile( __dirname + "/" + "update.html" );
})

app.get("/update", function(req, res) {
	var usn1=req.query.usn;

    var studentname1=req.query.studentname;
    var email1=req.query.email;
    var phoneno1=req.query.phoneno;
    var sem1=req.query.sem;


    console.log(studentname1)
    console.log(email1)
    console.log(phoneno1)
    console.log(sem1)
    console.log(usn1)

    model.findOneAndUpdate({"usn":usn1},{"studentname":studentname1,"email":email1,"phoneno":phoneno1,"sem":sem1},{multi:true},   
    function(err,obj) {  
     if (err) {  
        res.send(err);
       console.log("Failed to updated data") 
      }
      else 
     {
      if (obj==null)
       {  res.send("Student Not Found") }
     else
      {
	    res.send("<br/>"+studentname1+":"+"<b>Student Name Updated</b>");
	   console.log("Student Updated")
       }
     }
 });	
})	

//--------------SEARCH------------------------------------------
app.get('/search.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "search.html" );    
})

app.get("/search", function(req, res) {
	//var usnnum=parseInt(req.query.usn)  // if usn is an integer
	var usnnum=req.query.usn;
	model.find({usn: usnnum},{studentname:1,usn:1,email:1,phoneno:1,sem:1,_id:0}).exec(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data.");
    } else
	{
	if (docs=='')
		res.send("<br/>"+usnnum+":"+"<b>Student Not Found</b>")
	else
	    res.status(200).json(docs);
	}
  });
  })  
  
// call by default index.html page  
app.get("*",function(req,res){   
    res.sendFile(srcpath +'/index.html');  
})   
//server stat on given port  
app.listen(port,function(){   
    console.log("server start on port:"+ port);  
})  