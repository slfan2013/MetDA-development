console.log("sample_size.plot");
color_pallete = [["rgb(228, 59, 45)", "rgb(55, 126, 183)", "rgb(77, 175, 74)"],
["rgb(152, 78, 163)", "rgb(242, 126, 51)", "rgb(254, 248, 64)"],
["rgb(166, 86, 41)", "rgb(241, 128, 191)", "rgb(153, 153, 153)"],
["rgb(0,0,0)", "rgb(255,255,255)"]]



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#sample_size_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "sample_size_plot")));

    $.getScript("js/plot_layout_adjuster1.js", function (plot_layout_adjuster1) {
        var adjusted_sample_size_plot_layout_adjuster1 = plot_layout_adjuster1.replaceAll("PLOT_NAME", "sample_size_plot")
        console.log(adjusted_sample_size_plot_layout_adjuster1)
        eval(adjusted_sample_size_plot_layout_adjuster1)



        // assign the default value for sample_size plot
        ocpu.call("call_fun", {parameter:{
            user_id: localStorage.user_id,
            fun_name:"get_sample_size_plot_style"
        }}, function (session) {
            session.getObject(function (sample_size_plot_obj) {
                console.log(sample_size_plot_obj)
                oo = sample_size_plot_obj
                sample_size_plot_traces = sample_size_plot_obj.traces

                $.getScript("js/plot_layout_adjuster2.js", function (plot_layout_adjuster2) {
                    adjusted_sample_size_plot_layout_adjuster2 = plot_layout_adjuster2.replaceAll("PLOT_NAME", "sample_size_plot")
                    console.log(adjusted_sample_size_plot_layout_adjuster2) // THIS console log is neccessary. 
                    eval(adjusted_sample_size_plot_layout_adjuster2)


                    $.getScript("js/plot_layout_adjuster3.js", function (plot_layout_adjuster3) {
                        adjusted_sample_size_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "sample_size_plot")
                        console.log(adjusted_sample_size_plot_layout_adjuster3) // THIS console log is neccessary.
                        eval(adjusted_sample_size_plot_layout_adjuster3)


                        //sample_size_plot_debounced()

                    })


                })

            })
        }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
        })




        gather_page_information_to_sample_size_plot = function () {
            console.log("!")

            if(typeof obj_sample_size_plot !== 'undefined'){


                ns = obj_sample_size_plot.ns
                powers = obj_sample_size_plot.powers
                effect_sizes = Object.keys(ns)
                   
    
                plot_id = "sample_size_plot"
                $.getScript("js/plot_layout_adjuster3.js", function (plot_layout_adjuster3) {
                    adjusted_sample_size_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "sample_size_plot")
                    console.log(adjusted_sample_size_plot_layout_adjuster3) // THIS console log is neccessary.
                    eval(adjusted_sample_size_plot_layout_adjuster3)
    
                    save_sample_size_plot_style = function () {
    
    
                        $.getScript("js/plot_layout_adjuster4.js", function (plot_layout_adjuster4) {
                            adjusted_sample_size_plot_layout_adjuster4 = plot_layout_adjuster4.replaceAll("PLOT_NAME", "sample_size_plot")
                            console.log(adjusted_sample_size_plot_layout_adjuster4)
                            eval(adjusted_sample_size_plot_layout_adjuster4)
                        })
    
                    }
    
                    sample_size_plot_fun({ ns:ns, powers:powers, effect_sizes:effect_sizes,sample_size_plot_layout: sample_size_plot_layout, plot_id: plot_id })
    
                })

                
    
            }

            

            



        }
        sample_size_plot_debounced = _.debounce(gather_page_information_to_sample_size_plot, 250, { 'maxWait': 1000 }); // this must be a global object.




    })


})

