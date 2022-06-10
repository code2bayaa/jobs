<?php
    require_once(__DIR__ . '/jobsDB.php');
    require_once(__DIR__ . '/Pocket.php');

    $db = new DataBase();
    $personal = new Pocket();

    /* Receive the RAW post data. */
    $content = trim(file_get_contents("php://input"));
    /* $decoded can be used the same as you would use $_POST in $.ajax */
    $decoded = json_decode($content, true);
    if(!$decoded)
        $decoded = [];

    $user_logon = false;
    if(isset($_SESSION['user']))
        $user_logon = $_SESSION['user'];

         $stmt = "SELECT *
                FROM employer WHERE email = 'safaricom@safaricom.com'";
         $exists = $db->getData($stmt);
         $feedback = "Session expired";
         $decoded = [
            'value' => [
                0,1,2,3,4,5,['ewe','wewer','wep'],7,8
            ]
         ];
         if(count($exists) > 0){
            $insertArray = array(
                ['key' => 'job_title', 'value' => $decoded['value'][0]],
                ['key' => 'job_description', 'value' => $decoded['value'][1]],
                ['key' => 'job_employer', 'value' => $user_logon],
                ['key' => 'job_ward', 'value' => $exists[0]['ward']],
                ['key' => 'job_county', 'value' => $exists[0]['county']],
                ['key' => 'job_country', 'value' => $exists[0]['country']],
                ['key' => 'job_field', 'value' => $decoded['value'][4]],
                ['key' => 'job_qualifications', 'value' => json_encode($decoded['value'][6])],
                ['key' => 'job_experience', 'value' => $decoded['value'][3]],
                ['key' => 'job_professions', 'value' => $decoded['value'][2]],
                ['key' => 'job_expiration', 'value' => $decoded['value'][5]]
            );
            $userRecord = $db->insertData('jobs',$insertArray);

            function obtain($userRecord){
                if($userRecord)
                    return 'Ad created successfully';
                elseif(($userRecord == "null"))
                    return 'Error with inputs';
                else
                    return 'Error with ad creation';
            }
            $feedback = obtain($userRecord);

         }
         print_r(json_encode(['feedback' => $feedback]));

?>