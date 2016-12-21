var outputText = "";
var tasks = [];

// console.log( "js is ready" );

$(document).ready(function(){
  // console.log( "jQuery is ready" );
  getTask();

  // add task button click
  $( '#addTask' ).on( 'click', function(){
    postTask();
    $( 'input[ type="text"]').val('');
    location.reload();
  }); // end addbutton

  // send task to server
  var postTask = function(){
    console.log( 'in postTask' );
    // make object to send
    var newTask = {
      task: $( '#inputTask' ).val(),
      completed: false
    }; // end newTask
    console.log( newTask );
    $.ajax({
      type: 'POST',
      url: '/postTask',
      data: newTask,
      success: function( response ){
        console.log( 'back from postTask', response );
      } // end success
    }); // end ajax call
  }; // end postTask function

// response from server
function getTask(){
  $.ajax({
    type: 'GET',
    url: '/getTask',
    success: function( response ){
      console.log( 'back from get call', response );
      for (var i = 0; i < response.length; i++) {
        tasks.push(response[i]);
        if(response[i].completed === false){
          outputText += '<p><li>' + response[i].task + '<button class="complete" data="' + response[i].id + '">task complete</button><button class = "delete" data = "' + response[i].id + '">delete task</button></li></p>';
        } else {
          outputText += '<p><li><strike>' + response[i].task + '</strike><button class="delete" data="' + response[i].id + '">delete task</button></li></p>';
        }
      } // end for loop
      $( '#appendToDom' ).append( outputText );
    } // end success
  }); // end ajax call
} // end getTask

// button for complete
$( '#appendToDom' ).on('click', '.complete', function(){
  location.reload();
  var taskCompleted = $( this ).attr( 'data' );
  var objectToSend = {
    id: taskCompleted
  }; // end objectToSend
  $.ajax({
    url: '/taskCompleted',
    type: 'PUT',
    data: objectToSend,
    success: function ( data ){
    } // end success
  }); // end ajax call
}); // end append to DOM on click

// on click delete task
$( '#appendToDom' ).on( 'click', '.delete', function(){
  location.reload();
  var deleteTask = $( this ).attr( 'data' );
  var objectToSend = {
    id: deleteTask
  }; // end object to send
  $.ajax({
    url: '/taskDeleted',
    type: 'DELETE',
    data: objectToSend,
    success: function( data ){
      getTask();
    } // end success
  }); // end ajax
}); // end delete on click

}); // end document ready
