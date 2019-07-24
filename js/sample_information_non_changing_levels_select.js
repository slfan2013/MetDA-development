p_column_names = Object.keys(p[0])

//console.log(id)

sample_information_non_changing_levels_select_div = '<div class="form-group"><label>Treatment Groups</label><select class="form-control selectpicker parameter" id="'+id+'" data-style="btn btn-link">'
for (var i = 0; i < p_column_names.length; i++) {
    if (p_column_names[i] !== 'label') {
        sample_information_non_changing_levels_select_div = sample_information_non_changing_levels_select_div + '<option>' + p_column_names[i] + '</option>'
    }
}
sample_information_non_changing_levels_select_div = sample_information_non_changing_levels_select_div + '</select></div>'
$("#"+div_id).html(sample_information_non_changing_levels_select_div)