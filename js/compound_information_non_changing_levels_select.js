f_column_names = Object.keys(f[0])

//console.log(id)

compound_information_non_changing_levels_select_div = '<div class="form-group"><label>Compound Info</label><select class="form-control selectpicker parameter" id="'+id+'" data-style="btn btn-link">'
for (var i = 0; i < f_column_names.length; i++) {
    if (f_column_names[i] !== 'label') {
        compound_information_non_changing_levels_select_div = compound_information_non_changing_levels_select_div + '<option>' + f_column_names[i] + '</option>'
    }
}
compound_information_non_changing_levels_select_div = compound_information_non_changing_levels_select_div + '</select></div>'
$("#"+div_id).html(compound_information_non_changing_levels_select_div)