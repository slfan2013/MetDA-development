console.log("pca.js")


$("#scaling_method_div").load("scaling_method.html", init_selectpicker)




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

    Papa.parse(session.loc + "files/sample_scores.csv", {
        download: true,
        header: false,
        complete: function (results) {
            sample_scores = results.data

            Papa.parse(session.loc + "files/compound_loadings.csv", {
                download: true,
                header: false,
                complete: function (results2) {
                    compound_loadings = results2.data

                    // here draw the PCA





                }
            });


        }
    });



    var files_sources = [session.loc + "files/sample_scores.csv", session.loc + "files/compound_loadings.csv"];
    var files_names = ["sample_scores.csv", "compound_loadings.csv"]
    var zipfile_name = "pca_results.zip"
    $("#download_results").click(function () {
        download_results(files_names, files_sources, zipfile_name)
    })

}
