p_column_names = Object.keys(p[0])

p_column_unique = {}

for (var i = 0; i < p_column_names.length; i++) {
    p_column_unique[p_column_names[i]] = unpack(p, p_column_names[i]).filter(unique)
}
//console.log(id)



//div_id = "sample_information_changing_levels_select_div"
//id = "treatment_group"




sample_information_changing_levels_select_div = '<div class="form-group" style="padding-bottom:0"><select class="form-control selectpicker parameter" id="' + id + '" data-style="btn btn-link">'
for (var i = 0; i < p_column_names.length; i++) {
    if (p_column_names[i] !== 'label') {
        sample_information_changing_levels_select_div = sample_information_changing_levels_select_div + '<option>' + p_column_names[i] + '</option>'
    }
}
sample_information_changing_levels_select_div = sample_information_changing_levels_select_div + '</select></div>'

sample_information_changing_levels_input_div = "<div class='form-group' style='margin-top:0'>"+
"<label for='"+id+"_levels'></label>"+
"<input type='text' class='form-control parameter' id='"+id+"_levels' placeholder='levels'>"+
"</div>"




var final_div = sample_information_changing_levels_select_div+sample_information_changing_levels_input_div
$("#" + div_id).html(final_div)

var temp_levels = p_column_unique[$("#" + id).val()]

$("#"+id+"_levels").val(temp_levels.join("||"))


$("#" + id).change(function () {
    console.log("!!")

    var temp_levels = p_column_unique[$("#" + id).val()]

    $("#"+id+"_levels").val(temp_levels.join("||"))
})