console.log("one_click.js")


$("#upload_a_file").click(function () {
    $("#inputFile").off("change").on("change", function () {
        $(".inputFileHidden").prop("disabled", true);
        $(".inputFile_validating").text("Validating")
        ocpu.call("inputFile", {
            path: $("#inputFile")[0].files[0]
        }, function (session) {
            session.getObject(function (obj) {
                oo = obj
                p = oo.p
                f = oo.f
                project_id = obj.project_id[0]
                $(".inputFileHidden").prop("disabled", false);
                var text = "<p class='text-warning'>" + obj.message.warning_message.join("</p><p class='text-warning'>") + "</p>"
                text = text + "<p class='text-success'>" + obj.message.success_message.join("</p><p class='text-success'>") + "</p>"

                $("#inputFile_success").html("<p><b>" + $("#inputFile")[0].files[0].name + " is validated.</b></p>")
                $(".inputFile_validating").html(text)
            })
        }).fail(function (e) {
            Swal.fire('Oops...', e.responseText, 'error')
            $(".inputFileHidden").prop("disabled", false);
            $(".inputFile_validating").text("Dataset file format is incorrect.")
        })
    })
    document.getElementById('inputFile').click();
})




when_projects_table_clicked = function () {
    $(this).addClass('selected').siblings().removeClass('selected');
    project_id = $(this).find('td:first').html();
    selected_data = "e.csv"
    console.log(project_id)
    /*localStorage['activate_project_id'] = project_id
     localStorage['activate_data_id']='e.csv'*/
    // when the project_id is selected. We need to display the project tree so that the user could select dataset.

    ocpu.call("open_project_structure_to_select_dataset", {
        project_id: project_id,
        selected_data: selected_data
    }, function (session) {
        console.log(session)
        session.getObject(function (obj) {
            ooo = obj
            p = ooo.p
            f = ooo.f
            $("#selected_project_structure").jstree("destroy");
            $("#selected_project_structure").jstree({
                'core': {
                    'data': obj.result_project_structure,
                    'multiple': false, // cannot select multiple nodes.
                    'expand_selected_onload': true,
                    'check_callback': true
                }
            })
            $('#select_from_projects_collapse').collapse("hide")
            $("#data_selected_information").text("The above dataset " + selected_data + " is selected successfully.")


            update_projects_table("projects_table2", when_projects_table_clicked2)
            $("#select_from_projects_collapse2").collapse("show")

            $('#selected_project_structure').on("select_node.jstree", function (e, data) {
                ddd = data
                selected_data = ddd.node.id
                $("#data_selected_information").text("The above dataset " + ddd.node.text[0] + " is selected successfully.")
            })



        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })


    /*localStorage['activate_data_id']='e.csv'
    // here change the p and f.
    ocpu.call("get_p_and_f",{
        project_id:localStorage['activate_project_id']
    },function(session){
        session.getObject(function(obj){
            localStorage['p'] = JSON.stringify(obj.p) 
            localStorage['f'] = JSON.stringify(obj.f) 
            window.location.href = "#project_overview";
        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    }) */
}
update_projects_table()



when_projects_table_clicked2 = function () {
    $(this).addClass('selected').siblings().removeClass('selected');
    project_id2 = $(this).find('td:first').html();
    selected_data2 = "e.csv"
    console.log(project_id2)


    ocpu.call("open_project_structure", {
        project_id: project_id2,
        selected_data: 'e.csv'
    }, function (session) {
        console.log(session)
        session.getObject(function (obj) {
            $("#selected_project_structure2").jstree("destroy");
            $("#selected_project_structure2").jstree({
                'core': {
                    'data': obj,
                    'multiple': false, // cannot select multiple nodes.
                    'expand_selected_onload': true,
                    'check_callback': true
                }
            })
            $("#select_from_projects_collapse2").collapse("hide")
            $("#data_selected_information").text("The above dataset " + selected_data2 + " is selected successfully.")

            update_projects_table("projects_table2")
            $("#projects_table2 tr").click(when_projects_table_clicked2);
            $('#selected_project_structure2').on("select_node.jstree", function (e, data) {
                ddd2 = data
                selected_data2 = ddd2.node.id
                $("#data_selected_information2").text("The above dataset " + ddd2.node.text[0] + " is selected successfully.")
            })
        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })

}


$("#confirm_selected_project").click(function () {

    console.log("The selected data is " + selected_data + " in project " + project_id +
        " and the targeted dataset is " + selected_data2 + " in the project " + project_id2 + ".")



    // 1. Mimic the result stucture.
    ocpu.call("preview_result_structure", {
        project_id: project_id,
        selected_data: selected_data,
        project_id2: project_id2,
        selected_data2: selected_data2
    }, function (session) {
        session.getObject(function (obj) {
            console.log("Good")
            console.log(obj)
            ooo = obj
            $("#preview_result_structure").jstree("destroy");
            $("#preview_result_structure").jstree({
                'core': {
                    'data': obj.result_project_structure,
                    'multiple': false, // cannot select multiple nodes.
                    'expand_selected_onload': true,
                    'check_callback': true
                }
            })
            $("#preview_result_structure_information").html("<p class='text-success'>The above <span class='text-danger'>red text</span> highlighted are to be added to the project.</p>")


            sample_parameters_global_index = 1
            sample_parameters_global_nodes = []
            // now we need to ask the users to specified some parameters. 
            para_index = 0
            sample_para = obj.to_be_specified["sample_info"]
            sample_para_keys = Object.keys(sample_para)
            interval_sample = setInterval(function () {
                if (para_index === sample_para_keys.length) {
                    clearInterval(interval_sample)
                } else {                    
                    $('#parameters_to_be_specified').append(sample_parameters_global_index + '. Select the Sample Info corresponding to <b>' +sample_para_keys[para_index] + '</b> for <span style="color:blue;text-decoration:underline;cursor:pointer" id="sample_parameters_global_span' + sample_parameters_global_index + '">these nodes</span>.' + '<div id="sample_parameters_global_id_' + sample_para_keys[para_index] + '">' + '</div>');

                    div_id = "sample_parameters_global_id_" + sample_para_keys[para_index]
                    id = "sample_parameters_global_id_" + sample_para_keys[para_index]
                    $("#" + div_id).load("sample_information_non_changing_levels_select.html", init_selectpicker)
                    sample_parameters_global_nodes[sample_parameters_global_index] = sample_para[sample_para_keys[para_index]]

                    $("#sample_parameters_global_span" + sample_parameters_global_index).hover(function () {
                        sample_parameters_global_span_hovered = this
                        $('#preview_result_structure a').filter(function () {
                            return sample_parameters_global_nodes[sample_parameters_global_span_hovered.id.replace("sample_parameters_global_span", "")].includes(this.id.replace("_anchor", ""))
                        }).css('background-color', "yellow");
                    }, function () {
                        $('#preview_result_structure a').removeAttr('style')
                    })
                    sample_parameters_global_index++;
                    para_index++
                }
            },20)


            compound_parameters_global_index = 1
            compound_parameters_global_nodes = []
            // now we need to ask the users to specified some parameters. 
            compound_para_index = 0
            compound_para = obj.to_be_specified["compound_info"]
            compound_para_keys = Object.keys(compound_para)
            interval_compound = setInterval(function () {
                if (compound_para_index === compound_para_keys.length) {
                    clearInterval(interval_compound)
                } else {                    
                    $('#parameters_to_be_specified').append(compound_parameters_global_index + '. Select the Compound Info corresponding to <b>' +compound_para_keys[compound_para_index] + '</b> for <span style="color:blue;text-decoration:underline;cursor:pointer" id="compound_parameters_global_span' + compound_parameters_global_index + '">these nodes</span>.' + '<div id="compound_parameters_global_id_' + compound_para_keys[compound_para_index] + '">' + '</div>');

                    div_id = "compound_parameters_global_id_" + compound_para_keys[compound_para_index]
                    id = "compound_parameters_global_id_" + compound_para_keys[compound_para_index]
                    $("#" + div_id).load("compound_information_non_changing_levels_select.html", init_selectpicker)
                    compound_parameters_global_nodes[compound_parameters_global_index] = compound_para[compound_para_keys[compound_para_index]]

                    $("#compound_parameters_global_span" + compound_parameters_global_index).hover(function () {
                        compound_parameters_global_span_hovered = this
                        $('#preview_result_structure a').filter(function () {
                            return compound_parameters_global_nodes[compound_parameters_global_span_hovered.id.replace("compound_parameters_global_span", "")].includes(this.id.replace("_anchor", ""))
                        }).css('background-color', "yellow");
                    }, function () {
                        $('#preview_result_structure a').removeAttr('style')
                    })
                    compound_parameters_global_index++;
                    compound_para_index++
                }
            },1000)



        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })



})

$("#submit").click(function(){
    parameter = {}
    // here perform the statistical analysis pipeline. Now collect all the parameters.
    $(".parameter").each(function () {

        if (this.id !== '') {
            //parameters.push({:$(this).val()})
            if($(this).prop("checked") === undefined){ // this means that it is a select.
                parameter[this.id] = $(this).val()
            }else{ // this means that it is a checkbox
                parameter[this.id] = $(this).prop("checked")
            }
        }
    })
    console.log(parameter)

    ocpu.call("perform_quick_analysis", {
        project_id: project_id,
        selected_data: selected_data,
        project_id2: project_id2,
        selected_data2: selected_data2,
        parameter:parameter
    }, function (session) {
        console.log(session)
        session.getObject(function(obj){
            console.log(obj)
            if(obj){
                console.log("GOOD JOB!")
            }
        })
    }).fail(function (e) {
        Swal.fire('Oops...', e.responseText, 'error')
    })

})