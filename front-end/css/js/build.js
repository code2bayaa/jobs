
"use strict"
/*
* Main CORE script
* all functions
*
*/

//front-end
     
     export const ServerData = new(function(){
            this.getKey = function(object,value){ //Get Array keys
                return Object.keys(object).find(key => object[key] == value);
            };
            this.getAge = function(dateString) {
                var today = new Date();
                var birthDate = new Date(dateString);
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            }
            //FETCH API
            // ** Links Front End To Back End
            this.bindAuth = async(extra) => {
                let { method, body, header, link, data, way, load, r } = extra
                let pop = { method }
                if(!load)
                    this.pausePage({ 'msg' : 'loading...', 'run' : true, 'timer' : false, 'confirm' : false })
                if(method == "POST")
                    if(!way)
                        pop.body = JSON.stringify(body)
                    else
                        pop.body = body
                if(header)
                    pop.headers = { 'Content-type': 'application/json; charset=UTF-8' }

                try {
                    const response = await fetch( link, pop );

                    if(!load)
                            this.pausePage({ 'run' : false,  'msg' : 'loading...', 'timer' : false, 'confirm' : false })
                    if(data == 'json')
                        return await response.json();
                    if(data == 'text')
                        console.log(await response.text());

                } catch (error) {
                    // console.error(error);
                    // console.log([link, body]);
                    extra.data = 'text'
                    console.log(extra)
                    console.log(this.bindAuth(extra))
                }
            };
            this.spin = async(data) => {
                const { link, id, speed } = data
                const three_dimension = await this.bindAuth( { 'method' : 'GET', 'link' : `${ link }`, 'header' : false, 'data' : 'json', 'load' : true })
                if(three_dimension){
                    let k = 0;
                    setInterval(
                        function(){
                            document.querySelector(id).src = three_dimension.header + '' + three_dimension.spinner[k]
                            k++
                            if(k == 4)
                                k = 0
                        },speed
                    )
                }else
                    this.pausePage({ 'msg' : 'Request Timeout', 'timer' : 'fast', 'run' : true, 'confirm' : false })
            };
            this.pausePage = function(c){
                let { msg, timer, run, confirm } = c
                let a = msg.split('.').map( p =>  `<h3>${ p }</h3>` )
                if(run){
                    let p = `
                        <img id = 'pause-dimension' src = 'http://192.168.0.22:7000/image/load.gif' class = 'load-pause' >
                                    <div id = 'input-div-internal'>
                                        ${ a.join('.') }`
                                        if(confirm){
                                            p += `<button id = 'nowGo'>
                                                OK
                                            </button>`
                                        }
                                    p += `</div>`
                    $('#pauseWindow').remove()
                    const wall = document.createElement('div')
                    wall.setAttribute("id", 'pauseWindow');
                    wall.innerHTML = p
                    document.getElementById('build').appendChild(wall)
                    if(confirm){
                        $('#pauseWindow').css('display','flex')
                        $('#pauseWindow').css('flexDirection','row')
                    }
                    $('#pauseWindow').fadeIn('slow')
                    if(timer){
                        if(timer == 'fast')
                            timer = 500
                        if(timer == 'slow')
                            timer = 4000
                        setTimeout(
                            function(){
                                $('#pauseWindow').fadeOut()
                            },
                             timer
                        );
                    }
                }else{
                    $('#pauseWindow').fadeOut()
                }
            };
            this.users_string = function(data){
                if(data.length > 0){
                    let users = data.map( h =>
                        `<section style = 'width : 96%; height:250px; margin:2%;'>
                            <img src = '${ h.image || "image/avatar.jpg" }' style = 'float:left;width:250px;height:100%;'>
                            <div id = 'input-div' style = 'width : 50%;'>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;border:1px solid #ccc;border-radius:2px;'>
                                    <i class='fas fa-user-check'></i>
                                    <p>${ h.name || h.institution }</p>
                                </div>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;border:1px solid #ccc;border-radius:2px;'>
                                    <i class='fas fa-user-clock'></i>
                                    <p>${ h.address }</p>
                                    <p>${ h.ward }</p>
                                    <p>${ h.county }</p>
                                    <p>${ h.country }</p>
                                </div>
                            </div>
                            <div id = 'input-div' style = 'width : 50%'>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;border:1px solid #ccc;border-radius:2px;'>
                                   <i class='fas fa-phone'></i>
                                   <p>${ h.telephone }</p>
                                </div>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;border:1px solid #ccc;border-radius:2px;'>
                                   <i class='fas fa-at'></i>
                                   <p>${ h.email }</p>
                                </div>
                            </div>
                            <div id = 'input-div' style = 'width : 50%'>
                                <button id = 'delete-jobs'>Delete</button>
                            </div>
                        </section>`
                    )
                    return users.join('')
                }else{
                     return `<img src = 'image/undraw_lost_re_xqjt.svg' class = 'avatar-undraw'>
                     <h3>Could not be found</h3>`
                }
            }
        })() // New class


        const createGraph = (g) => {
            const { graph_data, id, text, label_one, label_two, label_three } = g
            let xValue = graph_data.map( b => b.date );
            let countValue = graph_data.map( b => Number(b.count) );
            var barColors = [ "red", "green", "blue", "orange", "brown" ];

            var chartData = {
                labels: xValue,
                datasets: [
                    {
                        type: 'line',
                        label: label_one,
                        borderColor: window.chartColors.blue,
                        borderWidth: 2,
                        fill: false,
                        data: countValue
                    },
                    {
                        type: 'bar',
                        label: label_two,
                        backgroundColor: window.chartColors.red,
                        data:countValue,
                        borderColor: 'white',
                        borderWidth: 2
                    },
                    {
                        type: 'bar',
                        label: label_three,
                        backgroundColor: window.chartColors.green,
                        data: countValue
                    }
                ]
            };

            var ctx = document.getElementById(id).getContext('2d');
            window.myMixedChart = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: true
                    }
                }
            });
        }

        function formatState (state) {
        /*  if (!state.id) {
            return state.text;
          }

          var baseUrl = "/user/pages/images/flags";
          var $state = $(
            '<span><img class="img-flag" /> <span></span></span>'
          );

          // Use .text() instead of HTML string concatenation to avoid script injection issues
          $state.find("span").text(state.text);
          $state.find("img").attr("src", baseUrl + "/" + state.element.value.toLowerCase() + ".png");

          return $state;
          */

        };

        const buildSelect = (e) => {
            let { id, placeholder, data, fill } = e

            $(id).select2({
                placeholder : placeholder,
                tags : true,
                //templateSelection : formatState,
                data : data.select
            }).on('select2:close', async function(){
                var element = $(this);
                var new_category = $.trim(element.val());
                let id = new_category.split(',')[0]
                if(fill == 1){
                    let filter = [{ 'cell' : ['usersId'], 'data' : id }]
                    let users_id = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : { 'users_search' : true, 'data' : filter, 'table' : 'users' }, 'data' : 'json'})
                    $('#view_users').html(ServerData.users_string(users_id.users))
                }
                if(fill == 2){
                    let filter = [{ 'cell' : ['employerId'], 'data' : id }]
                    let employer_id = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : { 'users_search' : true, 'data' : filter, 'table' : 'employers' }, 'data' : 'json'})
                    $('#view_users').html(ServerData.users_string(employer_id.users))
                }
            });
        }

        const plotView = async(e) => {
            let { channel, select_id, view_id, panel, placeholder } = e

            let all_data = {};
            if(channel == 1)
                all_data = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'jobs_name' : true }, 'data' : 'json' })

            if(channel == 2)
                all_data = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'users_name' : true }, 'data' : 'json' })

            if(channel == 3)
                all_data = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'record_name' : true }, 'data' : 'json' })

            buildSelect({'id' : '#' + select_id, 'placeholder' : placeholder, 'data' : all_data })

            let main_build = () => {
                if(channel == 1)
                    return 'jobs_id'
                if(channel == 2)
                    return 'doctor_id'
            }

            function if_length(){
                if(all_data.all.length > 0){
                    if(channel == 1 || channel == 2){

                      let string_data = all_data.all.map( h =>
                                `<section id = '${ main_build() }' style = 'width : 96%; height:250px; margin:2%;'>
                                    <img src = '${ h.Image }' style = 'float:left;width:50%;height:100%;'>
                                    <div id = 'input-div' style = 'width : 50%'>
                                        <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                            <i class='fas fa-user-check'></i>
                                            <p>${ h.Name }</p>
                                        </div>
                                        <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                            <i class='fas fa-user-clock'></i>
                                            <p>${ h.Address || ServerData.getAge(h.Age) }</p>
                                        </div>
                                    </div>
                                    <div id = 'input-div' style = 'width : 50%'>
                                        <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                           <i class='fas fa-phone'></i>
                                           <p>${ h.Telephone }</p>
                                        </div>
                                        <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                           <i class='fas fa-at'></i>
                                           <p>${ h.Email }</p>
                                        </div>
                                    </div>

                                </section>
                                    `
                      ).join('')
                      return string_data
                    }
                    if(channel == 3){
                        let record_string = all_data.all.map( h =>
                            `<section id = 'record_id'>
                                <div id = 'input-div'>
                                    <div id = 'input-div-internal' style = 'width:100%;background:#fff;'>
                                        <i class='fas fa-home'></i>
                                        <p>${ h.Sickness }</p>
                                    </div>
                                </div>
                                <div id = 'input-div'>
                                    <div id = 'input-div-internal'>
                                       <i class='fas fa-home'></i>
                                       <p>${ h.DoctorName }</p>
                                    </div>
                                    <div id = 'input-div-internal'>
                                       <i class='fas fa-home'></i>
                                       <p>${ h.jobsName }</p>
                                    </div>
                                </div>
                            </section>`
                        ).join('')
                        return record_string
                    }
                }else{
                     return `<img src = 'image/undraw_lost_re_xqjt.svg' class = 'avatar-undraw'>
                     <h3>No ${ panel } enlisted in the Database</h3>`
                }
            }
            const bit = if_length();
            $(view_id).html(bit)
        }

        //Get data from backend to profile wall with virtual storage
        export const retrieveContent = async(user,content,retrieve) => {
            let string = ServerData.bind_string
            document.querySelectorAll('#jobs').forEach( (h,k) => {
                if(k == content){
                    h.style.textDecoration = "underline"
                    h.style.color = "#fff"
                }else{
                    h.style.textDecoration = "none"
                    h.style.color = "#F7F8FB"
                }
            })
            if(user == 1)
                $('#main-focus').html(string.build.user.draft[content])
            if(user == 2)
                $('#main-focus').html(string.build.admin.draft[content])
            if(user == 3)
                $('#main-focus').html(string.build.employer.draft[content])

            if(retrieve == 0){
                let obtain_plot = await ServerData.bindAuth({ 'method' : 'POST', 'link' : `http://localhost/jobs/back-end/php/index.php`, 'header' : false, 'body' : { 'profile' : true }, 'data' : 'json'})

                let c = obtain_plot.users[0];

                if(c.image)
                    document.getElementById('profile-img').src = c.image
                else
                    document.getElementById('profile-img').src = './../image/avatar.jpg'

                console.log(c.age)
                $('#profile-name').val(c.name || c.institution)
                $('#profile-email').val(c.email)
                $('#profile-telephone').val(c.telephone)
                $('#profile-password').val(c.password)
                $('#profile-gender').val(c.gender)
                $('#profile-address').val(c.address)
                $('#profile-ward').val(c.ward)
                $('#profile-county').val(c.county)
                $('#profile-country').val(c.country)
                $('#profile-description').val(c.description)
                $('#profile-age').val(c.age)
                if(user == 1){

//                    if(c.age == "0000-00-00")
//                        document.getElementById('profile-age').setAttribute('type','date')
//                    else
//                        $('#profile-age').val(ServerData.getAge(c.age))
                    if(c.education){
                        const ed_arr = $.parseJSON(c.education)

                        let ed_string = ed_arr.map( s =>
                            `
                                <div class = 'bridge'>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>institution</p>
                                        <p>${ s.institution }</p>
                                    </div>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>grade</p>
                                        <p>${ s.grade }</p>
                                    </div>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>start</p>
                                        <p>${ s.start }</p>
                                    </div>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>end</p>
                                        <p>${ s.end }</p>
                                    </div>
                                </div>
                            `
                        )
                        $('#get_education').html(ed_string.join(''))
                    }
                    if(c.work){
                        const ed_arr = $.parseJSON(c.work)

                        let ed_string = ed_arr.map( s =>
                            `
                                <div class = 'bridge'>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>institution</p>
                                        <p>${ s.name }</p>
                                    </div>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>address</p>
                                        <p>${ s.address }</p>
                                    </div>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>start</p>
                                        <p>${ s.start }</p>
                                    </div>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>end</p>
                                        <p>${ s.end }</p>
                                    </div>
                                </div>
                            `
                        )
                        $('#get_work').html(ed_string.join(''))
                    }
                    if(c.referees){
                        const ed_arr = $.parseJSON(c.referees)

                        let ed_string = ed_arr.map( s =>
                            `
                                <div class = 'bridge'>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>institution</p>
                                        <p>${ s.institution }</p>
                                    </div>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>${ s.title }</p>
                                        <p>${ s.name }</p>
                                    </div>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>telephone</p>
                                        <p>${ s.telephone }</p>
                                    </div>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>email</p>
                                        <p>${ s.email }</p>
                                    </div>
                                    <div id = 'get-bridge'>
                                        <i class='fas fa-phone'></i>
                                        <p>address</p>
                                        <p>${ s.address }</p>
                                    </div>
                                </div>
                            `
                        )
                        $('#get_referees').html(ed_string.join(''))
                    }
                }
            }
            if(retrieve == 2){
                const all_data = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'users_name' : true }, 'data' : 'json' })
                $('#view_users').html(ServerData.users_string(all_data.all))
            }
            if(retrieve == 3){
            //VIEW JOBS APPLIED FOR
                const all_data = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'applications' : true }, 'data' : 'json' })
                console.log(all_data)
                if(all_data.jobs.length > 0){
                    let all_string = all_data.jobs.map( a =>
                        `<div id = 'hold-job'>
                            <h2>${ a.job_title }</h2>
                            <h3>${ a.job_description }</h3>
                            <p>${ (a.job_qualifications.length > 0)? `<h3> ${ a.job_qualifications.join(' || ') } </h3>`:`No qualifications needed` }</p>
                            <p>${ a.job_employer }</p>
                            <p>${ a.job_field } || ${ a.job_professions }</p>
                            <h3>experience : ${ a.job_experience }</h3>
                            <h3>${ (a.approved)?"approved":"pending approval" }</h3>
                            <button id = 'delete_application' index = '${ a.jobsId }'>Delete</button>
                        </div>
                        `
                    )
                    $('#view_applications').html(all_string.join(''))
                }
            }
            if(retrieve == 4){
                const all_data = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'employers_name' : true }, 'data' : 'json' })
                $('#view_users').html(ServerData.users_string(all_data.all))
            }
            if(retrieve == 5){
                const all_data = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'all_jobs' : true }, 'data' : 'json' })
                if(all_data.jobs.length > 0){
                    let all_string = all_data.jobs.map( a =>
                        `<div id = 'hold-job'>
                            <h2>${ a.job_title }</h2>
                            <h3>${ a.job_description }</h3>
                            <p>${ (a.job_qualifications.length > 0)? `<h3> ${ a.job_qualifications.join(' || ') } </h3>`:`No qualifications needed` }</p>
                            <p>${ a.job_employer }</p>
                            <p>${ a.job_field } || ${ a.job_professions }</p>
                            <h3>experience : ${ a.job_experience }</h3>
                            ${
                                (a.applied)?
                                    `<h4>Applied</h4>`
                                :
                                    `<button id = 'apply_job' index = '${ a.jobsId }'>Apply</button>`
                            }
                        </div>
                        `
                    )
                    $('#view_jobs').html(all_string.join(''))
                }
            }
            if(retrieve == 6)
                plotView({ 'channel' : 3, 'select_id' : 'view_record', 'view_id' : '#view_records', 'panel' : 'Records', 'placeholder' : 'Search Record Here...'})

            if(retrieve == 7){
                let all_jobs = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'jobs_name' : true }, 'data' : 'json' })

                buildSelect({'id' : '#jobs-record', 'placeholder' : 'jobs...', 'data' : all_jobs })

                let all_doctor = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'doctor_name' : true }, 'data' : 'json' })

                buildSelect({'id' : '#doctor-record', 'placeholder' : 'Doctor...', 'data' : all_doctor })
            }
            if(retrieve == 8){
                [
                    {'go_table' : '2','go_id' : 'users-graph','go_text' : 'Number of Users Against The Days'},
                    {'go_table' : '1','go_id' : 'employers-graph','go_text' : 'Number of Employers Engaged Over The Days'},
                    {'go_table' : '0','go_id' : 'jobs-graph','go_text' : 'Jobs Statistics'},
                    {'go_table' : '3','go_id' : 'application-graph','go_text' : 'Application Statistics'},
                ].map( async(p) => {
                    const { go_table, go_id, go_text } = p
                    let graph_data = await ServerData.bindAuth({ 'method' : 'POST', 'link' : `http://localhost/jobs/back-end/php/index.php`, 'header' : true, 'body' : { 'graph' : true, 'table' : go_table }, 'data' : 'json' })
                    createGraph({'graph_data' : graph_data, 'id' : go_id, 'text' : go_text, 'label_one' : go_text, 'label_two' : go_text, 'label_three' : go_text })
                }).join('')
            }
            if(retrieve == 9){
                let all_jobs = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'users_name' : true }, 'data' : 'json' })

                buildSelect({'id' : '#select_user', 'placeholder' : 'users...', 'data' : all_jobs, 'fill' : 1})

            }
            if(retrieve == 10){
                let all_employer = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'employers_name' : true }, 'data' : 'json' })

                buildSelect({'id' : '#select_user', 'placeholder' : 'Employers...', 'data' : all_employer, 'fill' : 2 })

            }
            if(retrieve == 11){
                const all_data = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'employer_jobs' : true }, 'data' : 'json' })
                if(all_data.jobs.length > 0){
                    console.log(all_data)
                    let check = (e,i) => {
                        const { selected, other } = e
                        if(i == 1){
                            if(selected.length > 0)
                                return true
                            else
                                return false
                        }
                        if(i == 2){
                            if(other.length > 0)
                                return true
                            else
                                return false
                        }
                    }
                    let all_string = all_data.jobs.map( a =>

                        `<div id = 'hold-ad'>
                            <h2>${ a.job_title }</h2>
                            <h3>${ a.job_description }</h3>
                            ${ (a.job_qualifications.length > 0)? `<h4> ${ a.job_qualifications.join(' || ') } </h4>`:`No qualifications needed` }
                            <h4>${ a.job_employer }</h4>
                            <h4>${ a.job_field } || ${ a.job_professions }</h4>
                            <h4>experience : ${ a.job_experience }</h4>
                            <h4>${ (a.job_filled == 1)?"Job Filled":"Vacant" }</h4>
                            <button id = 'delete-jobs' index = '${ a.jobsId }'>Delete</button>
                            ${
                                (check(a.applicants,1))?
                                    `
                                        <h2>Successful Candidates</h2>
                                        <div id = 'applicant'>
                                           ${
                                                a.applicants.selected.map( c =>
                                                `
                                                    <div id = 'short-div'>
                                                        <h4>Name</h4>
                                                        <h5>${ c.name }</h5>
                                                    </div>
                                                    <div id = 'short-div'>
                                                        <h4>Telephone</h4>
                                                        <h5>${ c.telephone }</h5>
                                                    </div>
                                                    <div id = 'short-div'>
                                                        <h4>Email</h4>
                                                        <h5>${ c.email }</h5>
                                                    </div>
                                                    <div id = 'short-div'>
                                                        <h4>Age</h4>
                                                        <h5>${ ServerData.getAge(c.age) }</h5>
                                                    </div>
                                                    <div id = 'short-div'>
                                                        <h4>Experience</h4>
                                                        <h5>${ c.experience }</h5>
                                                    </div>
                                                    <div id = 'short-div'>
                                                        <h4>Gender</h4>
                                                        <h5>${ c.gender }</h5>
                                                    </div>
                                                    ${
                                                        (c.education.length > 0)?
                                                        `<div id = 'long-div'>
                                                            <h4>Education</h4>
                                                            <div id = 'long-internal-div'>
                                                                ${ c.education.map( e => `<div><h4>institution</h4><h5>${ e.institution }</h5></div><div><h4>Grade/Rank</h4><h5>${ e.grade }</h5></div><div><h4>Start</h4><h5>${ e.start }</h5></div><div><h4>End</h4><h5>${ e.end }</h5></div>`) }
                                                            </div>
                                                        </div>`
                                                        :
                                                        "No education data"

                                                    }
                                                    ${
                                                        (c.work.length > 0)?
                                                        `<div id = 'long-div'>
                                                            <h4>Work</h4>
                                                            <div id = 'long-internal-div'>
                                                                ${ c.work.map( e => `<div><h4>institution</h4><h5>${ e.institution }</h5></div><div><h4>Address</h4><h5>${ e.address }</h5></div><div><h4>Start</h4><h5>${ e.start }</h5></div><div><h4>End</h4><h5>${ e.end }</h5></div>`) }
                                                            </div>
                                                        </div>`
                                                        :
                                                        "No work data"

                                                    }
                                                    ${
                                                        (c.referees.length > 0)?
                                                        `<div id = 'long-div'>
                                                            <h4>Referees</h4>
                                                            <div id = 'long-internal-div'>
                                                                ${ c.referees.map( e => `<div><h4>institution</h4><h5>${ e.institution }</h5></div><div><h4>Name</h4><h5>${ e.title + ' ' + e.name }</h5></div><div><h4>Address</h4><h5>${ e.address }</h5></div><div><h4>Contact</h4><h5>${ e.telephone }</h5><h5>${ e.email }</h5></div>`) }
                                                            </div>
                                                        </div>`
                                                        :
                                                        "<h4>No referee data</h4>"
                                                    }
                                                    <button id = 'remove-candidate' index = '${ c.id }'>Remove</button>
                                                `
                                                )
                                            }
                                        </div>
                                    `
                                :
                                    "<h4>No candidate approved</h4>"
                            }
                            ${
                                (check(a.applicants,2))?
                                    `
                                        <h2>Pending Candidates</h2>
                                        <div id = 'applicant'>
                                            ${
                                                a.applicants.other.map( c =>
                                                    `
                                                        <div id = 'short-div'>
                                                            <h4>Name</h4>
                                                            <h5>${ c.name }</h5>
                                                        </div>
                                                        <div id = 'short-div'>
                                                            <h4>Telephone</h4>
                                                            <h5>${ c.telephone }</h5>
                                                        </div>
                                                        <div id = 'short-div'>
                                                            <h4>Email</h4>
                                                            <h5>${ c.email }</h5>
                                                        </div>
                                                        <div id = 'short-div'>
                                                            <h4>Age</h4>
                                                            <h5>${ ServerData.getAge(c.age) }</h5>
                                                        </div>
                                                        <div id = 'short-div'>
                                                            <h4>Experience</h4>
                                                            <h5>${ c.experience }</h5>
                                                        </div>
                                                        <div id = 'short-div'>
                                                            <h4>Gender</h4>
                                                            <h5>${ c.gender }</h5>
                                                        </div>
                                                        ${
                                                            (c.education && c.education.length > 0)?
                                                            `<div id = 'long-div'>
                                                                <h4>Education</h4>
                                                                <div id = 'long-internal-div'>
                                                                    ${ c.education.map( e => `<div><h4>institution</h4><h5>${ e.institution }</h5></div><div><h4>Grade/Rank</h4><h5>${ e.grade }</h5></div><div><h4>Start</h4><h5>${ e.start }</h5></div><div><h4>End</h4><h5>${ e.end }</h5></div>`) }
                                                                </div>
                                                            </div>`
                                                            :
                                                            "No education data"

                                                        }
                                                        ${
                                                            (c.work && c.work.length > 0)?
                                                            `<div id = 'long-div'>
                                                                <h4>Work</h4>
                                                                <div id = 'long-internal-div'>
                                                                    ${ c.work.map( e => `<div><h4>institution</h4><h5>${ e.institution }</h5></div><div><h4>Address</h4><h5>${ e.address }</h5></div><div><h4>Start</h4><h5>${ e.start }</h5></div><div><h4>End</h4><h5>${ e.end }</h5></div>`) }
                                                                </div>
                                                            </div>`
                                                            :
                                                            "<h4>No work data</h4>"
                                                        }
                                                        ${
                                                            (c.referees && c.referees.length > 0)?
                                                            `<div id = 'long-div'>
                                                                <h4>Referees</h4>
                                                                <div id = 'long-internal-div'>
                                                                    ${ c.referees.map( e => `<div><h4>institution</h4><h5>${ e.institution }</h5></div><div><h4>Name</h4><h5>${ e.title + ' ' + e.name }</h5></div><div><h4>Address</h4><h5>${ e.address }</h5></div><div><h4>Contact</h4><h5>${ e.telephone }</h5><h5>${ e.email }</h5></div>`) }
                                                                </div>
                                                            </div>`
                                                            :
                                                            "<h4>No referee data</h4>"

                                                        }
                                                        <button id = 'select-candidate' index = '${ c.id }'>Select</button>
                                                    `
                                                )
                                            }

                                        </div>
                                    `
                                :
                                    "<h4>No candidate pending</h4>"
                            }

                        </div>

                        `
                    )
                    $('#view_ads').html(all_string.join('<br>'))
                }
            }
            if(retrieve == 12){
                 let all_group = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'job_groups' : true }, 'data' : 'json' })
                 buildSelect({ 'id' : '#ad_field', 'placeholder' : 'Job Groups...', 'data' : all_group })
            }
        }

        export const editProfile = async(e,n,f,s) => {
           const allInput = []
           document.querySelectorAll(f).forEach(i => {
                allInput.push(i.id)
           })
           allInput.filter( i => i.id )
           const loop = ServerData.getKey(allInput,e.currentTarget.id)
           if(n)
                document.querySelectorAll('#feedback')[loop].innerHTML = "Editing..."
           else{

               console.log('value ' + e.currentTarget.value)

               let edit = {}
               if(s == 1)
                    edit = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'load' : true, 'header' : false, 'body' : { 'profile-edit' : true, 'data' : e.currentTarget.value, 'cell' : document.querySelectorAll('#profile-tower p')[loop].innerHTML.trim() }, 'data' : 'json'})
               else
                    edit = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'load' : true, 'header' : false, 'body' : { 'profile-edit-employer' : true, 'data' : e.currentTarget.value, 'cell' : document.querySelectorAll('#profile-tower p')[loop].innerHTML.trim() }, 'data' : 'json'})

               if(edit.success)
                   document.querySelectorAll('#feedback')[loop].innerHTML = ""
           }
        }

        export const apply_package = async(e) => {
            let apply = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : { 'apply' : true, 'data' : e.currentTarget.attributes[1].value }, 'data' : 'json'})
            if(apply.package)
                jobsContent([5])
        }

        export const search_employers = async(e) => {
            const address = $('#employers_address').val()
            const ward = $('#employers_ward').val()
            const county = $('#employers_county').val()
            const country = $('#employers_country').val()
            const filter = [];
            if(address)
                filter.push({'cell' : ['address'], 'data' : address})
            if(ward)
                filter.push({'cell' : ['ward'], 'data' : ward})
            if(county)
                filter.push({'cell' : ['county'], 'data' : county})
            if(country)
                filter.push({'cell' : ['country'], 'data' : country})

            let employer_id = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : { 'users_search' : true, 'data' : filter, 'table' : 'employer' }, 'data' : 'json' })
            $('#view_users').html(ServerData.users_string(employer_id.users))
        }

        export const search_users = async(e) => {
            const area = $('#users_area').val()
            const profession = $('#users_profession').val()
            const experience = $('#users_experience').val()
            const age = $('#users_age').val()
            const gender = $('#users_gender').val()

            const filter = [];
            if(area)
                filter.push({'cell' : ['ward','county','address','country'], 'data' : area})
            if(profession)
                filter.push({'cell' : ['profession'], 'data' : profession})
            if(experience)
                filter.push({'cell' : ['experience'], 'data' : experience})
            if(age)
                filter.push({'cell' : ['age'], 'data' : age})
            if(gender)
                filter.push({'cell' : ['gender'], 'data' : gender})

            let users_id = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : { 'users_search' : true, 'data' : filter, 'table' : 'users' }, 'data' : 'json'})
            $('#view_users').html(ServerData.users_string(users_id.users))
        }
        export const search_jobs = async(e) => {
            const jobs = $('#view_jobs').val().split(',')[1];
            let jobs_id = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : { 'jobs_search' : true, 'data' : jobs }, 'data' : 'json'})
            if(jobs_id){
                if(jobs_id.jobs){
                    let jobs_string = jobs_id.jobs.map( h =>
                        `<section style = 'width : 96%; height:250px; margin:2%;'>
                            <img src = '${ h.Image }' style = 'float:left;width:50%;height:100%;'>
                            <div id = 'input-div' style = 'width : 50%'>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                    <i class='fas fa-user-check'></i>
                                    <p>${ h.Name }</p>
                                </div>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                    <i class='fas fa-user-clock'></i>
                                    <p>${ h.Address }</p>
                                </div>
                            </div>
                            <div id = 'input-div' style = 'width : 50%'>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                   <i class='fas fa-phone'></i>
                                   <p>${ h.Telephone }</p>
                                </div>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                   <i class='fas fa-at'></i>
                                   <p>${ h.Email }</p>
                                </div>
                            </div>

                        </section>
                            `
                    )
                    $('#view_jobs').html(jobs_string.join(''))
                }
            }else
                ServerData.pausePage({ 'msg' : 'Request Timeout. Try again', 'run' : true, 'timer' : 'fast', 'confirm' : false })
        }
        export const attach = async() => {
            const img = document.getElementById('actual_documents').files[0]
            const frmD = new FormData();
            frmD.append('update_document',true)
            frmD.append('img',img)

            let update_pro = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : frmD, 'data' : 'json', 'way' : true })
            if(update_pro.success)
                $('#profile-documents').html('Uploaded!');
        }
        export const education = async() => {
            const name = $('#ed_inst').val()
            const grade = $('#ed_grade').val()
            const start = $('#ed_start').val()
            const end = $('#ed_end').val()

            if(!name){
                ServerData.pausePage({ 'msg' : 'Add Institution Name', 'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            if(!grade){
                ServerData.pausePage({ 'msg' : 'Add Grade',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            if(!start){
                ServerData.pausePage({ 'msg' : 'Add Start',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            if(!end){
                ServerData.pausePage({ 'msg' : 'Add End',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }

            const education_data = { 'institution' : name, 'grade' : grade, 'start' : start, 'end' : end }

            let { success, data } = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : { 'update_user' : true, 'data' : education_data, 'table' : 'education' }, 'data' : 'json'})

            if(success){
                $('#ed_inst').val('')
                $('#ed_grade').val('')
                $('#ed_start').val('')
                $('#ed_end').val('')
                let ed_string = data.map( s =>
                    `
                        <div class = 'bridge'>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>institution</p>
                                <p>${ s.institution }</p>
                            </div>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>grade</p>
                                <p>${ s.grade }</p>
                            </div>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>start</p>
                                <p>${ s.start }</p>
                            </div>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>end</p>
                                <p>${ s.end }</p>
                            </div>
                        </div>
                    `
                )
                $('#get_education').html(ed_string.join(''))
                $('#get_education').html(ed_string.join(''))
                $('#get_education').slideDown('slow')
                $('[tag = "education"]').html('Close')
                $('[tag = "education"]').attr('point',1)
            }
        }
        export const referees = async() => {

            const institution = $('#ref_inst').val()
            const title = $('#ref_title').val()
            const name = $('#ref_name').val()
            const telephone = $('#ref_telephone').val()
            const email = $('#ref_email').val()
            const address = $('#ref_address').val()

            if(!institution){
                ServerData.pausePage({ 'msg' : 'Add Institution',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            if(!title){
                ServerData.pausePage({ 'msg' : 'Add Title',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            if(!name){
                ServerData.pausePage({ 'msg' : 'Add Name',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            if(!telephone){
                ServerData.pausePage({ 'msg' : 'Add Telephone',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            if(!email){
                ServerData.pausePage({ 'msg' : 'Add Email',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            if(!address){
                ServerData.pausePage({ 'msg' : 'Add Address',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }

            const referees_data = { 'institution' : institution, 'title' : title, 'name' : name, 'address' : address, 'email' : email, 'telephone' : telephone }

            let { success, data } = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : { 'update_user' : true, 'data' : referees_data, 'table' : 'referees' }, 'data' : 'json'})

            if(success){
                $('#ref_inst').val()
                $('#ref_title').val()
                $('#ref_name').val()
                $('#ref_telephone').val()
                $('#ref_email').val()
                $('#ref_address').val()
                let ed_string = data.map( s =>
                    `
                        <div class = 'bridge'>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>institution</p>
                                <p>${ s.institution }</p>
                            </div>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>${ s.title }</p>
                                <p>${ s.name }</p>
                            </div>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>telephone</p>
                                <p>${ s.telephone }</p>
                            </div>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>email</p>
                                <p>${ s.email }</p>
                            </div>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>address</p>
                                <p>${ s.address }</p>
                            </div>
                        </div>
                    `
                )
                $('#get_referees').html(ed_string.join(''))
                $('#get_referees').html(ed_string.join(''))
                $('#get_referees').html(ed_string.join(''))
                $('#get_referees').slideDown('slow')
                $('[tag = "referees"]').html('Close')
                $('[tag = "referees"]').attr('point',1)
            }
        }
        export const work = async() => {
            const name = $('#work_inst').val()
            const start = $('#work_start').val()
            const end = $('#work_end').val()
            const address = $('#work_address').val()

            if(!name){
                ServerData.pausePage({ 'msg' : 'Add Name',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            if(!start){
                ServerData.pausePage({ 'msg' : 'Add Start',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            if(!end){
                ServerData.pausePage({ 'msg' : 'Add End',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            if(!address){
                ServerData.pausePage({ 'msg' : 'Add Address',  'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }

            const work_data = { 'name' : name, 'address' : address, 'start' : start, 'end' : end }
            let { success, data } = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : { 'update_user' : true, 'data' : work_data, 'table' : 'work' }, 'data' : 'json'})

            if(success){
                $('#work_inst').val()
                $('#work_start').val()
                $('#work_end').val()
                $('#work_address').val()

                console.log(data)

                let ed_string = data.map( s =>
                    `
                        <div class = 'bridge'>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>institution</p>
                                <p>${ s.name }</p>
                            </div>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>address</p>
                                <p>${ s.address }</p>
                            </div>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>start</p>
                                <p>${ s.start }</p>
                            </div>
                            <div id = 'get-bridge'>
                                <i class='fas fa-phone'></i>
                                <p>end</p>
                                <p>${ s.end }</p>
                            </div>
                        </div>
                    `
                )
                $('#get_work').html(ed_string.join(''))
                $('#get_work').slideDown('slow')
                $('[tag = "work"]').html('Close')
                $('[tag = "work"]').attr('point',1)
            }
        }
        // export const search_doctor = async(e) => {
        //     const doctor = $('#view_doctor').val().split(',')[1];
        //     let doctor_id = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : { 'doctor_search' : true, 'data' : doctor }, 'data' : 'json'})
        //     if(doctor_id){
        //         if(doctor_id.doctor){
        //             let doctor_string = doctor_id.doctor.map( h =>
        //                 `<section style = 'width : 96%; height:250px; margin:2%;'>
        //                     <img src = '${ h.Image }' style = 'float:left;width:50%;height:100%;'>
        //                     <div id = 'input-div' style = 'width : 50%'>
        //                         <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
        //                             <i class='fas fa-user-check'></i>
        //                             <p>${ h.Name }</p>
        //                         </div>
        //                         <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
        //                             <i class='fas fa-user-clock'></i>
        //                             <p>${ ServerData.getAge(h.Age) }</p>
        //                         </div>
        //                     </div>
        //                     <div id = 'input-div' style = 'width : 50%'>
        //                         <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
        //                            <i class='fas fa-phone'></i>
        //                            <p>${ h.Telephone }</p>
        //                         </div>
        //                         <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
        //                            <i class='fas fa-at'></i>
        //                            <p>${ h.Email }</p>
        //                         </div>
        //                     </div>

        //                 </section>
        //                     `
        //             )
        //             $('#view_doctors').html(doctor_string.join(''))
        //         }
        //     }else
        //         ServerData.pausePage({ 'msg' : 'Request Timeout. Try again', 'run' : true, 'timer' : 'fast', 'confirm' : false })
        // }
        export const search_records = async(e) => {
            const record = $('#view_records').val().split(',')[1];
            let record_id = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : false, 'body' : { 'records_search' : true, 'data' : record }, 'data' : 'json'})
            if(record_id){
                if(record_id.record){
                    let record_string = record_id.record.map( h =>
                        `<section style = 'width : 96%; height:250px; margin:2%;'>
                            <img src = '${ h.Image }' style = 'float:left;width:50%;height:100%;'>
                            <div id = 'input-div' style = 'width : 50%'>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                    <i class='fas fa-user-check'></i>
                                    <p>${ h.Name }</p>
                                </div>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                    <i class='fas fa-user-clock'></i>
                                    <p>${ ServerData.getAge(h.Age) }</p>
                                </div>
                            </div>
                            <div id = 'input-div' style = 'width : 50%'>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                   <i class='fas fa-phone'></i>
                                   <p>${ h.Telephone }</p>
                                </div>
                                <div id = 'input-div-internal' style = 'width:48%;margin:1%;background:#fff;'>
                                   <i class='fas fa-at'></i>
                                   <p>${ h.Email }</p>
                                </div>
                            </div>

                        </section>
                            `
                    )
                    $('#view_records').html(record_string.join(''))
                }
            }else
                ServerData.pausePage({ 'msg' : 'Request Timeout. Try again', 'run' : true, 'timer' : 'fast', 'confirm' : false })
        }
        export const jobs_add = async(e) => {
            const telephone = $('#Get_h_telephone').val();
            const email = $('#Get_h_email').val();
            const name = $('#Get_name').val();
            const address = $('#Get_h_address').val();
            const img = document.getElementById('jobs-file').files[0]

            if(!telephone || !email || !name || !address || !img){
                let m = ``
                if(!telephone)
                    m += `Please Input a valid telephone<br>`
                if(!email)
                    m += `Please Input a valid email<br>`
                if(!name)
                    m += `Please Input a valid name<br>`
                if(!address)
                    m += `Please Input a valid address<br>`
                if(!img)
                    m += `Please Input a valid image<br>`
                ServerData.pausePage({ 'msg' : m, 'timer' : false, 'run' : true, 'confirm' : true })
            }else{
                const frmD = new FormData();
                frmD.append('create-jobs',true)
                frmD.append('name',name)
                frmD.append('img',img)
                frmD.append('telephone',telephone)
                frmD.append('email',email)
                frmD.append('address',address)
                let jobs = await ServerData.bindAuth({ 'method' : 'POST', 'link' : `http://localhost/jobs/back-end/php/index.php`, 'header' : false, 'body' : frmD, 'data' : 'json', 'way' : true })
                if(jobs)
                    retrieveContent(1,3,3)
            }
        }
        export const doctor_add = async(e) => {
            const telephone = $('#Get_doctor_telephone').val();
            const email = $('#Get_doctor_email').val();
            const name = $('#Get_doctor_name').val();
            const jobs_count = $('#Get_doctor_h_name').val().split(',')[0];
            const jobs_name = $('#Get_doctor_h_name').val().split(',')[1];
            const gender = $('#Get_doctor_gender').val();
            const age = $('#Get_doctor_age').val();
            const img = document.getElementById('doctor-file').files[0]

            if(!gender || !jobs_name || !telephone || !email || !name || !age || !img){
                let m = ``
                if(!gender)
                    m += `Please Input a valid gender<br>`
                if(!jobs_name)
                    m += `Please Input a valid jobs name<br>`
                if(!telephone)
                    m += `Please Input a valid telephone<br>`
                if(!email)
                    m += `Please Input a valid email<br>`
                if(!name)
                    m += `Please Input a valid name<br>`
                if(!age)
                    m += `Please Input a valid age<br>`
                if(!img)
                    m += `Please Input a valid image<br>`
                ServerData.pausePage({ 'msg' : m, 'timer' : false, 'run' : true, 'confirm' : true })
            }else{

                const frmD = new FormData();
                frmD.append('create-doctor',true)
                frmD.append('name',name)
                frmD.append('img',img)
                frmD.append('telephone',telephone)
                frmD.append('email',email)
                frmD.append('jobs',jobs_name)
                frmD.append('gender',gender)
                frmD.append('age',age)
                frmD.append('count',jobs_count)
                let jobs = await ServerData.bindAuth({ 'method' : 'POST', 'link' : `http://localhost/jobs/back-end/php/index.php`, 'header' : false, 'body' : frmD, 'data' : 'json', 'way' : true })
                if(jobs)
                    retrieveContent(1,5,5)
            }
        }
        export const apply_jobs = async(e) => {
            let apply = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'apply_jobs' : true, 'id' : e.currentTarget.attributes[1].value }, 'data' : 'json' })
            if(apply.success){
                ServerData.pausePage({ 'msg' : 'Successfully Applied!', 'timer' : false, 'run' : true, 'confirm' : true })
                ServerData.pausePage({ 'msg' : 'Successfully Applied!', 'timer' : false, 'run' : true, 'confirm' : true })
                jobsContent([5])
            }
        }
        // ----CREATE ADS
        // ** DONE BY EMMPLOYER
        export const create_ad = async() => {
//            let allow = true;
//            let points = []

            let points = [...document.querySelectorAll('.inputAccount')]
            .map( (t,k) => {
                const title = document.querySelectorAll('#input-div-internal h4')[k].innerHTML

                if(!t.value){

                    document.querySelectorAll('#feedback')[k].innerHTML = title + " is empty";
                    ServerData.pausePage({ 'msg' : 'Empty Field : ' + title, 'timer' : false, 'run' : true, 'confirm' : true })
//                    points.push(false)
                    return false
                }
//                points.push(t.value)
                return { [title] : t.value}
            }).join('')


            let allow = points.includes(false)

            console.log(allow)
            if(allow)
                return
//            .find( value => value == 0)

//            []
            let qualify_arr = [...document.querySelectorAll('#part-qualify h4')].map( d => d.innerHTML)

            if(qualify_arr.length < 1){
                ServerData.pausePage({ 'msg' : 'Add at least one qualification', 'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            points.push({ 'qualifications' : qualify_arr})


            const group = $('#ad_field').val()

            if(!group){
                ServerData.pausePage({ 'msg' : 'Add a job group', 'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            console.log(group)
            points.push({ 'group' : group})
//            points.push([1])
//            points.push({ 'expiration' : $('#ad_expiration').val()})
//            points.push(qualify_arr)

            console.log(points)

            //AD CREATED  THROUGH HERE...
            let create = await ServerData.bindAuth(
                { 'method' : 'POST',
                 'link' : 'http://localhost/jobs/back-end/php/index.php',
                  'header' : true,
                   'body' : { 'ad' : true, 'value' : points
                }, 'data' : 'json'
            })
            ServerData.pausePage({ 'msg' : create.feedback, 'timer' : false, 'run' : true, 'confirm' : true })
            if(create.success){
                 document.querySelectorAll('#create-ads input').forEach( i => {
                    i.value = ''
                 })
                 document.querySelectorAll('#create-ads select').forEach( i => {
                    i.value = ''
                 })
                 document.querySelectorAll('#create-ads textarea').forEach( i => {
                    i.value = ''
                 })
                 $('#add-qualification').html('')
            }
        }
        export const close_qualify = (e) => {
            document.querySelectorAll('#part-qualify')[Number(e.currentTarget.attributes[1].value)].remove()
        }
        export const qualify = () => {
            const q = $('#ad_must').val();

            if(!q){
                ServerData.pausePage({ 'msg' : 'Empty Field', 'timer' : false, 'run' : true, 'confirm' : true })
                return false
            }
            let next = 0
            if($('#part-qualify'))
                next = Number(document.querySelectorAll('#part-qualify').length)

            $('#add-qualification').append(
            `<div id = 'part-qualify' loop = '${ next }' style = 'margin:1%;border:1px solid #ccc;border-radius:5px;width:20%;height:10%;'>
                <p id = 'close-part' loop = '${ next }' style = 'text-align:left;'><i class='fas fa-close'></i></p>
                <h4>${ q }</h4>
            </div>
            `)
            $('#ad_must').val('')
        }
        export const candidate_approve = async(e) => {
            let approve = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'approve' : true, 'id' : e.currentTarget.attributes[1].value }, 'data' : 'json' })
            if(approve){
                ServerData.pausePage({ 'msg' : 'Success!', 'timer' : false, 'run' : true, 'confirm' : true })
                retrieveContent(3,2,11)
            }
        }
        export const candidate_remove = async(e) => {
            let remove = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'remove' : true, 'id' : e.currentTarget.attributes[1].value }, 'data' : 'json' })
            if(remove){
                ServerData.pausePage({ 'msg' : 'Success!', 'timer' : false, 'run' : true, 'confirm' : true })
                retrieveContent(3,2,11)
            }
        }
        export const delete_application = async(e) => {
            let delete_app = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'delete_jobs' : true, 'id' : e.currentTarget.attributes[1].value }, 'data' : 'json' })
            if(delete_app.command){
                ServerData.pausePage({ 'msg' : 'Successfully Destroyed!', 'timer' : false, 'run' : true, 'confirm' : true })
                jobsContent([5])
            }
        }
        export const delete_jobs = async(e) => {
            const id = e.currentTarget.attributes[1].value

            let jobs = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://localhost/jobs/back-end/php/index.php', 'header' : true, 'body' : { 'destroy_jobs' : true, 'id' : id }, 'data' : 'json' })
            let msg = `Deletion Error`
            if(jobs){
                msg = `Ad Destroyed Successfully`
                retrieveContent(3,2,11)
            }
            ServerData.pausePage({ 'msg' : msg, 'timer' : true, 'run' : true, 'confirm' : false })
        }
        export const record_add = async(e) => {
            const sickness = $('#sickness').val();
            const symptoms = $('#symptoms').val();
            const medicine = $('#medicine').val();
            const treatment = $('#treatment').val();
            const doctor_record = $('#doctor-record').val().split(',')[1];
            const doctor_count = $('#doctor-record').val().split(',')[0];
            const sickness_record = $('#jobs-record').val().split(',')[1];
            const jobs_count = $('#jobs-record').val().split(',')[0];


            if(!sickness || !symptoms || !medicine || !treatment || !doctor_record || !sickness_record){
                let m = ``
                if(!sickness)
                    m += `Please Input sickness<br>`
                if(!symptoms)
                    m += `Please Input symptoms<br>`
                if(!medicine)
                    m += `Please Input medicine<br>`
                if(!treatment)
                    m += `Please Input treatment<br>`
                if(!doctor_record)
                    m += `Please select a doctor<br>`
                if(!sickness_record)
                    m += `Please select jobs<br>`
                ServerData.pausePage({ 'msg' : m, 'timer' : false, 'run' : true, 'confirm' : true })
            }else{
                const img = document.getElementById('record-file').files[0]
                const frmD = new FormData();
                frmD.append('create-record',true)
                frmD.append('sickness',sickness)
                frmD.append('symptoms',symptoms)
                frmD.append('medicine',medicine)
                frmD.append('treatment',treatment)
                frmD.append('doctor_record',doctor_record)
                frmD.append('sickness_record',sickness_record)
                frmD.append('count',jobs_count)
                frmD.append('doctor',doctor_count)
                let jobs = await ServerData.bindAuth({ 'method' : 'POST', 'link' : `http://localhost/jobs/back-end/php/index.php`, 'header' : false, 'body' : frmD, 'data' : 'json', 'way' : true })
                if(jobs)
                    retrieveContent(1,7,7)
            }
        }
        export const go_away = async(e) => {
            let out = await ServerData.bindAuth({ 'method' : 'POST', 'link' : `http://localhost/jobs/back-end/php/index.php`, 'header' : false, 'body' : { 'out' : true }, 'data' : 'json'})
            if(out.command){
                ServerData.pausePage({ 'msg' : 'Signed Out', 'run' : true, 'timer' : 'slow', 'confirm' : false })
                window.location.assign('http://192.168.0.22:7000')
            }
        }
        export const delete_account = async(e) => {
            let destroy = await ServerData.bindAuth({ 'method' : 'POST', 'link' : `http://localhost/jobs/back-end/php/index.php`, 'header' : false, 'body' : { 'destroy' : true, 'table' : e }, 'data' : 'json'})
            if(destroy.command){
                ServerData.pausePage({ 'msg' : 'Account Destroyed!', 'run' : true, 'timer' : 'slow', 'confirm' : false })
                window.location.assign('index.html')
            }
        }

        export const createEmployer = async(e) => {
            const institution = $('#Get_lname').val();
            const telephone = $('#Get_telephone').val();
            const email = $('#Get_email').val();
            const password = $('#Get_password').val();
            const r_password = $('#Get_r_password').val();

            if(!institution || !telephone || !email || !password || (password !== r_password)){
                if(!institution) $('#Get_lname').css('borderBottom','2px solid red');
                if(!password) $('#Get_password').css('borderBottom','2px solid red');
                if(!telephone) $('#Get_telephone').css('borderBottom','2px solid red');
                if(!email) $('#Get_email').css('borderBottom','2px solid red');
                if(password !== r_password) $('#Get_r_password').css('borderBottom','2px solid red');
            }else{
                let create = await ServerData.bindAuth({'method' : 'POST', 'link' : `http://localhost/jobs/back-end/php/index.php`, 'header' : true, 'body' : { 'create_employer' : true, 'institution' : institution, 'password' : password, 'email' : email, 'telephone' : telephone }, 'data' : 'json' })

                if(create){
                    ServerData.pausePage({ 'msg' : create.feedback, 'run' : true, 'timer' : false, 'confirm' : true })
                    if(create.success)
                        setTimeout(
                            function(){
                                window.location.assign('#Account')
                                const container = document.getElementById('container');
                                container.classList.remove("right-panel-active");
                                document.querySelectorAll('#mainDir').forEach( n => {
                                    if(n.attributes[0].value == "#Account")
                                        n.style.color = "rgb(255, 195, 0)";
                                    else
                                        n.style.color = "#000";
                                })
                            },2000
                        )
                }else
                    ServerData.pausePage({ 'msg' : 'Request Timeout. Try again', 'run' : true, 'timer' : 'fast', 'confirm' : false })
            }
        }
        export const createAccount = async(e) => {
            const name = $('#user_name').val();
            const email = $('#user_email').val();
            const password = $('#user_password').val();

            if(!name || !email || !password ){
                if(!email) $('#user_email').css('borderBottom','2px solid red');
                if(!password) $('#user_password').css('borderBottom','2px solid red');
                if(!name) $('#user_name').css('borderBottom','2px solid red');
            }else{
                let create = await ServerData.bindAuth({'method' : 'POST', 'link' : `http://localhost/jobs/back-end/php/index.php`, 'header' : true, 'body' : { 'create' : true, 'name' : name, 'password' : password, 'email' : email }, 'data' : 'json' })

                if(create){
                    $('#feedback').append(create.feedback)
                    if(create.success)
                        setTimeout(
                            function(){
                                const container = document.getElementById('container');
                                container.classList.remove("right-panel-active");
                            },2000
                        )
                }else
                    ServerData.pausePage({ 'msg' : 'Request Timeout. Try again', 'run' : true, 'timer' : 'fast', 'confirm' : false })
            }
        }
        export const ulog = async(e) => {
            const telephone = $('#login_email').val();
            const password = $('#login_password').val();
            if(!password || !telephone){
                if(!telephone) $('#login_email').css('borderBottom','2px solid red');
                if(!password) $('#login_password').css('borderBottom','2px solid red');
            }else{
                let logIn = await ServerData.bindAuth({ 'method' : 'POST', 'link' : `http://localhost/jobs/back-end/php/index.php`, 'header' : true, 'body' : { 'login' : true, 'email' : telephone, 'password' : password }, 'data' : 'json' })
                if(logIn){
                    ServerData.pausePage({ 'msg' : logIn.feedback, 'run' : true, 'timer' : 'fast', 'confirm' : false })

                    sessionStorage.setItem('user',logIn.admin)
                    if(logIn.identity){
                        setTimeout(
                            function(){
                                window.location.assign('account/index.html')
                            },2000
                        )
                    }
                }
            }
        }

        export const jobsContent = async(no_panel) => { //initial arrow function
            // const filter = [];
            //     filter.push({'cell' : ['address'], 'data' : 'address'})
            //     filter.push({'cell' : ['ward'], 'data' : 'ward'})
            //     filter.push({'cell' : ['county'], 'data' : 'county'})
            //     filter.push({'cell' : ['country'], 'data' : 'country'})

            // let test = await ServerData.bindAuth({ 'method' : 'POST', 'link' : 'http://192.168.42.73/jobs/php/test.php', 'header' : true, 'body' : { 'test' : filter }, 'data' : 'json' })

            let login = await ServerData.bindAuth({ 'method' : 'POST', 'link' : `http://localhost/jobs/back-end/php/index.php`, 'header' : true, 'body' : { 'user' : true }, 'data' : 'json' })
            if(login){
                let string = await ServerData.bindAuth({ 'method' : 'GET', 'link' : `http://localhost/jobs/back-end/php/string.php`, 'header' : true, 'data' : 'json', 'load' : true })
                if(string){
                    ServerData.bind_string = string
                    //Build : main bar
                    if(no_panel.includes(3))
                        $('#main-bar').html(string.build.bar)

                    //Build : Home Page
                    if(no_panel.includes(1)){
                        $('#Home').html(string.build.home)
                        ServerData.home = (ServerData.home) ? Number(ServerData.home) : 0 ;
                        setInterval(
                            function(){
                                $('#wall' + ServerData.home).fadeOut('slow');
                                if(ServerData.home == 3)
                                    ServerData.home = 1;
                                else
                                    ServerData.home++
                                $('#wall' + ServerData.home).fadeIn('slow');
                            },4000
                        );
                        document.getElementById('Home').addEventListener('scroll', function(e){
                            var nav = $(".welcome-header");
                            if($(this).scrollTop() > nav.height()){
                                $('#main-bar').css('background','rgba(0,0,0,0.7)')
                                $('.Navigation').css('background','rgba(0,0,0,0.7)')
                                $('.Navigation a').css('borderLeft','1px solid #fff')
                                document.querySelectorAll('.bin').forEach( i => {
                                    i.style.color = '#fff';
                                })
                            }else{
                                $('#main-bar').css('background','transparent')
                                $('.Navigation').css('background','transparent')
                                $('.Navigation a').css('borderLeft','1px solid #000')
                                document.querySelectorAll('.bin').forEach( i => {
                                    i.style.color = '#000';
                                })
                            }
                        });

                        (function($, window, document, undefined) {

                            $.fn.slider = function() {
                                return this.each(function(options) {

                                    var that = $(this);

                                    var defaults = {
                                        start_timeout: 1500,
                                        slide_animation : 3000,
                                        speed_of_effects : 1.3,
                                        delay_of_effects : 0.2
                                    };

                                    var options = $.extend(defaults, options);

                                    var obj = {
                                        slides : $(that).find('li'),
                                        start : false,
                                        clips_number : 8,
                                        first_slide : function() {
                                            return this.slides.eq(0);
                                        },
                                        start_clip_slide : function() {
                                            return this.slides.eq(1);
                                        },
                                        loop : function loop(next_slide) {

                                                for (var i = 0; i < obj.clips_number; i++) {

                                                    if(obj.start == false) {
                                                        obj.start_clip_slide().css({
                                                            'zIndex': 1,
                                                            'display': 'block'
                                                        });
                                                    }

                                                    var canvas_element = $('<canvas>').attr({
                                                        id: 'canvasID_' + ( i + 1 ),
                                                        class: 'canvasClass'
                                                    }).attr({
                                                        width: 100,
                                                        height: 500
                                                    }).css('left', 100 * i);

                                                    if(obj.start == false) {
                                                        canvas_element.appendTo(obj.start_clip_slide());
                                                    } else {
                                                        canvas_element.appendTo(next_slide);
                                                    }

                                                    var canvas = $('#canvasID_' + (i + 1))[0];

                                                    var ctx = canvas.getContext('2d');
                                                    ctx.mozImageSmoothingEnabled = false;
                                                    ctx.webkitImageSmoothingEnabled = false;
                                                    ctx.msImageSmoothingEnabled = false;
                                                    ctx.imageSmoothingEnabled = false;

                                                    var img = document.createElement('img');
                                                    var img_src = obj.start_clip_slide().find('img').attr('src');
                                                    if(obj.start)
                                                        img_src = next_slide.find('img').attr('src');


                                                    img.src = img_src;

                                                    ctx.drawImage(img, 100 * i, 0, 100, 500, 0, 0, 100, 500);

                                                }

                                        },
                                        animation :  function animation() {

                                            if(obj.start == false) {
                                                obj.loop();
                                            }
                                            obj.start = true;

                                            var tl = new TimelineMax();

                                            tl.add( TweenMax.set('.canvasClass', {top: -500}) );
                                            tl.add( TweenMax.staggerTo(".canvasClass", options.speed_of_effects, {top: 0}, options.delay_of_effects, myCompleteAll ) );

                                            function myCompleteAll() {
                                                setTimeout(obj.all_done, options.slide_animation);
                                            }

                                        },
                                        change_slide : function change_slide(next_slide) {

                                            $('canvas').remove();

                                            var next_slide = next_slide;

                                            obj.loop(next_slide);

                                            obj.animation();

                                        },
                                        all_done : function all_done() {

                                            obj.slides.css({
                                                'zIndex': 1,
                                                'display': 'block'
                                            });

                                            var current_slide = $(that).find('li.active');

                                            if (current_slide.length == 0) {
                                                current_slide = obj.start_clip_slide();
                                            }

                                            current_slide.css({
                                                'zIndex': 2,
                                                'display': 'block'
                                            }).find('img').css('visibility','visible');

                                            var next_slide = current_slide.next();

                                            if (next_slide.length == 0) {

                                                current_slide.css({
                                                    'zIndex': 2,
                                                    'display': 'block'
                                                }).find('img').css('visibility','visible');

                                                next_slide = obj.first_slide();
                                            }

                                            obj.slides.removeClass('active');
                                            next_slide.addClass('active');

                                            next_slide.css({
                                                'zIndex': 3,
                                                'display': 'block'
                                            }).find('img').css('visibility','hidden');

                                            obj.change_slide(next_slide);

                                        },
                                        init : function () {

                                            obj.first_slide().css({
                                                'zIndex': 1,
                                                'display': 'block'
                                            }).find('img').css('visibility','visible');

                                            obj.start_clip_slide().find('img').css('visibility','hidden');

                                            setTimeout(obj.animation, defaults.start_timeout);
                                        }
                                    };

                                    obj.init();

                                });

                            };

                            $(document).ready(function() {
                                $('#banner').slider();
                            });

                        })(jQuery, window, document);

                    }
                    //build : login
                    if(no_panel.includes(2)){
                        $('#Account').html(string.build.account)
                        $('#Get_age').datepicker({
                            dateFormat : 'yy-mm-dd',
                            showAnim: 'slideDown',
                           changeMonth: true,
                           changeYear: true
                        });

                    }

                    if(no_panel.includes(4)){
                        $('#Jobs').html(string.build.job)
                    }
                    if(no_panel.includes(5)){
                        if(login.user){
                            if(sessionStorage.getItem('user') == "true"){
                                $('#build').html(string.build.admin.body)
                                retrieveContent(2,0,0)
                            }
                            if(sessionStorage.getItem('user') == "false"){
                                $('#build').html(string.build.user.body)
                                retrieveContent(1,0,0)
                            }
                            if(sessionStorage.getItem('user') == 0){
                                $('#build').html(string.build.employer.body)
                                retrieveContent(3,0,0)
                            }
                            document.getElementById('title').innerHTML = login.details.name
                        }else
                            window.location.assign('index.html')
                    }
                }else
                    ServerData.pausePage({ 'msg' : 'Request Timeout. Try Again', 'run' : true, 'timer' : 'fast', 'confirm' : false })
            }else
                ServerData.pausePage({ 'msg' : 'Request Timeout. Try Again', 'run' : true, 'timer' : 'fast', 'confirm' : false })
        }

