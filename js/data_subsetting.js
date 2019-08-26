console.log("data_subsetting.js")





data_subsetting_append_results = function (obj, session) {
    $("#results_description").html(obj.results_description)

    Papa.parse(session.loc + "files/e.csv", {
        download: true,
        header: false,
        complete: function (results) {
            data = results.data
            $('#results_dataset_table').DataTable({
                data: data.slice(1, data.length - 1),
                columns: data[0].map(function (x) { return ({ title: x }) })
            });



            var files_sources = [session.loc + "files/e.csv"];
            var files_names = ["e.csv"]
            var zipfile_name = "e.csv"
            var fold_name = "Data Subset"
            var files_types = ["application/vnd.ms-excel"]

            var parameters = JSON.parse(localStorage.getItem('parameter'))
            parameters.num_compound_left = data.length-1
            parameters.num_sample_left = data[0].length-1

            $("#download_results").off("click").on("click",function () {
        
                //files_sources.push(obj.report_base64[0])
                //files_names.push("report_data_subsetting.docx")\
                save_results(files_names, files_sources, files_types, fold_name, parameters, [1],['none'])
            })
           
            $("#save_results").off("click").on("click",function () {// open a dialog and ask where to save.
                save_results(files_names, files_sources, files_types, fold_name, parameters, [1],['none'])
            })




        }
    });



}
