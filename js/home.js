console.log("home.js")

$("#create_new_project").click(function () {

    // open a modal with Wizard. Check if Dataset is Correct Format.

})


create_new_project_check_input_format = function (inputFile) {
    $(".inputFileHidden").prop("disabled", true);
    $(".inputFile_validating").text("Validating")
    ocpu.call("inputFile", {
        path: $("#" + inputFile)[0].files[0]
    }, function (session) {
        session.getObject(function (obj) {
            oo = obj
            project_id = obj.project_id[0]
            $(".inputFileHidden").prop("disabled", false);
            var text = "<p class='text-warning'>" + obj.message.warning_message.join("</p><p class='text-warning'>") + "</p>"
            text = text + "<p class='text-success'>" + obj.message.success_message.join("</p><p class='text-success'>") + "</p>"
            $(".inputFile_validating").html(text)
            localStorage['temp_project_id'] = oo.project_id[0]
            localStorage['activate_data_id'] = 'e.csv'
        })
    }).fail(function (e) {
        //alert(e.responseText)
        Swal.fire('Oops...', e.responseText, 'error')
        $(".inputFileHidden").prop("disabled", false);
        $(".inputFile_validating").text("Dataset file format is incorrect.")
    })
}



$.getJSON("https://metda.fiehnlab.ucdavis.edu/db/templates/methods", function (data) {
    //ddd = data
    category_names = Object.keys(data.methods_structure)
    headers = Object.keys(data.methods_structure[category_names[0]].data_subsetting)

    method_tab_panes = ""
    for (var cat = 0; cat < category_names.length; cat++) {
        console.log(cat)
        if (cat === 0) {
            method_tab_panes = method_tab_panes + '<div class="tab-pane active" id="'
        } else {
            method_tab_panes = method_tab_panes + '<div class="tab-pane" id="'
        }
        method_tab_panes = method_tab_panes +
            category_names[cat].toLowerCase().replace(" ", "_") +
            '_link">' + '<div class="table-responsive">' +
            '<table class="table">' +
            '<thead><tr>' //+
        var this_category = data.methods_structure[category_names[cat]]
        for (var th = -1; th < headers.length; th++) {
            if (th === -1) {
                method_tab_panes = method_tab_panes + '<th class="text-center">#</th>'
            } else {
                method_tab_panes = method_tab_panes + '<th>' + headers[th] + '</th>'
            }
        }
        method_tab_panes = method_tab_panes +
            '</tr></thead>' //+
        method_tab_panes = method_tab_panes + "<tbody>" //+

        var methods_in_this_category = Object.keys(this_category)

        for (var tr = 0; tr < methods_in_this_category.length; tr++) {
            method_tab_panes = method_tab_panes + "<tr>"
            var current_row_value = Object.values(this_category[methods_in_this_category[tr]])
            for (var td = -1; td < current_row_value.length; td++) {
                if (td === -1) {
                    method_tab_panes = method_tab_panes + "<td>" + (td + 2) + "</td>"
                } else if (td === 0) {
                    method_tab_panes = method_tab_panes + "<td><a href='#" + methods_in_this_category[tr].toLowerCase().replace(" ", "_") + "'>" + current_row_value[td] + "</a></td>"
                } else {
                    method_tab_panes = method_tab_panes + "<td>" + current_row_value[td] + "</td>"
                }

            }
            method_tab_panes = method_tab_panes + "</tr>"
        }
        method_tab_panes = method_tab_panes + "</tbody>" +
            '</table>' +
            '</div>' + '</div>'
    }
    //method_tab_panes = method_tab_panes 
    $("#method_tab_panes").html(method_tab_panes)
    method_nav_items = ""
    for (var li = 0; li < category_names.length; li++) {

        method_nav_items = method_nav_items +
            '<li class="nav-item">'
        if (li === 0) {
            method_nav_items = method_nav_items +
                '<a class="nav-link active" data-toggle="tab" href="#' + category_names[li].toLowerCase().replace(" ", "_") + '_link" role="tablist">'
        } else {
            method_nav_items = method_nav_items +
                '<a class="nav-link" data-toggle="tab" href="#' + category_names[li].toLowerCase().replace(" ", "_") + '_link" role="tablist">'
        }
        method_nav_items = method_nav_items + category_names[li] + "</a>" + "</li>"

    }
    $("#method_nav_items").html(method_nav_items)
});




