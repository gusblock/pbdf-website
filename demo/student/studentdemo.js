$(function() {
    var successstudent_fun = function(data) {
        console.log("Authentication successful!");
        console.log("Authentication token:", data);
	token = jwt_decode(data);
	console.log(token.attributes);
        $.each(token.attributes, function(attribute, value) {
	    if (value == "student") {
		$("#main").html('<h3>Student controle geslaagd!</h3><p>Voor aanbiedingen, ga naar: <a href="https://www.studentenwegwijzer.nl/studentenkorting/">(web)winkels</a></p> <br> <p><a href="#" onclick="window.location.reload(true)">Terug</a></p>');
	    }
	    else {
		$("#main").html('<h3>Student controle niet geslaagd!</h3><br> <p><a href="#" onclick="window.location.reload(true)">Terug</a></p>');
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
	    role = "medewerker"
	}
	var school = token.attributes["pbdf.pbdf.surfnet.institute"];
	$("#main").html('<h3>Attribuut controle is geslaagd!</h3><p>U bent <b>' 
			+ role  + 
			"</b> aan de instelling met afkorting <b>" 
			+ school + 
			"</b></p> <br>" + 
			"<p><a href=\"#\" onclick=\"window.location.reload(true)\">Terug</a></p>");
    }

    var cancel_fun = function(data) {
        console.log("Authentication cancelled!");
        $("#result_status")
            .html("student check geannulleerd.")
            .addClass("alert alert-warning")
            .css("font-weight", "bold");
    }

    var error_fun = function(data) {
        console.log("Authentication failed!");
        console.log("Error data:", data);
        $("#result_status")
            .html("student check mislukt!")
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
