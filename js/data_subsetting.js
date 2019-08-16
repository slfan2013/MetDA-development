console.log("data_subsetting.js")





data_subsetting_append_results = function (obj, session) {
    $("#results_description").html(obj.results_description)

    Papa.parse(session.loc + "files/data_subsetting.csv", {
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

    var files_sources = [session.loc + "files/data_subsetting.csv"];
    var files_names = ["data_subsetting.csv"]
    var zipfile_name = "data_subsetting.csv"
    var fold_name = "Data Subset"
    var files_types = ["application/vnd.ms-excel"]
    $("#download_results").off("click").on("click",function () {

        //files_sources.push(obj.report_base64[0])
        //files_names.push("report_data_subsetting.docx")\
        save_results(files_names, files_sources, files_types, fold_name, JSON.parse(localStorage.getItem('parameter')), [1],['none'])
    })
   
    $("#save_results").off("click").on("click",function () {// open a dialog and ask where to save.
        save_results(files_names, files_sources, files_types, fold_name, JSON.parse(localStorage.getItem('parameter')), [1],['none'])
    })

}
