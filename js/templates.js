console.log("!")


if (localStorage['big_category'] === 'project') {
    $(".show_when_project").show()
    $("#templates_icon_text").html("Projects")
    $("#templates_icon").html("library_books")
} else if (localStorage['big_category'] === 'in_and_out') {
    $(".show_when_project").hide()
    $("#templates_icon_text").html("In & Out")
    $("#templates_icon").html("transform")
}


if(window.location.href.split("#")[1]){
    $("#templates_project_overview").html("1")
    $("#templates_other_than_project_overview").html("")
}else{
    $("#templates_other_than_project_overview").html("1")
    $("#templates_project_overview").html("")
}

ocpu.call("templates_contents", {
    id: window.location.href.split("#")[1]
}, function (session) {
    session.getObject(function (obj) {
        ooo = obj
        $("#method_name").text(obj.method_name)
        $("#method_description").html(obj.method_description)
    })
}).fail(function (e) {
    //alert(e.responseText)
    Swal.fire('Oops...', e.responseText, 'error')
})


check_input_format = function (inputFile) {
    $('#parameter_settings_card').hide();
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
            console.log(text)
            $(".inputFile_validating").html(text)
            $('#parameter_settings_card').show();
            // HERE load the missing_value_imputation html. <script src='missing_value_imputation.jb'></script>S
            $("#parameter_settings").load(window.location.href.split("#")[1] + "_parameter_settings.html", init_selectpicker)
            $("#parameter_settings_description").html('loaded')
            loadjscssfile("js/" + window.location.href.split("#")[1] + ".js", 'js')
        })
    }).fail(function (e) {
        //alert(e.responseText)
        Swal.fire('Oops...', e.responseText, 'error')
        $(".inputFileHidden").prop("disabled", false);
        $(".inputFile_validating").text("Dataset file format is incorrect.")
    })
}


Submit = function () {
    $("#submit").text("Calculating...")
    $("#submit").prop('disabled', true);
    $("#results_card").hide();

    parameter = {}

    $(".parameter").each(function () {
        if (this.id !== '') {
            //parameters.push({:$(this).val()})
            parameter[this.id] = $(this).val()
        }
    })
    parameter.project_id = project_id
    parameter.fun_name = window.location.href.split("#")[1]
    var req = ocpu.call("call_fun", { parameter: parameter }, function (session) {
        sss = session
        console.log(session)
        session.getObject(function (obj) {
            ooo = obj
            $("#submit").text("Submit")
            $("#submit").prop('disabled', false);

            $("#results_card").show();
            results_card_body_load(window.location.href.split("#")[1], obj, session)
        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
        $("#submit").text("Submit")
        $("#submit").prop('disabled', false);
    })


}










sidebar_ul = ""


$.getJSON("http://metda:metda@localhost:5985/templates/methods", function (data) {
    ddd = data

    if (window.location.href.split("#")[1] === 'project_overview') {
        sidebar_ul = '<li class="nav-item active"><a class="nav-link" href="#project_overview"><i class="material-icons">dashboard</i><p> Project Overview </p></a></li>'
    } else {
        sidebar_ul = '<li class="nav-item"><a class="nav-link" href="#project_overview"><i class="material-icons">dashboard</i><p> Project Overview </p></a></li>'
    }

    category_names = Object.keys(data.methods_structure)
    headers = Object.keys(data.methods_structure[category_names[0]].missing_value_imputation)
    //active

    for (cat = 0; cat < category_names.length; cat++) {
        current_cat = category_names[cat]

        // check which is active.
        current_items = Object.keys(data.methods_structure[category_names[cat]])
        if (current_items.includes(window.location.href.split("#")[1])) {
            being_active = true
        } else {
            being_active = false
        }

        if (being_active) {
            sidebar_ul = sidebar_ul + '<li class="nav-item active">'
        } else {
            sidebar_ul = sidebar_ul + '<li class="nav-item">'
        }

        sidebar_ul = sidebar_ul +
            '<a class="nav-link" data-toggle="collapse" href="#' + current_cat.replace(' ', '_') + '">' +
            ' <i class="material-icons">'
        if (current_cat === "DATA PROCESSING") {
            sidebar_ul = sidebar_ul + 'donut_large'
        } else if (current_cat === 'MULTIVARIATE ANALYSIS') {
            sidebar_ul = sidebar_ul + 'drag_indicator'
        }
        sidebar_ul = sidebar_ul + '</i>' +
            '<p>' + current_cat + '<b class="caret"></b></p></a>'

        if (being_active) {
            sidebar_ul = sidebar_ul + '<div class="collapse show" id="' + current_cat.replace(' ', '_') + '">'
        } else {
            sidebar_ul = sidebar_ul + '<div class="collapse" id="' + current_cat.replace(' ', '_') + '">'
        }

        sidebar_ul = sidebar_ul +
            '<ul class="nav">'
        current_items = Object.keys(data.methods_structure[category_names[cat]])
        for (var it = 0; it < current_items.length; it++) {

            if (being_active) {
                sidebar_ul = sidebar_ul + '<li class="nav-item active">'
            } else {
                sidebar_ul = sidebar_ul + '<li class="nav-item ">'
            }

            sidebar_ul = sidebar_ul +
                '<a class="nav-link" href="#' + current_items[it] + '">' +
                '<span class="sidebar-mini"> B </span><span class="sidebar-normal"> ' +
                data.methods_structure[category_names[cat]][current_items[it]]['Method Name'] + ' </span>' +
                '</a></li>'
        }
        sidebar_ul = sidebar_ul + '</ul>'

            + '</div>' + '</li>'

        '</a>' + '</li>'

    }

    $("#sidebar_ul").html(sidebar_ul)
})
