var mongoose = require("mongoose");  
var db =  
mongoose.connect('mongodb://127.0.0.1/myreactemp',{useMongoClient : true} , function (err,response) { 
   if(err){ console.log('Failed to connect to ' + db); }  
   else{ console.log('Sucessfully Connected to database'); }  
});  
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
  
  
module.exports =db;