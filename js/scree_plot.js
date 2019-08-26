console.log("scree.plot");



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#scree_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "scree_plot")));

    $.ajax({url:"js/plot_layout_adjuster1.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster1) {
        var adjusted_scree_plot_layout_adjuster1 = plot_layout_adjuster1.replaceAll("PLOT_NAME", "scree_plot")

        eval(adjusted_scree_plot_layout_adjuster1)



        // assign the default value for pca scree plot
        ocpu.call("call_fun", {parameter:{
            user_id: localStorage.user_id,
            fun_name:"get_"+window.location.href.split("#")[1]+"_scree_plot_style"
        }}, function (session) {
            session.getObject(function (scree_plot_obj) {
                
                scree_plot_obj = prepare_layout(scree_plot_obj)
                scree_plot_obj_global = scree_plot_obj
                scree_plot_traces = scree_plot_obj.traces

                $.ajax({url:"js/plot_layout_adjuster2.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster2) {
                    adjusted_scree_plot_layout_adjuster2 = plot_layout_adjuster2.replaceAll("PLOT_NAME", "scree_plot")
                    eval(adjusted_scree_plot_layout_adjuster2)

                    $("#scree_plot_layout_xaxis_title_text").val("Number of Principal Components")
                    $("#scree_plot_layout_yaxis_title_text").val("Percentage of Variance Explained")


                    $.ajax({url:"js/plot_layout_adjuster3.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster3) {
                        adjusted_scree_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "scree_plot")
                        eval(adjusted_scree_plot_layout_adjuster3)
                        scree_plot_debounced()
                    }})


                }})

            })
        }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
        })




        gather_page_information_to_scree_plot = function () {
            console.log("!")
            if(window.location.href.split("#")[1] === 'plsda'){

                var ys = [cumsum(obj_scree_plot.variance),obj_scree_plot.R2, obj_scree_plot.Q2]
                var texts = ys.map(function (x) {
                    return (x.map(function (z) {
                        return ((z * 100).toFixed(2) + "%")
                    }))
                })
                var names = ["Variance Explained on X", "Variance Explained on Y", "Predictive Accuracy"]

                
            }else{

                
                var ys = [obj_scree_plot.variance]
                var texts = ys.map(function (x) {
                    return (x.map(function (z) {
                        return ((z * 100).toFixed(2) + "%")
                    }))
                })
                var names = ["Variance Explained"]

            }
            
            var hovertexts = texts.map(function (x) {
                return (x.map(function (z, i) {
                    return ("PC" + (i + 1) + ": " + z)
                }))
            })

            
            var add_line_trace = true
            var line_trace_index = 0



            var plot_id = "scree_plot"


            $.ajax({url:"js/plot_layout_adjuster3.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster3) {
                adjusted_scree_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "scree_plot")
                eval(adjusted_scree_plot_layout_adjuster3)
                save_scree_plot_style = function () {


                    $.ajax({url:"js/plot_layout_adjuster4.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster4) {
                        adjusted_scree_plot_layout_adjuster4 = plot_layout_adjuster4.replaceAll("PLOT_NAME", "scree_plot")
                         eval(adjusted_scree_plot_layout_adjuster4)
                    }})

                }
                

                
                if($("#scree_plot_explanation_html").length==0){
                    $("#scree_plot_explanation").append("<div id='scree_plot_explanation_html'></div>")
                }
                $("#scree_plot_explanation_html").html(obj_scree_plot.results_description[3])



                scree_plot_fun({ ys: ys, texts: texts, hovertexts: hovertexts, names: names, add_line_trace: add_line_trace, line_trace_index: line_trace_index, scree_plot_layout: scree_plot_layout, plot_id: plot_id })

            }})



        }
        scree_plot_debounced = _.debounce(gather_page_information_to_scree_plot, 250, { 'maxWait': 1000 }); // this must be a global object.





    }})


})

