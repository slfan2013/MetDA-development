console.log("plsda.js")
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

plsda_append_results = function (obj, session) {
    $("#results_description").html(obj.results_description[0])


    //ss = session
    //console.log(session)

    // for downloads.
    files_sources = [session.loc + "files/sample_scores.csv", session.loc + "files/compound_loadings.csv", session.loc + "files/vip_data.csv", plot_url.score_plot, plot_url.loading_plot, plot_url.scree_plot, plot_url.vip_plot, plot_url.perm_plot];
    files_names = ["sample_scores.csv", "compound_loadings.csv", 'vip_data.csv','score_plot.svg', 'loading_plot.svg', 'scree_plot.svg', 'vip_plot.svg', 'perm_plot.svg']
    zipfile_name = "plsda_results.zip"
    $("#download_results").off("click").on("click", function () {
        parameters = JSON.parse(localStorage.getItem('parameter'))
        parameters.scree_plot = scree_plot_parameters
        parameters.perm_plot = perm_plot_parameters
        parameters.score_plot = score_plot_parameters
        parameters.loading_plot = loading_plot_parameters
        parameters.vip_plot = vip_plot_parameters
        /*parameters.scree_plot = {}
        parameters.scree_plot.data = {}
        parameters.scree_plot.data.x = unpack(scree_plot_parameters.data,"x")
        parameters.scree_plot.data.y = unpack(scree_plot_parameters.data,"y")
        parameters.scree_plot.data.name = unpack(scree_plot_parameters.data,"name")
        parameters.scree_plot.layout = {}
        parameters.scree_plot.layout.width = scree_plot_parameters.layout.width
        parameters.scree_plot.layout.height = scree_plot_parameters.layout.height

        parameters.perm_plot = {}
        parameters.perm_plot.layout = {}
        parameters.perm_plot.layout.pQ2 = perm_plot_parameters.layout.pQ2 
        parameters.perm_plot.layout.pR2Y = perm_plot_parameters.layout.pR2Y 
        parameters.perm_plot.layout.width = perm_plot_parameters.layout.width
        parameters.perm_plot.layout.height = perm_plot_parameters.layout.height


        parameters.score_plot = {}
        parameters.score_plot.layout = {}
        parameters.score_plot.layout.height = score_plot_parameters.layout.height
        parameters.score_plot.layout.width = score_plot_parameters.layout.width

        parameters.loading_plot = {}
        parameters.loading_plot.layout = {}
        parameters.loading_plot.layout.height = loading_plot_parameters.layout.height
        parameters.loading_plot.layout.width = loading_plot_parameters.layout.width
        
        

        parameters.vip_plot = {}
        parameters.vip_plot.layout = {}
        parameters.vip_plot.layout.height = vip_plot_parameters.layout.height
        parameters.vip_plot.layout.width = vip_plot_parameters.layout.width*/

        save_results(files_names, files_sources, files_types, fold_name, parameters, [0],['none','none','compound','none','none','none','none','none','none'])
    })


    fold_name = "PLSDA"
    files_types = ["application/vnd.ms-excel", "application/vnd.ms-excel", "application/vnd.ms-excel","image/svg+xml", "image/svg+xml", "image/svg+xml", "image/svg+xml", "image/svg+xml"]
    $("#save_results").off("click").on("click", function () {// open a dialog and ask where to save.
        parameters = JSON.parse(localStorage.getItem('parameter'))
        parameters.scree_plot = scree_plot_parameters
        parameters.perm_plot = perm_plot_parameters
        parameters.score_plot = score_plot_parameters
        parameters.loading_plot = loading_plot_parameters
        parameters.vip_plot = vip_plot_parameters


        /*parameters.scree_plot = {}
        parameters.scree_plot.data = {}
        parameters.scree_plot.data.x = unpack(scree_plot_parameters.data,"x")
        parameters.scree_plot.data.y = unpack(scree_plot_parameters.data,"y")
        parameters.scree_plot.data.name = unpack(scree_plot_parameters.data,"name")
        parameters.scree_plot.layout = {}
        parameters.scree_plot.layout.width = scree_plot_parameters.layout.width
        parameters.scree_plot.layout.height = scree_plot_parameters.layout.height

        parameters.perm_plot = {}
        parameters.perm_plot.layout = {}
        parameters.perm_plot.layout.pQ2 = perm_plot_parameters.layout.pQ2 
        parameters.perm_plot.layout.pR2Y = perm_plot_parameters.layout.pR2Y 
        parameters.perm_plot.layout.width = perm_plot_parameters.layout.width
        parameters.perm_plot.layout.height = perm_plot_parameters.layout.height


        parameters.score_plot = {}
        parameters.score_plot.layout = {}
        parameters.score_plot.layout.height = score_plot_parameters.layout.height
        parameters.score_plot.layout.width = score_plot_parameters.layout.width

        parameters.loading_plot = {}
        parameters.loading_plot.layout = {}
        parameters.loading_plot.layout.height = loading_plot_parameters.layout.height
        parameters.loading_plot.layout.width = loading_plot_parameters.layout.width
        
        

        parameters.vip_plot = {}
        parameters.vip_plot.layout = {}
        parameters.vip_plot.layout.height = vip_plot_parameters.layout.height
        parameters.vip_plot.layout.width = vip_plot_parameters.layout.width*/
        
        save_results(files_names, files_sources, files_types, fold_name, parameters, [0],['none','none','compound','none','none','none','none','none','none'])
    })




}
