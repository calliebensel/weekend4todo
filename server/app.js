var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var pg = require( 'pg' );
var urlEncodedParser = bodyParser.urlencoded( { extended: false } );
var port = process.env.PORT || 8080;
// connection string to db
var connectionString = 'postgres://localhost:5432/todoapp';
var tasks = [];



app.listen(port, function( req, res ){
  console.log( 'server listening on:', port );
}); // end app.listen


// base url
app.get( '/', function( req, res ){
  console.log( 'base url hit' );
  res.sendFile ( path.resolve( 'public/index.html' ));
}); // end base url

// send add new task to database
app.post('/postTask', urlEncodedParser, function( req, res ){
  console.log('add new task', req.body);
  tasks.push(req.body);
  pg.connect( connectionString, function( err, client, done){
    if( err ){
      console.log( err );
    } else {
      console.log( 'connected to db: ', req.body);
      client.query('INSERT INTO toDoTable(task, completed) VALUES($1, $2)', [req.body.task, req.body.completed]);
      done();
      res.send(' successfully posted to db');
    }
  }); // end pg.connect
}); // end app.post

// update task in db
app.put( '/taskCompleted', urlEncodedParser, function( req, res){
  console.log( 'updating db:', req.body);
  pg.connect(connectionString, function( err, client, done){
    if ( err ){
      console.log( 'put' );
    } else {
      var query = client.query('UPDATE toDoTable SET completed = TRUE WHERE id = $1', [req.body.id]);
      done();
      res.send( 'successfully posted to db' );
    }
  }); // end pg connect
}); // end app.put

// get info from db and send to client
app.get( '/getTask', function( req, res ){
  console.log( 'get tasks' );
  // connect to db
  pg.connect(connectionString, function( err, client, done ){
    if( err ){
      console.log( 'error connecting to db', err );
    } else {
      console.log( 'connected to db' );
      var tasks = [];
      var query = client.query( 'SELECT * from toDoTable' );
      query.on( 'row', function(row){
        tasks.push( row );
      }); // end query.on row
      query.on( 'end', function(){
        done();
        console.log( 'sending array back to client', tasks );
        res.send( tasks );
      }); // end query.on end
    } // end else
  }); // end pg.connect
}); // end app.get

app.delete( '/taskDeleted', urlEncodedParser, function( req, res ){
  console.log( 'in delete task' );
  pg.connect(connectionString, function( err, client, done ){
    if ( err ){
      console.log( 'error with delete' );
    } else {
      client.query('DELETE FROM toDoTable WHERE id= $1', [req.body.id]);
      query.on( 'row', function(){
        tasks.push( row );
      }); // end query on function
      query.on( 'end', function(){
        done();
        res.send( 'deleted' );     
      }); // end query.on end
    }
  }); // end pg.connect
}); // end app.delete

// static folder
app.use( express.static( 'public' ));
