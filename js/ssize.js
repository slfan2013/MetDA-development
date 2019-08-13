console.log("ssize.js")





ssize_append_results = function (obj, session) {
    $("#results_description").html(obj.results_description)

    Papa.parse(session.loc + "files/ssize.csv", {
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

    var files_sources = [session.loc + "files/ssize.csv"];
    var files_names = ["ssize.csv"]
    var zipfile_name = "ssize.csv"
    var fold_name = "Student t-test"
    var files_types = ["application/vnd.ms-excel"]
    $("#download_results").off("click").on("click",function () {

        //files_sources.push(obj.report_base64[0])
        //files_names.push("report_ssize.docx")

        save_results(files_names, files_sources, files_types, fold_name, JSON.parse(localStorage.getItem('parameter')), [0])
    })
   
    $("#save_results").off("click").on("click",function () {// open a dialog and ask where to save.
        save_results(files_names, files_sources, files_types, fold_name, JSON.parse(localStorage.getItem('parameter')), [0])
    })

}