create_project = function () {
    // use R to validate the new project name.

    ocpu.call("call_fun", {
        parameter: {
            user_id: localStorage['user_id'],
            new_name: $("#new_project_name").val(),
            fun_name: "check_new_project_name"
        }
    }, function (session) {
        console.log(session)
        session.getObject(function (obj) {
            ooo = obj
            console.log(obj)
            // if success, then make the temprary project_id a new id and associated new project to this temp.
            if (obj[0] === 'good') {
                ocpu.call("call_fun", {
                    parameter: {
                        user_id: localStorage['user_id'],
                        new_name: $("#new_project_name").val(),
                        temp_project_id: localStorage['temp_project_id'],
                        fun_name: "create_new_project"
                    }
                }, function (session2) {
                    console.log(session2)
                    session2.getObject(function (obj2) {
                        ooo = obj2
                        console.log(obj2)
                        update_projects_table()
                        $('#create_new_project_collapse').collapse('toggle');
                    })
                }).fail(function (e2) {
                    Swal.fire('Oops...', e2.responseText, 'error')
                })

            }
        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })


}

when_projects_table_click_renamed = function (project_id) {
    var new_project_name = prompt("New Project Name:", "input a new project name");
    if(new_project_name == null || new_project_name == ""){
        console.log("rename canceled.")
    }else{
        // check if new name is taken.
        console.log(new_project_name)
        
        if(project_names.includes(new_project_name)){
            alert("The project name "+new_project_name+" has been taken. ")
            when_projects_table_click_renamed(project_id)
        }else{
            // now everything is good. Use R to change project name. 
            ocpu.call('call_fun',{parameter:{
                user_id: localStorage.user_id,
                project_id: project_id,
                new_project_name: new_project_name,
                fun_name:"rename_project"
            }},function(session){
                console.log("rename_project")
                session.getObject(function(obj){
                    console.log(obj)
                    update_projects_table()
                })
            }).fail(function (e) {
                Swal.fire('Oops...', e.responseText, 'error')
            })

        }
        

    }
}

when_projects_table_click_deleted = function (project_id) {
    console.log(project_id)
    var confirm_to_delete = confirm("Are you sure to DELETE?");
    console.log(confirm_to_delete)
    if(confirm_to_delete){
        // now everything is good. Use R to change project name. 
        ocpu.call('call_fun',{parameter:{
            user_id: localStorage.user_id,
            project_id: project_id,
            fun_name:"delete_project"
        }},function(session){
            console.log("delete_project")
            session.getObject(function(obj){
                console.log(obj)
                update_projects_table()
            })
        }).fail(function (e) {
            Swal.fire('Oops...', e.responseText, 'error')
        })
    }
}

when_projects_table_click_selected = function (project_id) {
    // here change the p and f.
    ocpu.call("call_fun", {
        parameter: {
            project_id: project_id,
            fun_name: "get_p_and_f"
        }
    }, function (session) {
        session.getObject(function (obj) {
            ooo = obj
            change_big_category('project')
            //localStorage['p'] = JSON.stringify(obj.p) we have p = ooo.p in template.js
            //localStorage['f'] = JSON.stringify(obj.f)
            localStorage['activate_project_id'] = project_id
            localStorage['activate_data_id'] = 'e.csv'
            window.location.href = "#project_overview";
        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })
}
update_projects_table()

localStorage['big_category'] = 'project'
change_big_category = function (category) {
    localStorage['big_category'] = category
}

go_to_one_click = function () {
    change_big_category("one_click")
    window.location.href = "#one_click";
}

