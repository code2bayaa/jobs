//Import of functions from other file
"use strict"

/*
 *
 *
    ***** JS FOR ACCOUNT PAGES
 */

import * as build from "./../../js/build.js";

$(document).ready(function(){

    build.jobsContent([5]);

    $(document).on('click','#account-switch', (e) => {
        e.preventDefault();
        let address = e.currentTarget.attributes[1].value;
        let rotate = e.currentTarget.attributes[2].value;
        let panels = document.querySelectorAll('.account-window')
        let walls = document.querySelectorAll('#account-switch')
        let pins = document.querySelectorAll('#pin')

        panels.forEach( w => { //All windows
            if(w.attributes[2]){
                $('#' + w.id).slideUp('slow')
                e.currentTarget.attributes[2].value = 0
            }
        });

        walls.forEach( (w,k) => { //All walls button
            if(w.attributes[2]){
                pins[k].innerHTML = "<i class='fas fa-folder'></i>";
                w.style.background = 'transparent'
                w.style.textDecoration = "none"
                w.style.color = '#fff'
            }
        });

        if(Number(rotate) == 0){
            panels[address].style.background = 'transparent'
            $('#' + panels[address].id).slideDown('slow')
            e.currentTarget.attributes[2].value = 1
            e.currentTarget.style.textDecoration = "underline"
            pins[address].innerHTML = "<i class='fas fa-folder-open'></i>";
        }else{
            $('#' + panels[address].id).slideUp('slow')
            panels[address].style.background = 'transparent'
            pins[address].innerHTML = "<i class='fas fa-folder'></i>";
             e.currentTarget.attributes[2].value = 0
             e.currentTarget.style.background = 'transparent'
             e.currentTarget.style.textDecoration = "none"
        }
    });
    $(document).on('keyup','.profile_edit', (e) => {
        build.editProfile(e,false,'.profile_edit',1)
    })
    $(document).on('change','.profile_edit', (e) => {
        build.editProfile(e,false,'.profile_edit',1)
    })
    $(document).on('keydown','.profile_edit', (e) => {
        build.editProfile(e,true,'.profile_edit',1)
    })
    $(document).on('keyup','.profile_edit_employer', (e) => {
        build.editProfile(e,false,'.profile_edit_employer',2)
    })
    $(document).on('keydown','.profile_edit_employer', (e) => {
        build.editProfile(e,true,'.profile_edit_employer',2)
    })
    $(document).on('click','#jobs',(e) => {
        e.preventDefault();
        build.retrieveContent(e.currentTarget.attributes[2].value,e.currentTarget.attributes[1].value,e.currentTarget.attributes[3].value);
    })
    $(document).on('click','#delete',(e) => {
        e.preventDefault();
        build.delete_account('users');
    })
    $(document).on('click','#delete_employer',(e) => {
        e.preventDefault();
        build.delete_account('employer');
    })
    $(document).on('click','#apply_job',(e) => {
        e.preventDefault();
        build.apply_jobs(e);
    })
    $(document).on('click','#put-qualification',(e) => {
        e.preventDefault();
        build.qualify();
    })
    $(document).on('click','#create-ad',(e) => {
        e.preventDefault();
        build.create_ad();
    })
    $(document).on('click','#close-part',(e) => {
        e.preventDefault();
        build.close_qualify(e);
    })
    $(document).on('click','#select-candidate',(e) => {
        e.preventDefault();
        build.candidate_approve(e);
    })
    $(document).on('click','#remove-candidate',(e) => {
        e.preventDefault();
        build.candidate_remove(e);
    })
    $(document).on('click','#delete_application',(e) => {
        e.preventDefault();
        build.delete_application(e);
    })
    $(document).on('click','#delete-jobs',(e) => {
        e.preventDefault();
        build.delete_jobs(e);
    })
    $(document).on('click','#delete-doctor',(e) => {
        e.preventDefault();
        build.delete_doctor(e);
    })
    $(document).on('click','#search_users',(e) => {
        e.preventDefault();
        build.search_users(e);
    })
    $(document).on('click','#search_employers',(e) => {
        e.preventDefault();
        build.search_employers(e);
    })
    $(document).on('click','#search_jobs',(e) => {
        e.preventDefault();
        build.search_jobs(e);
    })
    $(document).on('click','#search_doctor',(e) => {
        e.preventDefault();
        build.search_doctor(e);
    })
    $(document).on('click','#search_records',(e) => {
        e.preventDefault();
        build.search_records(e);
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
    $(document).on('click','#profile-documents', (e) => {
        e.preventDefault(e);
        $('#actual_documents').click();
    });
    $(document).on('change','#actual_documents', () => {
        build.attach();
    })
    $(document).on('click','#sign-out', (e) => {
        e.preventDefault();
        build.go_away();
    })
    $(document).on('click','#profile-education', (e) => {
        e.preventDefault();
        build.education();
    })
    $(document).on('click','#profile-referees', (e) => {
        e.preventDefault();
        build.referees();
    })
    $(document).on('click','#profile-work', (e) => {
        e.preventDefault();
        build.work();
    })
    $(document).on('click','#profile-view', (e) => {
        e.preventDefault()
        const tag = e.currentTarget.attributes[1].value
        const point = e.currentTarget.attributes[2].value

        console.log('tag ' + tag)
        if(point === '0'){
            console.log('here')
            $('#get_' + tag).slideDown('slow')
            e.currentTarget.innerHTML = 'Close'

            document.querySelectorAll('[point = "' + 1 + '"]').forEach( s => {
                $('#get_' + s.attributes[1].value).slideUp('fast')
                s.attributes[2].value = 0
                s.innerHTML = 'View'
            })
            e.currentTarget.attributes[2].value = 1
//            $('.appearWall').each(function(){
//                if($(this).attr('tag') === tag){
//                    $(this).slideDown('slow')
//                    $(this).attr('point',1)
//                }else{
//                    $(this).slideUp('slow')
//                    $(this).attr('point',0)
//                }
//            })
        }else{
            console.log('not here')
            $('#get_' + tag).slideUp('fast')
            e.currentTarget.attributes[2].value = 0
            e.currentTarget.innerHTML = 'View'
        }
    })
    $(document).on('click','#jobsAdded', (e) => {
        e.preventDefault();
        build.jobs_add();
    })
    $(document).on('click','#doctorAdded', (e) => {
        e.preventDefault();
        build.doctor_add();
    })
    $(document).on('click','#recordAdded', (e) => {
        e.preventDefault();
        build.record_add();
    })
    $(document).on('click','#nowGo', (e) => {
        $('#pauseWindow').remove();
    })
    $(document).on('click','#apply', (e) => {
        e.preventDefault();
        build.apply_package(e);
    })
    $(document).on('click','.inputAccount', function(e){
        e.preventDefault()
        console.log(e.currentTarget.id)
        const index = [...document.querySelectorAll('.inputAccount')].findIndex( index => index.id === e.currentTarget.id)
        console.log('index ' + index)
        document.querySelectorAll('#feedback')[index].innerHTML = ''
    })
});