console.log("missing_value_imputation.js")



missing_value_imputation_append_results = function (obj, session) {

    console.log(obj)
    console.log("missing_value_imputation_append_results")
    console.log(session)
    sess = session
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
    var zipfile_name = "missing_value_imputation_results"
    var fold_name = "Missing Value Imputation"
    var files_names = ["result dataset.csv","result summary.csv"]
    var files_types = ["application/vnd.ms-excel","application/vnd.ms-excel"]
    $("#download_results").off("click").on("click",function () {
        
        save_results(files_names, files_sources, files_types, fold_name, JSON.parse(localStorage.getItem('parameter')), [1],['compound','none'])
    })
    $("#save_results").off("click").on("click",function () {// open a dialog and ask where to save.
        save_results(files_names, files_sources, files_types, fold_name, JSON.parse(localStorage.getItem('parameter')), [1],['compound','none'])
    })

}
