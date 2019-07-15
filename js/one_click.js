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
    ocpu.call("preview_result_structure",{
        project_id:project_id,
        selected_data:selected_data,
        project_id2:project_id2,
        selected_data2:selected_data2
    },function(session){
        session.getObject(function(obj){
            console.log("Good")
            console.log(obj)

            $("#preview_result_structure").jstree("destroy");
            $("#preview_result_structure").jstree({
                'core': {
                    'data': obj,
                    'multiple': false, // cannot select multiple nodes.
                    'expand_selected_onload': true,
                    'check_callback': true
                }
            })
            $("#preview_result_structure_information").text("The above red text highlighted are to be added to the project.")

        })
    })
    
    

})