
/*
parameter.fun_name = "plsda_perm"
parameter.n_perm = 500
parameter.Q2 = obj_perm_plot.Q2
ocpu.call("call_fun_temp",{
    parameter:parameter
},function(session){
    console.log("plsda_perm")
    console.log(session)
    session.getObject(function(obj){
        console.log(obj)
    })
})*/


$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#perm_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "perm_plot")));

    $.ajax({
        url: "js/plot_layout_adjuster1.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster1) {

            adjusted_perm_plot_layout_adjuster1 = plot_layout_adjuster1.replace(/PLOT_NAME/g, 'perm_plot')
            eval(adjusted_perm_plot_layout_adjuster1)

            // assign the default value for perm plot
            ocpu.call("call_fun", {
                parameter: {
                    user_id: localStorage.user_id,
                    fun_name: "get_perm_plot_style"
                }
            }, function (session) {
                session.getObject(function (perm_plot_obj) {

                    perm_plot_obj = prepare_layout(perm_plot_obj)
                    perm_plot_obj_global = perm_plot_obj
                    perm_plot_traces = perm_plot_obj.traces

                    var p_column_names = Object.keys(obj_perm_plot.p[0])
                    var p_column_unique = {}
                    var p_column_unique_length = {}


                    var f_column_names = Object.keys(obj_perm_plot.f[0])
                    var f_column_unique = {}
                    var f_column_unique_length = {}

                    // create inputs according to sample and compound information.



                    $.ajax({
                        url: "js/plot_layout_adjuster2.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster2) {
                            adjusted_perm_plot_layout_adjuster2 = plot_layout_adjuster2.replace(/PLOT_NAME/g, 'perm_plot')
                            //console.log(adjusted_perm_plot_layout_adjuster2)
                            eval(adjusted_perm_plot_layout_adjuster2)


                            // initialize the traces on HTML.
                            $("#n_perm").val(perm_plot_obj.traces.n_perm);
                            $("#colorscale").val(perm_plot_obj.traces.colorscale)
                            $("#colorscale").selectpicker('refresh')



                            perm_plot_debounced()
                        }
                    })

                })
            }).fail(function (e2) {
                Swal.fire('Oops...', e2.responseText, 'error')
            })


            gather_page_information_to_perm_plot = function () {


                $.ajax({
                    url: "js/plot_layout_adjuster3.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster3) {
                        var adjusted_perm_plot_layout_adjuster3 = plot_layout_adjuster3.replace(/PLOT_NAME/g, 'perm_plot')
                        console.log("REPLACED")
                        //console.log(adjusted_perm_plot_layout_adjuster3)

                        console.log("EVALUATED")
                        eval(adjusted_perm_plot_layout_adjuster3)

                        save_perm_plot_style = function () {
                            // save the traces on HTML
                            perm_plot_layout.traces.n_perm = $("#n_perm").val()
                            perm_plot_layout.traces.colorscale = $("#colorscale").val()
                            //perm_plot_layout.traces.sample_size_range = $("#sample_size_range").val()
                            $.ajax({
                                url: "js/plot_layout_adjuster4.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster4) {
                                    adjusted_perm_plot_layout_adjuster4 = plot_layout_adjuster4.replace(/PLOT_NAME/g, 'perm_plot')
                                    console.log(adjusted_perm_plot_layout_adjuster4)
                                    eval(adjusted_perm_plot_layout_adjuster4)
                                }
                            })
                        }

                        // collect traces info for plot.
                        perm_plot_layout.traces.n_perm = $("#n_perm").val()
                        perm_plot_layout.traces.colorscale = $("#colorscale").val()




                        if ($("#perm_plot_explanation_html").length == 0) {
                            $("#perm_plot_explanation").append("<div id='perm_plot_explanation_html'></div>")
                        }
                        $("#perm_plot_explanation_html").html(obj_perm_plot.results_description[5])

                        

                        var layout = perm_plot_layout
                        
                        perm_plot_layout.pQ2 = obj_perm_plot.perm_summary[0].pQ2
                        perm_plot_layout.pR2Y = obj_perm_plot.perm_summary[0].pR2Y

                        var plot_id = "perm_plot"

                        layout

                        perm_plot_fun({ obj_perm_plot: obj_perm_plot, layout: layout, plot_id: plot_id })
                    }
                })
            }
            perm_plot_debounced = _.debounce(gather_page_information_to_perm_plot, 250, { 'maxWait': 1000 }); // this must be a global object.
        }
    })
}, 'html');







