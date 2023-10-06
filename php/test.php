<?php
//     header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: *');

    /* Receive the RAW post data. */
//     $content = trim(file_get_contents("php://input"));
//     /* $decoded can be used the same as you would use $_POST in $.ajax */
//     $decoded = json_decode($content, true);
//     if(!$decoded)
//         $decoded = [];

print_r(json_encode(['feedback' => 'Hey']));

?>