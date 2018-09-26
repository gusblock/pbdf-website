$(function() {
    var success_fun = function(data) {
        console.log("Authentication successful!");
        console.log("Authentication token:", data);
	token = jwt_decode(data);
	var adres = token.attributes["pbdf.pbdf.idin.address"] || token.attributes["pbdf.nijmegen.address.street"];
	var postcode = token.attributes["pbdf.pbdf.idin.zipcode"] || token.attributes["pbdf.nijmegen.address.zipcode"];
	var plaats = token.attributes["pbdf.pbdf.idin.city"] || token.attributes["pbdf.nijmegen.address.city"];
	document.getElementById("adres_regel").value = adres;
	document.getElementById("postcode_regel").value = postcode;
	document.getElementById("plaats_regel").value = plaats;
    }

    var cancel_fun = function(data) {
        console.log("Authentication cancelled!");
        $("#result_status")
            .html("Adres check geannulleerd.")
            .addClass("alert alert-warning")
            .css("font-weight", "bold");
    }

    var error_fun = function(data) {
        console.log("Authentication failed!");
        console.log("Error data:", data);
        $("#result_status")
            .html("Adres check mislukt!")
            .addClass("alert alert-danger")
            .css("font-weight", "bold");
    }

    $('#try_irma_adresbtn').click(function() {
        console.log("Button clicked");
        $("#result_status").removeClass().html();
        $.get('../jwt.php?type=adres', function(jwt) {
            IRMA.verify(jwt, success_fun, cancel_fun, error_fun);
        })
    });

});
