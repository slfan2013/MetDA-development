console.log("missing_value_imputation.js")

var defination_of_missing_value_onchange = function () {
    selected_values = $("#defination_of_missing_value").val()

    if (selected_values.includes("values less than ...")) {
        $("#defination_of_missing_value_values_less_than_form_group").show()
    } else {
        $("#defination_of_missing_value_values_less_than_form_group").hide()
    }
    if (selected_values.includes("other")) {
        $("#defination_of_missing_other_than_form_group").show()
    } else {
        $("#defination_of_missing_other_than_form_group").hide()
    }


}

missing_value_imputation_append_results = function (obj, session) {
    $("#results_description").html(obj.results_description)

    Papa.parse(session.loc + "files/summary_data.csv", {
        download: true,
        header: false,
        complete: function (results) {
            data = results.data
            $('#results_dataset_table').DataTable({
                data: data.slice(1, data.length - 1),
                columns: data[0].map(function (x) { return ({ title: x }) })
            });
        }
    });

    var files_sources = [session.loc + "files/result_dataset.csv", session.loc + "files/summary_data.csv"];
    var files_names = ["missing_value_imputation_result_dataset.csv","missing_value_imputation_result_summary.csv"]
    var zipfile_name = "missing_value_imputation_results"
    $("#download_results").click(function(){
        download_results(files_names,files_sources,zipfile_name)
    })
    var fold_name = "Missing Value Imputation"
    var files_names = ["result dataset.csv","result summary.csv"]
    var files_types = ["application/vnd.ms-excel","application/vnd.ms-excel"]
    $("#save_results").click(function(){// open a dialog and ask where to save.
        save_results(files_names,files_sources,files_types,fold_name,JSON.parse(localStorage.getItem('parameter')),[1])
    })

}