var express = require('express');
var mysql = require('mysql');
var app = express();
var AWS = require('aws-sdk');

AWS.config.update({
  region: "us-west-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

var dynamodb = new AWS.DynamoDB();

var docClient = new AWS.DynamoDB.DocumentClient();

var db_config = {
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: process.env.db_user,
    password: process.env.db_pass,
    database: 'heroku_a0067bd7c868fc0'
};

var connection;

function handleDisconnect() {
    console.log('1. connecting to db:');
    connection = mysql.createConnection(db_config); // Recreate the connection, since
													// the old one cannot be reused.

    connection.connect(function(err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    											// If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
            handleDisconnect();                      	// lost due to either server restart, or a
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

app.get('/', function(request, response) {

var params=function(request){
  var q=request.url.split('?'),result={};
  if(q.length>=2){
      q[1].split('&').forEach((item)=>{
           try {
             result[item.split('=')[0]]=item.split('=')[1];
           } catch (e) {
             result[item.split('=')[0]]='';
           }
      })
  }
  return result;
}
	
request.params=params(request);

var caller = request.params.caller;

var mobile = request.params.mobile;

var user_id = request.params.user_id;

var name = request.params.name;

var offers = request.params.offer;

var category = request.params.category;

var delete_offer = request.params.delete_offer;

var id = request.params.id;

var offer_name = request.params.offer_name;

var user_name = request.params.user_name;

var password = request.params.password;

var categorytitle = request.params.category_title;

if(categorytitle)
{
var categorytitle = ("" + categorytitle).replace(/%20/g, ' ');	
}

console.log("Category Title:"+categorytitle);

var categorysubtitle = request.params.category_sub_title;

if(categorysubtitle)
{
var categorysubtitle = ("" + categorysubtitle).replace(/%20/g, ' ');	
}

console.log("Category Sub Title:"+categorysubtitle);


var categoryimgurl = request.params.category_img_url;

if(categoryimgurl)
{
var categoryimgurl = ("" + categoryimgurl).replace(/%20/g, ' ');	
}

console.log("Category Img URL:"+categoryimgurl);


if(offer_name)
{
var offer_name = ("" + request.params.offer_name).replace(/%20/g, ' ');
}

var description = request.params.description;

if(description)
{
var description = ("" + request.params.description).replace(/%20/g, ' ');
}

if(user_name && password)
{
connection.query('SELECT * from admin_user where login = ?', user_name, function(err, results) {

var pass = results[0].pass;

var count = results.length;

if(pass === password)
{
	response.send('Valid User');	
}
else
{
	response.send('Invalid User');	
}

});
	
}

else if(categorytitle && categorysubtitle && categoryimgurl)
{
var table = "category";	

var update_params = {
    TableName:table,
    Key:{
        "id": 1
    },
    UpdateExpression: "set title = :t, sub_title=:s, img_url=:i",
    ExpressionAttributeValues:{
        ":t":categorytitle,
        ":s":categorysubtitle,
        ":i":categoryimgurl
    },
    ReturnValues:"UPDATED_NEW"
};

console.log("Updating the item...");
docClient.update(update_params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));

/* connection.query('SELECT * from category', function(err, results) {

var id = results.length + 1;	

var post  = {title: category_title , sub_title: category_sub_title , img_url: category_img_url};
	
connection.query('UPDATE category SET ?', post, function(err, rows, fields) {
});	

}); */

var select_params = {
	TableName:table
};

docClient.scan(select_params, function(err, data) {
if (err) {
	console.error("Unable to query. Error JSON:", JSON.stringify(err, null, 2));
} else {
response.send(['Offers category list', data.Items]);
}		
});

    }
});

/* connection.query('SELECT * from category', function(err, rows, fields) {
	if (err) {
		console.log('error: ', err);
		throw err;
	}
	response.send(['Offer category', rows]);
}); */		
	
}

else if(category)
{
var table = "category";	

var select_params = {
	TableName:table
};

docClient.scan(select_params, function(err, data) {
if (err) {
	console.error("Unable to query. Error JSON:", JSON.stringify(err, null, 2));
} else {
response.send(['Offers category list', data.Items]);
}		
});

/* connection.query('SELECT * from category', function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        response.send(['Offers category list', rows]);
    }); */
	
}

else if(mobile && user_id)
{	

	//AWS database code

	var table = "t_users";	
	
	var params = {
		TableName:table,
		Item:{
			"fb_user_id": user_id,
			"id": Math.floor(1000 + Math.random() * 9999),
			"mobile": mobile
		}
	};
	
	console.log("Params:"+JSON.stringify(params));
	
	docClient.put(params, function(err, data_output) {
		if (err) {
			console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("Added item:", JSON.stringify(data_output, null, 2));
		}
	});
	

connection.query('SELECT * from t_users', function(err, results) {

var id = results.length + 1;	

var post  = {id: id , mobile: mobile , user_id: user_id};
	
connection.query('INSERT INTO t_users SET ?', post, function(err, rows, fields) {
});	

});

connection.query('SELECT * from t_users', function(err, rows, fields) {
	if (err) {
		console.log('error: ', err);
		throw err;
	}
	response.send(['User id Mappings', rows]);
});		

}

else if(offer_name && description)
{

	//AWS database code

	var table = "offers";	

	var count_params = {
		TableName:table,
		Select: 'COUNT'
	};
	
	var select_params = {
		TableName:table
	};
	
	docClient.scan(count_params, function(err, data) {
		if (err) {
			console.error("Unable to query. Error JSON:", JSON.stringify(err, null, 2));
		} else {
	
	var params = {
		TableName:table,
		Item:{
			"id": data.Count + 1,
			"offer_name": offer_name,
			"description": description
		}
	};
	
	console.log("Params:"+JSON.stringify(params));
	
	docClient.put(params, function(err, data_output) {
		if (err) {
			console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("Added item:", JSON.stringify(data_output, null, 2));
		}
	});
	
		}

});
	
/* connection.query('SELECT * from offers', function(err, results) {

var id = results.length + 1;	

var post  = {id: id , offer_name: offer_name , description: description};
	
connection.query('INSERT INTO offers SET ?', post, function(err, rows, fields) {
});	

}); */



/* connection.query('SELECT * from offers', function(err, rows, fields) {
	if (err) {
		console.log('error: ', err);
		throw err;
	}
	response.send(['Offers list', rows]);
}); */		

	docClient.scan(select_params, function(err, data) {
		if (err) {
			console.error("Unable to query. Error JSON:", JSON.stringify(err, null, 2));
		} else {
		response.send(['Offers list', data.Items]);
		}		
	});	

}

else if(delete_offer && id)
{
	var table = "offers";	

var delete_params = {
	TableName:table,
	Key: {
		"id": id
  },
    UpdateExpression: "set offer_name = :n, description=:d",
    ExpressionAttributeValues:{
        ":n":"",
        ":d":""
    },
    ReturnValues:"UPDATED_NEW"
};

console.log("Updating the item...");
docClient.update(delete_params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));

	console.log("Params:"+JSON.stringify(delete_params));


	docClient.delete(delete_params, function(err, data) {
		if (err) {
			console.error("Unable to query. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			response.send('Offer Deleted successfully');
		}		
	});
	
//connection.query('DELETE from offers WHERE id = ?', id, function(err, rows, fields) {

//});		
}

else if(name)
{
connection.query('SELECT * from caller_system', function(err, results) {

var id = results.length + 1;	

var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = process.env.encrypt_pass;

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

var token = encrypt(name);

var post  = {id: id , caller_system_name: name , token: token};
	
connection.query('INSERT INTO caller_system SET ?', post, function(err, rows, fields) {
});	

});		

connection.query('SELECT * from caller_system', function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        response.send(['Caller_system', rows]);
    });
	
}

else if(caller)
{
connection.query('SELECT * from caller_system', function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        response.send(['Caller_system', rows]);
    });
	
}

else if(offers)
{

var table = "offers";	

var select_params = {
	TableName:table
};

docClient.scan(select_params, function(err, data) {
if (err) {
	console.error("Unable to query. Error JSON:", JSON.stringify(err, null, 2));
} else {
response.send(['Offers list', data.Items]);
}		
});

/* connection.query('SELECT * from offers', function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        response.send(['Offers list', rows]);
    }); */
	
}
	
else{
	connection.query('SELECT * from t_users GROUP BY user_id', function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        response.send(['User id Mappings', rows]);
    });
}
	
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
console.log("Listening on " + port);
});
