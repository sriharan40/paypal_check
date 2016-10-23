var express = require('express');
var mysql = require('mysql');
var app = express();

var db_config = {
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: 'b213965cc9ad75',
    password: '9c81ac99',
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

var params=function(req){
  var q=req.url.split('?'),result={};
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
	
req.params=params(req);

var mobile = req.params.mobile;

var user_id = req.params.user_id;
	
var post  = {mobile: mobile , user_id: user_id};
	
if(mobile && user_id)
{
connection.query('INSERT INTO t_users SET ?', post, function(err, rows, fields) {
});	
}

    connection.query('SELECT * from t_users', function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        response.send(['User id Mappings', rows]);
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
