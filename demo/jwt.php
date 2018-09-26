<?php
require_once 'config.php';
require_once VENDOR.'/autoload.php';
use \Firebase\JWT\JWT;

$requests = [
    "18plus" => [
        [
            "label" => "Over 18",
            "attributes" => ["pbdf.pbdf.ageLimits.over18", "pbdf.nijmegen.ageLimits.over18"]
        ],
    ],
    "adres" => [
        [
            "label" => "straat",
            "attributes" => ["pbdf.nijmegen.address.street", "pbdf.pbdf.idin.address"]
        ],
        [
            "label" => "postcode",
            "attributes" => ["pbdf.nijmegen.address.zipcode", "pbdf.pbdf.idin.zipcode"]
        ],
        [
            "label" => "plaats",
            "attributes" => ["pbdf.nijmegen.address.city", "pbdf.pbdf.idin.city"]
        ],
    ],
    "student" => [
        [
            "label" => "student",
            "attributes" => ["pbdf.pbdf.surfnet.type"]
        ],
    ],
    "school" => [
        [
            "label" => "type",
            "attributes" => ["pbdf.pbdf.surfnet.type"]
        ],
        [
            "label" => "school",
            "attributes" => ["pbdf.pbdf.surfnet.institute"]
        ],
    ],
    "gmail" => [
        [
            "label" => "Gmail",
            "attributes" => ["pbdf.pbdf.email.email"]
        ],
    ],
    "email" => [
        [
            "label" => "E-mail",
            "attributes" => ["pbdf.pbdf.email.email"]
        ],
    ],
    "presencecheck" => [
        [
            "label" => "familyname",
            "attributes" => ["pbdf.pbdf.idin.familyname", "pbdf.pbdf.facebook.familyname"]
        ],
        [
            "label" => "email",
            "attributes" => ["pbdf.pbdf.surfnet.email"] 
        ],
        [
            "label" => "id",
            "attributes" => ["pbdf.pbdf.surfnet.id"]
        ],
    ],
];

function get_jwt_key() {
    $pk = openssl_pkey_get_private("file://" . PRIVATEKEY);
    if ($pk === false)
        throw new Exception("Failed to load signing key");
    return $pk;
}

function get_verification_jwt($sprequest) {
    $request = [
        "iat" => time(),
        "sub" => "verification_request",
        "iss" => "IRMA demo",
        "sprequest" => [
            "validity" => 60,
            "request" => [
                "content" => $sprequest
            ]
        ]
    ];

    return JWT::encode($request, get_jwt_key(), "RS256", "irmademo");
}

if (!isset($_GET['type']) || !array_key_exists($_GET['type'], $requests)) {
    http_response_code(400);
    echo "Invalid request";
    return;
}

header('Access-Control-Allow-Origin: *');
echo get_verification_jwt($requests[$_GET['type']]);
?>
