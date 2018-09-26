$(function() {
    var successstudent_fun = function(data) {
        console.log("Authentication successful!");
        console.log("Authentication token:", data);
	token = jwt_decode(data);
	console.log(token.attributes);
        $.each(token.attributes, function(attribute, value) {
	    if (value == "student") {
		$("#main").html('<h3>Student verification succeeded!</h3><p>For special offers, in Dutch, go to: <a href="https://www.studentenwegwijzer.nl/studentenkorting/">(web)winkels</a></p> <br> <p><a href="#" onclick="window.location.reload(true)">Back</a></p>');
	    }
	    else {
		$("#main").html('<h3>Student verification failed!</h3><br> <p><a href="#" onclick="window.location.reload(true)">Back</a></p>');
	    }
	});
    }


    var successschool_fun = function(data) {
        console.log("Authentication successful!");
        console.log("Authentication token:", data);
	token = jwt_decode(data);
	console.log(token.attributes);
	var isStudent = (token.attributes["pbdf.pbdf.surfnet.type"] === "student");
	var role;
	if (isStudent) {
	    role = "student"
	} else {
	    role = "employee"
	}
	var school = token.attributes["pbdf.pbdf.surfnet.institute"];
	$("#main").html('<h3>Attribute verification succeeded!</h3><p>You are <b>' 
			+ role  + 
			"</b> at the institution with abbreviation: <b>" 
			+ school + 
			"</b></p> <br>" + 
			"<p><a href=\"#\" onclick=\"window.location.reload(true)\">Back</a></p>");
    }

    var cancel_fun = function(data) {
        console.log("Authentication cancelled!");
        $("#result_status")
            .html("student verification cancelled.")
            .addClass("alert alert-warning")
            .css("font-weight", "bold");
    }

    var error_fun = function(data) {
        console.log("Authentication failed!");
        console.log("Error data:", data);
        $("#result_status")
            .html("student verification failed!")
            .addClass("alert alert-danger")
            .css("font-weight", "bold");
    }

    $('#try_irma_studentbtn').click(function() {
        console.log("Button clicked");
        $.get('../jwt.php?type=student', function(jwt) {
            IRMA.verify(jwt, successstudent_fun, cancel_fun, error_fun);
        });
    });

    $('#try_irma_studentschoolbtn').click(function() {
        console.log("Button clicked");
        $.get('../jwt.php?type=school', function(jwt) {
            IRMA.verify(jwt, successschool_fun, cancel_fun, error_fun);
        });
    });

});
