console.log("fold_change.js")





fold_change_append_results = function (obj, session) {
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

    var files_sources = [session.loc + "files/summary_data.csv"];
    var files_names = ["fold_change_result.csv"]
    var zipfile_name = "fold_change_result"
    $("#download_results").off("click").on("click",function () {
        download_results(files_names, files_sources, zipfile_name)
    })
    var fold_name = "Fold Change"
    var files_names = ["fold_change_result.csv"]
    var files_types = ["application/vnd.ms-excel"]
    $("#save_results").off("click").on("click",function () {// open a dialog and ask where to save.
        save_results(files_names, files_sources, files_types, fold_name, JSON.parse(localStorage.getItem('parameter')), [1])
    })

}
