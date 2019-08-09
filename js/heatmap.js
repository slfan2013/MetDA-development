console.log("heatmap.js")
color_pallete = [["rgb(228, 59, 45)", "rgb(55, 126, 183)", "rgb(77, 175, 74)"],
["rgb(152, 78, 163)", "rgb(242, 126, 51)", "rgb(254, 248, 64)"],
["rgb(166, 86, 41)", "rgb(241, 128, 191)", "rgb(153, 153, 153)"],
["rgb(0,0,0)", "rgb(255,255,255)"]]



plot_url = {}



heatmap_append_results = function (obj, session) {
    $("#results_description").html(obj.results_description)

    // for downloads.
    files_sources = [session.loc + "files/sample_order.csv", session.loc + "files/compound_order.csv",plot_url.heatmap_plot];
    files_names = ['sample_order.csv','compound_order.csv','heatmap_plot.svg']
    zipfile_name = "heatmap_results.zip"
    fold_name = "Heatmap"
    files_types = ["application/vnd.ms-excel", "application/vnd.ms-excel","image/svg+xml"]

    $("#download_results").off("click").on("click", function () {
        parameters = JSON.parse(localStorage.getItem('parameter'))
        parameters.heatmap_plot = heatmap_plot_parameters
        //download_results(files_names, files_sources, zipfile_name)
        save_results(files_names, files_sources, files_types, fold_name, parameters, [0])
    })


    $("#save_results").off("click").on("click", function () {// open a dialog and ask where to save.
        parameters = JSON.parse(localStorage.getItem('parameter'))
        parameters.heatmap_plot = heatmap_plot_parameters
        save_results(files_names, files_sources, files_types, fold_name, parameters, [0])
    })




}
