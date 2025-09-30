<?php

$allowedOrigins = array('http://localhost:8081','http://192.168.0.22:8081','http://192.168.0.22','https://192.168.0.22', 'http://localhost', 'http://localhost:8000', 'http://192.168.0.22:8080', 'http://localhost:7000', 'http://localhost');

// if (in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: *');
// }

// print_r(json_encode(['origin' => $_SERVER['HTTP_ORIGIN']]));