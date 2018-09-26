$(function() {
    var success_fun = function(data) {
        console.log("Authentication successful!");
        console.log("Authentication token:", data);
        $("#main").html('<h3>18+ Age check succeeded!</h3><p><em>Grand Theft Auto</em> (GTA) is an example of a game with an age limit of 18+. After this succesful age check GTA can be obtained in accordance with regulation.</p><center><img src=\"GTA.gif\"></center> <br> <p><a href=\"#\" onclick=\"window.location.reload(true)\">Back</a></p>');
    }

    var cancel_fun = function(data) {
        console.log("Authentication cancelled!");
        $("#result_status")
            .html("18+ check cancelled.")
            .addClass("alert alert-warning")
            .css("font-weight", "bold");
    }

    var error_fun = function(data) {
        console.log("Authentication failed!");
        console.log("Error data:", data);
        $("#result_status")
            .html("18+ check succesful!")
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
