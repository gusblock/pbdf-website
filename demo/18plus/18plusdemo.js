$(function() {
    var success_fun = function(data) {
        console.log("Authentication successful!");
        console.log("Authentication token:", data);
        $("#main").html('<h3>18+ leeftijdscontrole geslaagd!</h3><p><em>Grand Theft Auto</em> (GTA) is een voorbeeld van een game met een leeftijdsgrens van 18+. GTA kan na deze geslaagde leeftijdscontrole volgens de regels aangeschaft worden.</p><center><img src="GTA.gif"></center> <br> <p><a href="#" onclick="window.location.reload(true)">Terug</a></p>');
    }

    var cancel_fun = function(data) {
        console.log("Authentication cancelled!");
        $("#result_status")
            .html("18+ check geannulleerd.")
            .addClass("alert alert-warning")
            .css("font-weight", "bold");
    }

    var error_fun = function(data) {
        console.log("Authentication failed!");
        console.log("Error data:", data);
        $("#result_status")
            .html("18+ check mislukt!")
            .addClass("alert alert-danger")
            .css("font-weight", "bold");
    }

    $('#try_irma_18btn').click(function() {
        console.log("Button clicked");
        $("#result_status").removeClass().html();
        $.get('../jwt.php?type=18plus', function(jwt) {
            IRMA.verify(jwt, success_fun, cancel_fun, error_fun);
        })
    });

});
