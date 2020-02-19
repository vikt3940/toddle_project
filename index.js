var	express 		 = require("express");
var bodyParser 		 = require('body-parser');
var cookieParser     = require('cookie-parser');
var http 			 = require('http');
var fs 				 = require('fs');
var jwt 			 = require('jsonwebtoken');
var Jimp 			 = require('jimp');


var app = express();
var port = 3000;
var server = http.createServer(app).listen(port, function(){
	console.log("Express server listening on port " + port);
});

var privateKey = "It takes courage to grow up and become who you really are. :- E.E. Cummungs";

app.use(bodyParser.json({limit: '100Mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '100Mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.raw({inflate: true, limit: '100Mb', extended: true, type: 'application/json' }));

// Not using Database (Assigned Global Variable to Store the Data)
var registeruser = [];
var survey = [];
var survey_result = [];


//Webmobi Api Service
app.get('/',function(req,res){
	console.log("Welcome to Toddle API Services");
	res.send("Welcome to Toddle API Services");
})


//Start Api
app.post('/api', function (req, res) {
	var name=req.body.s;
	res.send('Ecomm API is running');
});

function id_gen() {
    return (Math.random().toString().slice(2, 10));
}

function authentication(req , res , next) {
	// body...
	var vb = req.headers.authorization;
	console.log(typeof vb);
	if (vb) {
		token = vb.split(/ (.+)/)[1];
		jwt.verify(token, privateKey, function(err, decoded) {
		   	if (err) {
		   		res.sendStatus(403);
		   	}else{
		   		console.log(decoded);
		   		req.username_token = decoded.username;
		   		next();
		   	}
		});
	}else{
		res.sendStatus(403);
	}
}

app.post('/api/registeruser' , function (req, res) {

	console.log("-----------------/api/registeruser-----------------",new Date())
	// body...
	var insufficientData = [];
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;

	console.log ("param", name,username,password);
	if (name == "" || name == undefined || name == null) {
		insufficientData.push("name is null");
	}

	if (password == "" || password == undefined || password == null) {
		insufficientData.push("password is null");
	}
	if (username == "" || username == undefined || username == null) {
		insufficientData.push("username is null");
	}

	if (insufficientData.length == 0) {
		let user_info = registeruser.filter(function (obj) {
			if (obj.username == username) {
				return obj;
			}
		})
		if (user_info.length == 0) {
			let user = {"username":username, "name":name , "password":password};
			registeruser.push(user);
			res.send({"response":true, "responseString":"User Added Successfully"});
			
		}else{
			console.log("User Already Exist")
			res.send({"response":true, "responseString":"User Already Exist"});
		} 
	}else{
		console.log("insufficientData",insufficientData);
		res.send({"response":false, "responseString":"insufficientData","data":insufficientData});
	}
});
app.post('/api/login' , function (req, res) {
	// body...

	console.log("-----------------/api/login-----------------",new Date())
	// body...
	var insufficientData = [];

	var vb = req.headers.authorization;
	if (vb == undefined || vb == "" || vb==null) {
		insufficientData.push("Incorect Format");
	}

	if (insufficientData.length == 0) {
		//basic authentication
		vb1 = vb.split(/ (.+)/)[1];
		var cred = new Buffer(vb1,'base64').toString();

		var username	= cred.split(":")[0];
		var password	= cred.split(":")[1];

		let user_info = registeruser.filter(function (obj) {
			if (obj.username == username) {
				return obj;
			}
		})
		console.log(user_info)
		if (user_info.length == 0) {
			console.log("User Not Exist",username)
			res.send({"response":true, "responseString":"User Not Exist"});
		}else{
			console.log(user_info[0].password, password);
			if (user_info[0].password === password) {
				// sign with RSA SHA256
				var token = jwt.sign({ "username": username }, privateKey, { expiresIn: '1h' });
				console.log("Loggedin Successfully")
				res.send({"response":true, "responseString":"Loggedin Successfully", "token":token});
			}else{
				console.log("Incorect password");
				res.send({"response":true, "responseString":"Incorect password"});
			}
		}
		
	}else{
		console.log("insufficientData",insufficientData);
		res.send({"response":false, "responseString":"insufficientData","data":insufficientData});
	}
});
app.post('/api/survey', authentication , function (req, res) {
	// body...
	console.log("-----------------/api/survey-----------------",new Date())
	// body...
	var insufficientData = [];
	var question = req.body.question;
	var option1 = req.body.option1;
	var option2 = req.body.option2; 
	var username = req.username_token;
	console.log ("param", question,option1,option2,username);
	if (question == "" || question == undefined || question == null) {
		insufficientData.push("question is null");
	}

	if (option1 == "" || option1 == undefined || option1 == null) {
		insufficientData.push("option1 is null");
	}

	if (option2 == "" || option2 == undefined || option2 == null) {
		insufficientData.push("option2 is null");
	}	
	if (insufficientData.length == 0) {
		let user_info = registeruser.filter(function (obj) {
			if (obj.username == username) {
				return obj;
			}
		})
		if (user_info.length == 0) {
			console.log("User Not Exist")
			res.send({"response":false, "responseString":"User Not Exist"});
		}else{
			let question_id = id_gen();
			let survey_q = {"question_id":question_id,"createdAt":new Date(),"createdBy":username, "question":question,"option":[option1,option2]};
			survey.push(survey_q);
			res.send({"response":true, "responseString":"Question Added Successfully"});

		} 
	}else{
		console.log("insufficientData",insufficientData);
		res.send({"response":false, "responseString":"insufficientData","data":insufficientData});
	}
});
app.post('/api/feedback', authentication , function (req, res) {
	console.log("-----------------/api/survey-----------------",new Date())
	// body...
	var insufficientData = [];
	var question_id = req.body.question_id;
	var option = req.body.option;
	var username = req.username_token;

	console.log ("param", question_id,option,username);
	if (question_id == "" || question_id == undefined || question_id == null) {
		insufficientData.push("question_id is null");
	}

	if (option == "" || option == undefined || option == null) {
		insufficientData.push("option is null");
	}
	
	if (insufficientData.length == 0) {
		let user_info = registeruser.filter(function (obj) {
			if (obj.username == username) {
				return obj;
			}
		})
		let survey_info = survey.filter(function (obj) {
			if (obj.question_id == question_id) {
				return obj;
			}
		})
		let survey_result = survey_result.filter(function (obj) {
			if (obj.question_id == question_id && obj.username == username) {
				return obj;
			}
		})
		if (user_info.length == 0 || survey_info == 0 || survey_info[0].option[0] != option && survey_info[0].option[1] != option) {
			console.log("User , question or option Not Exist" , username,question_id)
			res.send({"response":false, "responseString":"Incorrect question Id or option"});
		}else{
			if (survey_result.length ==0) {

				let result = {"question_id":question_id,"submittedAt":new Date(),"submittedBy":username, "question":survey_info[0].question , "option":option};
				survey_result.push(result);
				res.send({"response":true, "responseString":"Survey Submitted Successfully"});
			}else{
				console.log("Survey Already Submitted")
				res.send({"response":true, "responseString":"Survey Already Submitted"});
			}
		} 
	}else{
		console.log("insufficientData",insufficientData);
		res.send({"response":false, "responseString":"insufficientData","data":insufficientData});
	}
});
app.get('/api/survey_result', authentication , function (req, res) {
	// body...
	res.send({"response":true, "responseString":"Data fetched Successfully","data": survey_result});

});
app.get('/api/get_users', authentication , function (req, res) {
	// body...
	res.send({"response":true, "responseString":"Data fetched Successfully","data": registeruser});
});

app.get('/api/get_survey_question', authentication , function (req, res) {
	// body...
	res.send({"response":true, "responseString":"Data fetched Successfully","data": survey});
});

app.get('/api/create_thumbnail', function (req,res) {
	// body...
	console.log("-----------------/api/survey-----------------",new Date())
	// body...
	var insufficientData = [];
	var image_url = req.query.image_url;

	console.log ("param", image_url);
	if (image_url == "" || image_url == undefined || image_url == null) {
		insufficientData.push("image_url is null");
	}
	var imageName = "resize"+id_gen()+".png";
	Jimp.read(image_url)
	  .then(data => {
	     data.resize(50, 50) // resize
	     data.write('resize.png'); // save
	     res.send({"response":true,"responseString":"Thumbnail Created Successfully",thumbnail_url:"classiq.in/"+imageName})
	 })
  	.catch(err => {
    	console.error(err);
  	});
})