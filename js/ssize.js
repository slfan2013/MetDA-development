console.log("ssize.js")

plot_url = {}



ssize_append_results = function (obj, session) {
    $("#results_description").html(obj.results_description[0])

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


    // for downloads.
    files_sources = [plot_url.ssize_plot];
    files_names = ['ssize_plot.svg','power_plot.svg']
    zipfile_name = "post-hoc Sample Size Analysis.zip"
    fold_name = "post-hoc Sample Size Analysis"
    files_types = ["image/svg+xml","image/svg+xml"]


    $("#download_results").off("click").on("click",function () {
        parameters = JSON.parse(localStorage.getItem('parameter'))
        parameters.ssize_plot = ssize_plot_parameters
        parameters.power_plot = power_plot_parameters
        save_results(files_names, files_sources, files_types, fold_name, parameters, [0],['none','none'])
    })
   
    $("#save_results").off("click").on("click",function () {// open a dialog and ask where to save.
        parameters = JSON.parse(localStorage.getItem('parameter'))
        parameters.ssize_plot = ssize_plot_parameters
        parameters.power_plot = power_plot_parameters
        save_results(files_names, files_sources, files_types, fold_name, parameters, [0],['none','none'])
    })

}
