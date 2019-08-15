console.log("pca.js")
color_pallete = [["rgb(228, 59, 45)", "rgb(55, 126, 183)", "rgb(77, 175, 74)"],
["rgb(152, 78, 163)", "rgb(242, 126, 51)", "rgb(254, 248, 64)"],
["rgb(166, 86, 41)", "rgb(241, 128, 191)", "rgb(153, 153, 153)"],
["rgb(0,0,0)", "rgb(255,255,255)"]]



plot_url = {}


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

pca_append_results = function (obj, session) {
    $("#results_description").html(obj.results_description)


    // for downloads.
    files_sources = [session.loc + "files/sample_scores.csv", session.loc + "files/compound_loadings.csv", plot_url.score_plot, plot_url.loading_plot, plot_url.scree_plot];
    files_names = ["sample_scores.csv", "compound_loadings.csv", 'score_plot.svg', 'loading_plot.svg', 'scree_plot.svg']
    zipfile_name = "pca_results.zip"
    $("#download_results").off("click").on("click", function () {
        download_results(files_names, files_sources, zipfile_name)
    })


    fold_name = "PCA"
    files_types = ["application/vnd.ms-excel", "application/vnd.ms-excel", "image/svg+xml", "image/svg+xml", "image/svg+xml"]
    $("#save_results").off("click").on("click", function () {// open a dialog and ask where to save.
        parameters = JSON.parse(localStorage.getItem('parameter'))
        parameters.score_plot = score_plot_parameters
        parameters.loading_plot = loading_plot_parameters
        parameters.scree_plot = scree_plot_parameters
        save_results(files_names, files_sources, files_types, fold_name, parameters, [0],['none','none','none','none','none','none'])
    })




}
