console.log("data_subsetting_parameter_settings.js")

p_column_names = Object.keys(p[0])
p_column_unique = {}
p_column_unique_length = {}
p_column_type = {}

for (var i = 0; i < p_column_names.length; i++) {
    p_column_unique[p_column_names[i]] = unpack(p, p_column_names[i])
    p_column_unique_length[p_column_names[i]] = p_column_unique[p_column_names[i]].length
    p_column_type[p_column_names[i]] = jStat.sum(p_column_unique.SampleID.map(x => Number(x) == NaN)) == 0 ? "Categorical" : "Numeric"
}

$("#subset_by_sample_checked").hide()
$("#subset_by_compound_checked").hide()



// localStorage.activate_data_id
// project_id
ocpu.call("get_compound_sample_info", {
    project_id: project_id
}, function (session) {
    session.getObject(function (obj) {
        

        console.log("ready")
        ooo = obj
        sample_related_info_keys = Object.keys(obj.sample_related_info)
        sample_related_info = {}
        for (var i = 0; i < sample_related_info_keys.length; i++) {
            sample_related_info[sample_related_info_keys[i]] = {
                text: obj.sample_related_info[sample_related_info_keys[i]]['text'],
                column_names: obj.sample_related_info[sample_related_info_keys[i]]['column_names'],
                column_levels: obj.sample_related_info[sample_related_info_keys[i]]['column_levels'],
                column_type: obj.sample_related_info[sample_related_info_keys[i]]['column_type']
            }
        }
        
        subset_by_sample_change = function(){
            if($("#subset_by_sample").is(':checked')){
                $("#subset_by_sample_checked").show()
            }else{
                $("#subset_by_sample_checked").hide()
            }
        }

        // now I need to put the file names. if any changes, just change the ith div. ith file, ith columns, ith levels, ith type.
        number_of_sample_criterions = 0
        add_sample_criterion = function () {
            console.log("adding")
            number_of_sample_criterions = number_of_sample_criterions + 1
            var new_sample_data_div = "<div id='sample_criterion_div__" + number_of_sample_criterions + "'>" +
                "<div class='row'><div class='col-lg-12'>" +
                "<div class='form-group'>" +
                "<label for='sample_criterion_data_id__" + number_of_sample_criterions + "'>Data Set "+number_of_sample_criterions+"</label>" +
                "<select class='form-control selectpicker parameter' data-style='btn btn-link' id='sample_criterion_data_id__" + number_of_sample_criterions + "'>"
            for (var i = -1; i < sample_related_info_keys.length; i++) {

                if(i===-1){
                    new_sample_data_div = new_sample_data_div +
                    "<option disabled selected value> -- select a data -- </option>"
                }else{
                    new_sample_data_div = new_sample_data_div +
                    "<option value='" + sample_related_info_keys[i] + "'>" + sample_related_info[sample_related_info_keys[i]].text + "</option>"
                }

                    
            }
            new_sample_data_div = new_sample_data_div +
                "</select></div></div></div>" +
                "<div class='row'>" +
                "<div class='col-lg-4' id='sample_criterion_column_div__" + number_of_sample_criterions + "'></div>" +
                "<div class='col-lg-4' id='sample_criterion_type_div__" + number_of_sample_criterions + "'></div>"+
                "<div class='col-lg-4' id='sample_criterion_level_div__" + number_of_sample_criterions + "'></div>"  + "</div>" + "</div>"

            $("#subset_by_sample_criterions_div").append(new_sample_data_div)
            init_selectpicker()

            sample_criterion_data_id_change = function () {
                
                //var data_id = $("#sample_criterion_data_id" + index).val()
                //console.log("!!")
                //console.log($(this).attr('id'))
                var current_index = $(this).attr('id').split("__")[1]
                //tttt = this
                var data_id = $("#sample_criterion_data_id__" + current_index).val()
          
                $("#sample_criterion_data_id__" + current_index).selectpicker('refresh')
                new_sample_column_div = '<div class="form-group">' +
                    '<label for="sample_criterion_column__' + current_index + '">Criterion Column</label>' +
                    '<select class="form-control selectpicker parameter" data-style="btn btn-link" id="sample_criterion_column__' + current_index + '">'
                for (var i = -1; i < sample_related_info[data_id].column_names.length; i++) {
                    if(i===-1){
                        new_sample_column_div = new_sample_column_div +
                        "<option hidden  disabled selected value> -- select a column -- </option>"
                    }else{
                        new_sample_column_div = new_sample_column_div +
                        "<option>" + sample_related_info[data_id].column_names[i] + "</option>"
                    }
                        
                }
                new_sample_column_div = new_sample_column_div +
                    "</select></div>"
                $("#sample_criterion_column_div__" + current_index).html(new_sample_column_div)
                init_selectpicker()

                new_sample_type_div = '<div class="form-group">' +
                    '<label for="sample_criterion_type__' + current_index + '">Criterion Type</label>' +
                    '<select class="form-control selectpicker parameter" data-style="btn btn-link" id="sample_criterion_type__' + current_index + '">' +
                    '<option disabled selected value=""> -- select a type -- </option>'+
                    '<option>character</option>' +
                    '<option>numeric</option>' +
                    "</select></div>"
                $("#sample_criterion_type_div__" + current_index).html(new_sample_type_div)
                init_selectpicker()
                $("#sample_criterion_type__" + current_index).val(sample_related_info[data_id].column_type[$("#sample_criterion_column__" + current_index).val()])
                $("#sample_criterion_type__" + current_index).selectpicker('refresh')


                sample_criterion_column_change = function () {
                    var current_index = $(this).attr('id').split("__")[1]
                    var column = $("#sample_criterion_column__" + current_index).val()
                    $("#sample_criterion_column__" + current_index).selectpicker('refresh')
                    //var column = $(this).val()
                    console.log(column)
                    $("#sample_criterion_type__" + current_index).val("")
                    $("#sample_criterion_type__" + current_index).selectpicker('refresh')

                    sample_criterion_type_change = function(){
                        console.log("!!!!")
                        var current_index = $(this).attr('id').split("__")[1]
                        console.log(current_index)
                        $("#sample_criterion_type__" + current_index).selectpicker('refresh')
                        if($("#sample_criterion_type__" + current_index).val() == "character"){
                            var new_sample_level_div = '<div class="form-group">'+
                            '<label for="sample_criterion_level__'+current_index+'">Selected Levels</label>'+
                            '<select multiple class="form-control selectpicker parameter" data-style="btn btn-link" id="sample_criterion_level__' + current_index + '">'
                            for(var i=-1;i<sample_related_info[data_id].column_levels[$("#sample_criterion_column__"+current_index).val()].length;i++){

                                if(i===-1){
                                   // new_sample_level_div = new_sample_level_div +
                                    //"<option disabled selected value> -- select a type -- </option>"  
                                }else{
                                    new_sample_level_div = new_sample_level_div +
                                    "<option>" + sample_related_info[data_id].column_levels[$("#sample_criterion_column__"+current_index).val()][i] + "</option>"
                                }
                            }
                            new_sample_level_div = new_sample_level_div + "</select></div>"
                            $("#sample_criterion_level_div__" + current_index).html(new_sample_level_div)
                            
                            $("#sample_criterion_level__" + current_index).off('change').on('change',function(){
                                $("#sample_criterion_level__" + current_index).selectpicker('refresh')
                            })



                        }else{
                            new_sample_level_div =  "<div class='row'>"+
                            "<div class='col-lg-6'>"+
                            '<div class="form-group">'+
                            '<label for="sample_criterion_level_min__'+current_index+'">Min</label>'+
                            '<input type="number" step="any" class="form-control parameter" id="sample_criterion_level_min__'+current_index+'" placeholder="min:'+jStat.min(sample_related_info[data_id].column_levels[$("#sample_criterion_column__"+current_index).val()])+'">'+
                            "</div>"+
                            "</div>"+
                            "<div class='col-lg-6'>"+
                            '<div class="form-group">'+
                            '<label for="sample_criterion_level_max__'+current_index+'">Max</label>'+
                            '<input type="number" step="any" class="form-control parameter" id="sample_criterion_level_max__'+current_index+'" placeholder="max:'+jStat.max(sample_related_info[data_id].column_levels[$("#sample_criterion_column__"+current_index).val()])+'">'+
                            "</div>"+
                            "</div>"+
                            "</div>"
                            nnn = new_sample_level_div
                            $("#sample_criterion_level_div__" + current_index).html(new_sample_level_div)

                        }

                        
                        $(".parameter").on("change",get_parameter_description)
                        init_selectpicker()
                        
                    }
                    $("#sample_criterion_type__" + number_of_sample_criterions).off("change").on("change",sample_criterion_type_change)
                    
                    
                    
                    

                }
                $("#sample_criterion_column__" + number_of_sample_criterions).off("change").on("change", sample_criterion_column_change)




            }

            $("#sample_criterion_data_id__" + number_of_sample_criterions).off("change").on("change", sample_criterion_data_id_change)

            
        }
        remove_sample_criterion = function(){
            if(number_of_sample_criterions>0){
                $('#sample_criterion_div__' + number_of_sample_criterions).remove()
                number_of_sample_criterions = number_of_sample_criterions-1
            }
        }

        compound_related_info_keys = Object.keys(obj.compound_related_info)
        compound_related_info = {}
        for (var i = 0; i < compound_related_info_keys.length; i++) {
            compound_related_info[compound_related_info_keys[i]] = {
                text: obj.compound_related_info[compound_related_info_keys[i]]['text'],
                column_names: obj.compound_related_info[compound_related_info_keys[i]]['column_names'],
                column_levels: obj.compound_related_info[compound_related_info_keys[i]]['column_levels'],
                column_type: obj.compound_related_info[compound_related_info_keys[i]]['column_type']
            }
        }
        
        subset_by_compound_change = function(){
            if($("#subset_by_compound").is(':checked')){
                $("#subset_by_compound_checked").show()
            }else{
                $("#subset_by_compound_checked").hide()
            }
        }

        // now I need to put the file names. if any changes, just change the ith div. ith file, ith columns, ith levels, ith type.
        number_of_compound_criterions = 0
        add_compound_criterion = function () {
            console.log("adding")
            number_of_compound_criterions = number_of_compound_criterions + 1
            var new_compound_data_div = "<div id='compound_criterion_div__" + number_of_compound_criterions + "'>" +
                "<div class='row'><div class='col-lg-12'>" +
                "<div class='form-group'>" +
                "<label for='compound_criterion_data_id__" + number_of_compound_criterions + "'>Data Set "+number_of_compound_criterions+"</label>" +
                "<select class='form-control selectpicker parameter' data-style='btn btn-link' id='compound_criterion_data_id__" + number_of_compound_criterions + "'>"
            for (var i = -1; i < compound_related_info_keys.length; i++) {

                if(i===-1){
                    new_compound_data_div = new_compound_data_div +
                    "<option disabled selected value> -- select a data -- </option>"
                }else{
                    new_compound_data_div = new_compound_data_div +
                    "<option value='" + compound_related_info_keys[i] + "'>" + compound_related_info[compound_related_info_keys[i]].text + "</option>"
                }

                    
            }
            new_compound_data_div = new_compound_data_div +
                "</select></div></div></div>" +
                "<div class='row'>" +
                "<div class='col-lg-4' id='compound_criterion_column_div__" + number_of_compound_criterions + "'></div>" +
                "<div class='col-lg-4' id='compound_criterion_type_div__" + number_of_compound_criterions + "'></div>"+
                "<div class='col-lg-4' id='compound_criterion_level_div__" + number_of_compound_criterions + "'></div>"  + "</div>" + "</div>"

            $("#subset_by_compound_criterions_div").append(new_compound_data_div)
            init_selectpicker()

            compound_criterion_data_id_change = function () {
                
                //var data_id = $("#compound_criterion_data_id" + index).val()
                //console.log("!!")
                //console.log($(this).attr('id'))
                var current_index = $(this).attr('id').split("__")[1]
                //tttt = this
                var data_id = $("#compound_criterion_data_id__" + current_index).val()
          
                $("#compound_criterion_data_id__" + current_index).selectpicker('refresh')
                new_compound_column_div = '<div class="form-group">' +
                    '<label for="compound_criterion_column__' + current_index + '">Criterion Column</label>' +
                    '<select class="form-control selectpicker parameter" data-style="btn btn-link" id="compound_criterion_column__' + current_index + '">'
                for (var i = -1; i < compound_related_info[data_id].column_names.length; i++) {
                    if(i===-1){
                        new_compound_column_div = new_compound_column_div +
                        "<option hidden  disabled selected value> -- select a column -- </option>"
                    }else{
                        new_compound_column_div = new_compound_column_div +
                        "<option>" + compound_related_info[data_id].column_names[i] + "</option>"
                    }
                        
                }
                new_compound_column_div = new_compound_column_div +
                    "</select></div>"
                $("#compound_criterion_column_div__" + current_index).html(new_compound_column_div)
                init_selectpicker()

                new_compound_type_div = '<div class="form-group">' +
                    '<label for="compound_criterion_type__' + current_index + '">Criterion Type</label>' +
                    '<select class="form-control selectpicker parameter" data-style="btn btn-link" id="compound_criterion_type__' + current_index + '">' +
                    '<option disabled selected value=""> -- select a type -- </option>'+
                    '<option>character</option>' +
                    '<option>numeric</option>' +
                    "</select></div>"
                $("#compound_criterion_type_div__" + current_index).html(new_compound_type_div)
                init_selectpicker()
                $("#compound_criterion_type__" + current_index).val(compound_related_info[data_id].column_type[$("#compound_criterion_column__" + current_index).val()])
                $("#compound_criterion_type__" + current_index).selectpicker('refresh')


                compound_criterion_column_change = function () {
                    var current_index = $(this).attr('id').split("__")[1]
                    console.log(current_index)
                    var column = $("#compound_criterion_column__" + current_index).val()
                    $("#compound_criterion_column__" + current_index).selectpicker('refresh')
                    //var column = $(this).val()
                    console.log(column)
                    $("#compound_criterion_type__" + current_index).val("")
                    $("#compound_criterion_type__" + current_index).selectpicker('refresh')

                    compound_criterion_type_change = function(){
                        var current_index = $(this).attr('id').split("__")[1]
                        $("#compound_criterion_type__" + current_index).selectpicker('refresh')
                        if($("#compound_criterion_type__" + current_index).val() == "character"){
                            var new_compound_level_div = '<div class="form-group">'+
                            '<label for="compound_criterion_level__'+current_index+'">Selected Levels</label>'+
                            '<select multiple class="form-control selectpicker parameter" data-style="btn btn-link" id="compound_criterion_level__' + current_index + '">'
                            for(var i=-1;i<compound_related_info[data_id].column_levels[$("#compound_criterion_column__"+current_index).val()].length;i++){

                                if(i===-1){
                                   // new_compound_level_div = new_compound_level_div +
                                    //"<option disabled selected value> -- select a type -- </option>"  
                                }else{
                                    new_compound_level_div = new_compound_level_div +
                                    "<option>" + compound_related_info[data_id].column_levels[$("#compound_criterion_column__"+current_index).val()][i] + "</option>"
                                }
                            }
                            new_compound_level_div = new_compound_level_div + "</select></div>"
                            $("#compound_criterion_level_div__" + current_index).html(new_compound_level_div)
                            
                            $("#compound_criterion_level__" + current_index).off('change').on('change',function(){
                                $("#compound_criterion_level__" + current_index).selectpicker('refresh')
                            })

                        }else{
                            new_compound_level_div =  "<div class='row'>"+
                            "<div class='col-lg-6'>"+
                            '<div class="form-group">'+
                            '<label for="compound_criterion_level_min__'+current_index+'">Min</label>'+
                            '<input type="number" step="any" class="form-control parameter" id="compound_criterion_level_min__'+current_index+'" placeholder="min:'+jStat.min(compound_related_info[data_id].column_levels[$("#compound_criterion_column__"+current_index).val()])+'">'+
                            "</div>"+
                            "</div>"+
                            "<div class='col-lg-6'>"+
                            '<div class="form-group">'+
                            '<label for="compound_criterion_level_max__'+current_index+'">Max</label>'+
                            '<input type="number" step="any" class="form-control parameter" id="compound_criterion_level_max__'+current_index+'" placeholder="max:'+jStat.max(compound_related_info[data_id].column_levels[$("#compound_criterion_column__"+current_index).val()])+'">'+
                            "</div>"+
                            "</div>"+
                            "</div>"
                            $("#compound_criterion_level_div__" + current_index).html(new_compound_level_div)
                        }
                        init_selectpicker()
                        $(".parameter").on("change",get_parameter_description)
                    }
                    $("#compound_criterion_type__" + number_of_compound_criterions).off("change").on("change",compound_criterion_type_change)
                    
                    

                    

                }
                $("#compound_criterion_column__" + number_of_compound_criterions).off("change").on("change", compound_criterion_column_change)




            }
            $("#compound_criterion_data_id__" + number_of_compound_criterions).off("change").on("change", compound_criterion_data_id_change)
            

            
        }
        remove_compound_criterion = function(){
            if(number_of_compound_criterions>0){
                $('#compound_criterion_div__' + number_of_compound_criterions).remove()
                number_of_compound_criterions = number_of_compound_criterions-1
            }
        }




































        $("#parameter_settings_description").load(window.location.href.split("#")[1] + "_parameter_settings_description.html", init_selectpicker)






    })
})