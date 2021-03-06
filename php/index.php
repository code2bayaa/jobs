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

    if(in_array('user',array_keys($decoded))){
         $name = false;
         if($user_logon){
             $stmt = "SELECT *
                      FROM users WHERE email = '$user_logon'";
             $user = $db->getData($stmt);
             if(count($user) > 0)
                $name = $user[0]['name'];
             else{
                 $stmt = "SELECT *
                          FROM employer WHERE email = '$user_logon'";
                 $employer = $db->getData($stmt);
                 if(count($employer) > 0)
                    $name = $employer[0]['institution'];
             }
         }

        print_r(json_encode(['user' => $user_logon, 'name' => $name]));
    }

    if(in_array('ad',array_keys($decoded))){
         $stmt = "SELECT *
                FROM employer WHERE email = '".$user_logon."'";
         $exists = $db->getData($stmt);
         $feedback = "Session expired";
         $userRecord = false;
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
         print_r(json_encode(['feedback' => $feedback, 'success' => $userRecord]));
    }
    if(in_array('create',array_keys($decoded))){

        $insertArray = array(
            ['key' => 'name', 'value' => $decoded['name']],
            ['key' => 'email', 'value' => $decoded['email']],
            ['key' => 'password', 'value' => md5($decoded['password'])]
        );
        $userRecord = $db->insertData('users',$insertArray);

        function obtain($userRecord){
            if($userRecord)
                return 'Registered successfully';
            elseif(($userRecord == "null"))
                return 'Error with inputs';
            else
                return 'Error with user registration';
        }
        $feedback = obtain($userRecord);

        print_r(json_encode(['feedback' => $feedback, 'success' => $userRecord]));

    }

    if(in_array('create_employer',array_keys($decoded))){

        $stmt = "SELECT *
               FROM users WHERE email = '".$decoded['email']."'";
        $exists = $db->getData($stmt);

        $allow = false;
        if(count($exists) < 1){
            $stmt = "SELECT *
                   FROM employer WHERE email = '".$decoded['email']."'";
            $exists = $db->getData($stmt);
            if(count($exists) < 1)
                $allow = true;
        }else
            $allow = false;

        $feedback = "User already in our system";
        $userRecord = [];
        if($allow){
            $insertArray = array(
                ['key' => 'institution', 'value' => $decoded['institution']],
                ['key' => 'email', 'value' => $decoded['email']],
                ['key' => 'telephone', 'value' => $decoded['telephone']],
                ['key' => 'password', 'value' => md5($decoded['password'])]
            );
            $userRecord = $db->insertData('employer',$insertArray);

            function obtain($userRecord){
                if($userRecord)
                    return 'Registered successfully';
                elseif(($userRecord == "null"))
                    return 'Error with inputs';
                else
                    return 'Error with employer registration';
            }
            $feedback = obtain($userRecord);
        }
        print_r(json_encode(['feedback' => $feedback, 'success' => $userRecord]));

    }
    if(in_array('delete_jobs',array_keys($decoded))){
        $stmt = "DELETE FROM applications WHERE email = '$user_logon' AND jobsId = '".$decoded['id']."'";

        $destruction = $db->deleteData($stmt);
        print_r(json_encode(['command' => $destruction]));
    }
    if(in_array('applications',array_keys($decoded))){
        $stmt = "SELECT *
               FROM applications WHERE users = '$user_logon'";
        $applications = $db->getData($stmt);
        $approved = false;
        $jobs = [];

        if(count($applications) > 0){
             foreach($applications as $app){
                 $stmt = "SELECT *
                        FROM jobs WHERE jobsId = '".$app['jobsId']."'";
                 $job = $db->getData($stmt);
                 if(count($job) > 0){
                     if($app['applicationsId'] == $job[0]['job_filled'])
                        $approved = true;
                     $job[0]['job_qualifications'] = json_decode($job[0]['job_qualifications']);
                     foreach($job as $j)
                        array_push($jobs,$j);
                 }
             }
        }
        print_r(json_encode([ 'jobs' => $jobs, 'approved' => $approved ]));
    }
    if(in_array('apply_jobs',array_keys($decoded))){
        $insertArray = array(
            ['key' => 'jobsId', 'value' => $decoded['id']],
            ['key' => 'users', 'value' => $user_logon]
        );
        $appRecord = $db->insertData('applications',$insertArray);
        print_r(json_encode(['success' => $appRecord]));
    }
    if(in_array('jobs_all',array_keys($decoded))){
        $stmt = "SELECT *
               FROM jobs";

        $jobs = $db->getData($stmt);
        print_r(json_encode([ 'jobs' => $jobs]));
    }
    if(in_array('employer_jobs',array_keys($decoded))){
        $stmt = "SELECT *
               FROM jobs WHERE job_employer = '$user_logon' ORDER BY timestamp DESC";
        $jobs = $db->getData($stmt);

        $stmt = "SELECT *
               FROM employer WHERE email = '$user_logon'";
        $employer = $db->getData($stmt);

        if(count($jobs) > 0){
            foreach($jobs as $k => $job){
                $jobs[$k]['job_employer'] = $employer[0]['institution'];
                $jobs[$k]['job_qualifications'] = json_decode($job['job_qualifications']);
                $stmt = "SELECT *
                       FROM applications WHERE jobsId = '".$job['jobsId']."'";
                $application = $db->getData($stmt);
                $jobs[$k]['applicants']['other'] = [];
                $jobs[$k]['applicants']['selected'] = [];
                if(count($application) > 0){
                    foreach($application as $a_key => $app){
                        $stmt = "SELECT *
                               FROM users WHERE email = '".$app['users']."'";
                        $candidate = $db->getData($stmt);
                        if($app['approved'] === 0)
                            $jobs[$k]['applicants']['other'][] = ['id' => $app['applicationsId'],'name' => $candidate[0]['name'], 'telephone' => $candidate[0]['telephone'], 'email' => $candidate[0]['email'], 'gender' => $candidate[0]['gender'], 'age' => $candidate[0]['age'], 'experience' => $candidate[0]['experience'], 'education' => json_decode($candidate[0]['education']), 'work' => json_decode($candidate[0]['work']), 'referees' => json_decode($candidate[0]['referees'])];
                        else
                            $jobs[$k]['applicants']['selected'][] = ['id' => $app['applicationsId'],'name' => $candidate[0]['name'], 'telephone' => $candidate[0]['telephone'], 'email' => $candidate[0]['email'], 'gender' => $candidate[0]['gender'], 'age' => $candidate[0]['age'], 'experience' => $candidate[0]['experience'], 'education' => json_decode($candidate[0]['education']), 'work' => json_decode($candidate[0]['work']), 'referees' => json_decode($candidate[0]['referees']), 'documents' => json_decode($candidate[0]['documents'])];
                    }
                }
            }
        }

        print_r(json_encode([ 'jobs' => $jobs]));
    }
    if(in_array('all_jobs',array_keys($decoded))){
      $stmt = "SELECT *
               FROM users WHERE email = '$user_logon'";

      $users = $db->getData($stmt);

      $jobs = [];
      if(count($users) > 0){
          $stmt = "SELECT *
                   FROM jobs WHERE job_ward = '".$users[0]['ward']."' OR job_county = '".$users[0]['county']."' OR job_country = '".$users[0]['country']."' OR job_professions = '".$users[0]['profession']."'";

        $jobs = $db->getData($stmt);
        if(count($jobs) > 0){
          foreach($jobs as $k => $job){
              $jobs[$k]['job_qualifications'] = json_decode($job['job_qualifications']);
              $stmt = "SELECT *
                       FROM employer WHERE email = '".$job['job_employer']."'";
              $employer = $db->getData($stmt);
              $jobs[$k]['job_employer'] = $employer[0]['institution'];
              $stmt = "SELECT *
                         FROM applications WHERE users = '$user_logon' AND jobsId = '".$job['jobsId']."'";

              $applied = $db->getData($stmt);
              if(count($applied) > 0)
                $jobs[$k]['applied'] = true;
              else
                $jobs[$k]['applied'] = false;
          }
        }
      }
      print_r(json_encode([ 'jobs' => $jobs]));
    }
    if(in_array('out',array_keys($decoded))){
        session_destroy();
        session_unset();
        print_r(json_encode(['command' => true]));
    }
    if(in_array('destroy',array_keys($decoded))){

        $stmt = "DELETE FROM ".$decoded['table']." WHERE email = '$user_logon'";
        $destruction = $db->deleteData($stmt);
        print_r(json_encode(['command' => $destruction]));

    }

    if(in_array('destroy_jobs',array_keys($decoded))){

        $stmt = "DELETE FROM jobs WHERE jobsId = '".$decoded['id']."'";

        $destruction = $db->deleteData($stmt);
        print_r(json_encode(['command' => $destruction]));
    }

    if(in_array('hospital_search',array_keys($decoded))){
         $mouse = $decoded['data'];
         $stmt = "SELECT *
                  FROM hospital WHERE Name LIKE '%$mouse%'";

         $hospital = $db->getData($stmt);

         print_r(json_encode([ 'hospital' => $hospital]));
    }

    if(in_array('users_search',array_keys($decoded))){
         $stmt = "SELECT *
                  FROM ".$decoded['table']." ";
         foreach($decoded['data'] as $k => $value){
            if($k == 0)
                $stmt .= "WHERE ";
            else
                $stmt .= "OR ";
            foreach($value['cell'] as $key => $column){
                if($key > 0)
                    $stmt .= "OR ";
                $stmt .= "$column = ".$value['data']."";
            }
         }
         $users = $db->getData($stmt);
         print_r(json_encode([ 'users' => $users]));
    }

    if(in_array('record_search',array_keys($decoded))){
         $mouse = $decoded['data'];
         $stmt = "SELECT *
                  FROM records WHERE DoctorName LIKE '%$mouse%' OR HospitalName LIKE '%$mouse%'";

         $record = $db->getData($stmt);

         print_r(json_encode([ 'record' => $record]));
    }

    if(in_array('hospital_name',array_keys($decoded))){
         $stmt = "SELECT *
                  FROM hospital";

         $hospitals = $db->getData($stmt);

         $data = [];
         if(count($hospitals) > 0)
             foreach($hospitals as $hospital)
                $data[] = [ 'id' => $hospital['hospitalId'] .','. $hospital['Name'], 'text' => $hospital['Name'] ];

         print_r(json_encode([ 'all' => $hospitals, 'select' => $data ]));
    }

    if(in_array('users_name',array_keys($decoded))){
         $stmt = "SELECT *
                  FROM users";

         $users = $db->getData($stmt);

         $data = [];
         if(count($users) > 0)
             foreach($users as $user)
                $data[] = [ 'id' => $user['usersId'] .','. $user['name'], 'text' => $user['name'] ];

         print_r(json_encode([ 'all' => $users, 'select' => $data ]));
    }

    if(in_array('employers_name',array_keys($decoded))){
         $stmt = "SELECT *
                  FROM employer";

         $users = $db->getData($stmt);

         $data = [];
         if(count($users) > 0)
             foreach($users as $user)
                $data[] = [ 'id' => $user['employerId'] .','. $user['institution'], 'text' => $user['institution'] ];

         print_r(json_encode([ 'all' => $users, 'select' => $data ]));
    }

    if(in_array('record_name',array_keys($decoded))){
         $stmt = "SELECT *
                  FROM records WHERE email = '$user_logon'";

         $records = $db->getData($stmt);

         $data = [];
         if(count($records) > 0){
            foreach($records as $record){
                 $stmt = "SELECT *
                          FROM doctor WHERE doctorId = '".$record['doctorId']."'";

                 $doctors = $db->getData($stmt);
                 if(count($doctors) > 0)
                    foreach($doctors as $doctor)
                        $data[] = [ 'id' => $doctor['doctorId'] .','. $doctor['Name'], 'text' => $doctor['Name']];

                 $stmt = "SELECT *
                          FROM hospital WHERE hospitalId = '".$record['hospitalId']."'";

                 $hospitals = $db->getData($stmt);
                 if(count($hospitals) > 0)
                    foreach($hospitals as $hospital)
                        $data[] = [ 'id' => $hospital['hospitalId'] .','. $hospital['Name'], 'text' => $hospital['Name']];

            }
         }

        $stmt = "SELECT *
               FROM package WHERE email = '$user_logon'";

        $package = $db->getData($stmt);
        $member = false;
        if(count($package) > 0)
            $member = $package[0]['Package'];

        print_r(json_encode([ 'all' => $records, 'select' => $data, 'package' => $member]));
    }
    if(isset($_POST['update_document'])){
         $stmt = "SELECT documents
                  FROM users WHERE email = '$user_logon'";

         $users = $db->getData($stmt);
         $profile = false;
         if(count($users) > 0){
             $target = "./../documents/".basename($_FILES['img']['name']);
             move_uploaded_file($_FILES['img']['tmp_name'],$target);
             $img_string = ['name' => 'cv', 'document' => 'http://localhost/jobs/documents/'.basename($_FILES['img']['name'])];
             $data_from_db = [$img_string];

             if(!empty($users[0]['documents'])){
                 $data_from_db = json_decode($users[0]['documents']);
                 array_push($data_from_db,$img_string);
             }
             $send_to_db = json_encode($data_from_db);

             $stmt = "UPDATE users SET documents = '".$send_to_db."' WHERE email = '$user_logon'";
             $profile = $db->updateData($stmt);
         }
         print_r(json_encode(['success' => $profile]));
    }
    if(in_array('approve',array_keys($decoded))){
         $stmt = "UPDATE applications SET approved = '1' WHERE applicationsId = '".$decoded['id']."'";
         $profile = $db->updateData($stmt);
         print_r(json_encode(['success' => $profile]));
    }
    if(in_array('remove',array_keys($decoded))){
         $stmt = "UPDATE applications SET approved = '0' WHERE applicationsId = '".$decoded['id']."'";
         $profile = $db->updateData($stmt);
         print_r(json_encode(['success' => $profile]));
    }
    if(in_array('update_user',array_keys($decoded))){
         $stmt = "SELECT ".$decoded['table']."
                  FROM users WHERE email = '$user_logon'";

         $users = $db->getData($stmt);
         $profile = false;

         if(count($users) > 0){
             $data_from_db = [$decoded['data']];
             if(!empty($users[0][$decoded['table']])){
                 $data_from_db = json_decode($users[0][$decoded['table']]);
                 array_push($data_from_db,$decoded['data']);
             }
             $send_to_db = json_encode($data_from_db);

             $stmt = "UPDATE users SET ".$decoded['table']." = '".$send_to_db."' WHERE email = '$user_logon'";
             $profile = $db->updateData($stmt);
         }
         print_r(json_encode(['success' => $profile]));
    }
    if(in_array('profile-edit',array_keys($decoded))){
         if($decoded['cell'] == "password")
            $decoded['data'] = md5($decoded['data']);
         $stmt = "UPDATE users SET ".$decoded['cell']." = '".$decoded['data']."' WHERE email = '$user_logon'";
         $profile = $db->updateData($stmt);
         print_r(json_encode(['success' => $profile]));
    }
    if(in_array('profile-edit-employer',array_keys($decoded))){
         if($decoded['cell'] == "password")
            $decoded['data'] = md5($decoded['data']);
         $stmt = "UPDATE employer SET ".$decoded['cell']." = '".$decoded['data']."' WHERE email = '$user_logon'";
         $profile = $db->updateData($stmt);
         print_r(json_encode(['success' => $profile]));
    }
    if(in_array('profile',array_keys($decoded))){
         $stmt = "SELECT *
                  FROM users WHERE email = '$user_logon'";

         $users = $db->getData($stmt);
         if(count($users) < 1){
             $stmt = "SELECT *
                      FROM employer WHERE email = '$user_logon'";

             $users = $db->getData($stmt);
         }
         print_r(json_encode([ 'users' => $users ]));
    }
    if(in_array('job_groups',array_keys($decoded))){
        $stmt = "SELECT * FROM jobs";

        $groups = $db->getData($stmt);

         $data = [];
         if(count($groups) > 0)
             foreach($groups as $group)
                $data[] = [ 'id' => $group['jobsId'] .','. $group['job_field'], 'text' => $group['job_field'] ];

         print_r(json_encode([ 'select' => $data ]));

    }
    if(in_array('login',array_keys($decoded))){
        $password = md5($decoded['password']);

        $admin = false;
        if(($decoded['email'] == $personal->admin && $decoded['password'] == $personal->password) || ($decoded['email'] == (int)$personal->contact && $decoded['password'] == $personal->password))
            $admin = true;
        else{
            $stmt = "SELECT *
                     FROM users WHERE email = '".$decoded['email']."' AND password = '".$password."' OR  telephone = '".$decoded['email']."' AND password = '".$password."'";

            $profileRecord = $db->getData($stmt);
            $feedback = "Invalid user";
            $name = false;
            if(count($profileRecord) > 0){
                $name = true;
                $feedback = "Welcome ".$profileRecord[0]['name'];
                $_SESSION['user'] = $profileRecord[0]['email'];
            }else{

                $stmt = "SELECT *
                         FROM employer WHERE email = '".$decoded['email']."' AND password = '".$password."' OR  telephone = '".$decoded['email']."' AND password = '".$password."'";

                $employerRecord = $db->getData($stmt);

                if(count($employerRecord) > 0){
                    $name = true;
                    $admin = 0;
                    $feedback = "Logged into ".$employerRecord[0]['institution'];
                    $_SESSION['user'] = $employerRecord[0]['email'];
                }
            }
        }

        print_r(json_encode(['feedback' => $feedback, 'identity' => $name, 'admin' => $admin, 'extra' => [$personal->admin,$personal->password]]));
    }
    if(in_array('graph',array_keys($decoded))){

        $now_table = "jobs";
        if($decoded['table'] == 1)
            $now_table = "employer";
        if($decoded['table'] == 2)
            $now_table = "users";
        if($decoded['table'] == 3)
            $now_table = "applications";
        $stmt = "SELECT *
                 FROM $now_table";

        $foundRecord = $db->getData($stmt);
        $graphData = [];
        if(count($foundRecord) > 0){
            foreach($foundRecord as $foundItem){
                $TIMESTAMP = $foundItem['timestamp'];
                $time = strtotime($TIMESTAMP);
                $c_time = date("D",$time);
                $c_day = date("d",$time);
                if(in_array($c_time,array_column($graphData,"date"))){
                    $work_key = array_keys(array_column($graphData,"date"),$c_time)[0];
                    $graphData[$work_key]["count"] = (int)$graphData[array_keys(array_column($graphData,"date"),$c_time)[0]]["count"] + 1;
                    $graphData[$work_key]["day"] = $c_day;
                }else{
                    $graphData[] = array(
                        "date" => $c_time,
                        "count" => 1,
                        "day" => $c_day
                    );
                }
            }
        }

        $keys = array_column($graphData, 'day');
        array_multisort($keys, SORT_ASC, $graphData);
        print_r(json_encode($graphData));
    }


?>