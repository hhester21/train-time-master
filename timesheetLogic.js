

// 1. Initialize Firebase
  var config = {
    apiKey: "AIzaSyBRr572LflsjEL44lNm-9Ue4_Y3ucpvX6w",
    authDomain: "train-time-64afc.firebaseapp.com",
    databaseURL: "https://train-time-64afc.firebaseio.com",
    projectId: "train-time-64afc",
    storageBucket: "train-time-64afc.appspot.com",
    messagingSenderId: "117843198815"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
// Add button event
$("#add").on("click", function() {

	// Pull data from input fields
	var trainName = $("#name").val().trim();
	var trainDestination = $("#destination").val().trim();
	var trainFrequency = $("#frequency").val().trim();
	var twentyFourTime = $("#time").val().trim();

	// Convert from 24-hour time to total minutes past midnight for simpler database storage
	twentyFourTime = twentyFourTime.split(":");
	var trainTime = parseInt(twentyFourTime[0])*60 + parseInt(twentyFourTime[1]);

	// Push to database
	database.ref().push({
		name: trainName,
		destination: trainDestination,
		time: trainTime,
		frequency: trainFrequency
	});

}); // Close add button event



// Clear button event
$("#clear").on("click", function() {

	// Clear database
	database.ref().remove();
	// Clear document table
	$("#train-table").html("");

}); // Close add button event


// New data event
database.ref().on("value", function(trains) {
	
	trains.forEach(function(child) {

		// Create variables for train information
		var name = child.val().name;
		var destination = child.val().destination;
		var frequency = parseInt(child.val().frequency);
		var time = parseInt(child.val().time);

		// Get current unix time
		var now = new Date().getTime();
		// Convert to UTC -6
		now = now - (6*60*60*1000);
		// Convert unix date to number of milliseconds past midnight
		now = now % 86400000;
		// Convert milliseconds to minutes and round down
		now = Math.floor(now / 60000);
		// Calculate current hour
		var nowH = Math.floor(now / 60);
		// Calculate current minutes past the hour
		var nowM = now % 60;
		// Write current time to document
		$("#currentTime").html("Generated " + nowH + ":" + nowM + " Central Time.");
		
		// Calculate next arrival time
		var trainIndex = Math.ceil((now - time) / frequency);
		var nextArrival = time + trainIndex*frequency;

		// Calculate arrival hour
		var nextArrivalH = Math.floor(nextArrival / 60);
		// Calculate arrival minutes past the hour
		var nextArrivalM = nextArrival % 60;
		// Calculate minutes away
		var minutesAway = nextArrival - now;

		// Create new table row
		var newRow = $("<tr>");
		// Create all table data
		$("<td>").append(name).appendTo(newRow);
		$("<td>").append(destination).appendTo(newRow);
		$("<td>").append(frequency).appendTo(newRow);
		$("<td>").append(nextArrivalH + ":" + nextArrivalM).appendTo(newRow);
		$("<td>").append(minutesAway).appendTo(newRow);		
		// Append whole table row
		newRow.appendTo("#train-table");

	});

}); // Close new data event

