//Import of functions from other file
import * as build from "./build.js"
//When the page loads

//indexJS calls events

$(document).ready(function(){
    //One
    /*
        ES6 JS-- imports, destructuring, arrow functions, import/export

    **
    */
    ['Home','Jobs','Account','main-bar'].map( d => {
        let g = document.createElement("div");
        g.setAttribute("id", d);
        let c = 'holder';
        if(d == 'main-bar')//If main-bar add class slide
            c = 'slide';
        g.setAttribute("class", c);
        document.getElementById('build').appendChild(g);
    })
    /*
        -main-bar --fixed // navbar
        @pages : 
        - Home
        - Jobs
        - Account
    */

        console.log('Hey Index..')

    build.jobsContent([1,2,3,4]) //Fires initially

    $(document).on('click','#login_account', (e) => {
        e.preventDefault();
        build.ulog(e);
    })

    $(document).on('click','#document', (e) => {
        e.preventDefault(e);
        $('#pro-file').click();
    });
    $(document).on('change','#pro-file', () => {
        $('#document').html('Uploaded!');
    })
    $(document).on('click','#make-switch', function(e){
        e.preventDefault();
        const user = e.currentTarget.attributes[1].value
        build.ServerData.user_type = user;
        document.querySelectorAll('#make-switch').forEach( (p) => {
            p.style.background = "#fff";
            p.style.color = "#000";
        })

        this.style.background = "#000";
        this.style.color = "#fff";

        if( user == 'doctor'){
            $('.jobs_register').css('display','block');
            $('.jobs_doctor').css('display','block');
            $('.jobs_doctor').slideDown('slow');
            $('.jobs_register').slideDown('slow');
        }else{
            $('.jobs_register').slideUp('slow');
            $('.jobs_doctor').slideUp('slow');
            $('.jobs_register').css('display','none');
            $('.jobs_doctor').css('display','none');
        }
    })
    $(document).on('click','#create_account', (e) => {
        e.preventDefault(e);
        build.createAccount();
    });
    $(document).on('click','#mainDir', function(){
        if(this.attributes[0].value == "#Account"){
            document.querySelectorAll('#mainDir').forEach( n => {
                n.style.color = "#000";
            })
        }else{
            document.querySelectorAll('#mainDir').forEach( n => {
                n.style.color = "#fff";
            })
        }
         $(this).css('color','#FFC300');
    });
    $(document).on('click','#push', (e) =>{
        const side = Number(e.currentTarget.attributes[2].value);
        let next = (build.ServerData.home) ? Number(build.ServerData.home) : 1 ;

        if(side == 2){
            if(next < 3){
                $('#wall' + next).fadeOut('fast');
                next = (next + 1)
                $('#wall' + next).fadeIn('fast');
                build.ServerData.home = next;
            }
        }else{
            if(next > 1){
                $('#wall' + next).fadeOut('fast');
                next = (next - 1)
                $('#wall' + next).fadeIn('fast');
                build.ServerData.home = next;
            }
        }
    })
    $(document).on('click','.input',function(e){
        e.preventDefault();
        $(this).css('border-bottom','1px solid #ccc')
    })
    $(document).on('keyup','.input',function(e){
        e.preventDefault();
        const index = e.currentTarget.attributes[1].value
        if(e.currentTarget.value)
            $(index).slideDown('slow')
        else
            $(index).slideUp('slow')
    })
    $(document).on('click','#nowGo', (e) => {
        $('#pauseWindow').remove();
    })
    $(document).on('click','#NextForm', (e) => {
        e.preventDefault(e);
        build.createEmployer();
    })
    $(document).on('click','#signUp', (e) => {
        const container = document.getElementById('container');
    	container.classList.add("right-panel-active");
    })
    $(document).on('click','#signIn', (e) => {
        const container = document.getElementById('container');
    	container.classList.remove("right-panel-active");
    })



});


