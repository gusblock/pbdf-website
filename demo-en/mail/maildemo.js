$(function() {
    var successgmail_fun = function(data) {
        console.log("Authentication successful!");
        console.log("Authentication token:", data);
	    token = jwt_decode(data);
	    console.log(token.attributes);
        var email = token.attributes["pbdf.pbdf.email.email"];
        var email_len = email.length;
        var email_tail = email.substr(email_len - 9, email_len);
        if ( email_tail === "gmail.com") {
            $("#main").html("<h3>Email verification succeeded!</h3><p>You have revealed a <tt>gmail.com</tt> address, which allows you to proceed, for instance to <a href=\"https://www.google.com/gmail/\">Gmail</a><b><p><a href=\"#\" onclick=\"window.location.reload(true)\">Back</a></p>");
        } else {
            $("#main").html("<h3>Email verification failed!</h3><p>You do <em>not</em> have a <tt>gmail.com</tt> address, but: &nbsp; <b>" 
            + email  + "</p> <br><p><a href=\"#\" onclick=\"window.location.reload(true)\">Back</a></p>");
        }
    }

    var successemail_fun = function(data) {
        console.log("Authentication successful!");
        console.log("Authentication token:", data);
	    token = jwt_decode(data);
	    console.log(token.attributes);
	    var email = token.attributes["pbdf.pbdf.email.email"];
	    $("#main").html("<h3>Email disclosure succeeded!</h3><p>You have revealed e-mail address: &nbsp; <b>"
		    	+ email  + 
			    "</b></p> <br><p><a href=\"#\" onclick=\"window.location.reload(true)\">Back</a></p>");
    }

    var cancel_fun = function(data) {
        console.log("Authentication cancelled!");
        $("#result_status")
            .html("Email verification cancelled.")
            .addClass("alert alert-warning")
            .css("font-weight", "bold");
    }

    var error_fun = function(data) {
        console.log("Authentication failed!");
        console.log("Error data:", data);
        $("#result_status")
            .html("Email verification failed!")
            .addClass("alert alert-danger")
            .css("font-weight", "bold");
    }

    $('#try_irma_gmailbtn').click(function() {
        console.log("Button clicked");
        $.get('../jwt.php?type=gmail', function(jwt) {
            IRMA.verify(jwt, successgmail_fun, cancel_fun, error_fun);
        });
    });

    $('#try_irma_emailbtn').click(function() {
        console.log("Button clicked");
        $.get('../jwt.php?type=email', function(jwt) {
            IRMA.verify(jwt, successemail_fun, cancel_fun, error_fun);
        });
    });

});
