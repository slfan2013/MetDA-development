console.log("sidebar")

if (localStorage['big_category'] === 'project') {
    $(".show_when_project").show()
} else if (localStorage['big_category'] === 'in_and_out') {
    $(".show_when_project").hide()
}




sidebar_ul = ""


$.getJSON("http://metda:metda@localhost:5985/templates/methods", function (data) {
    ddd = data

    if (window.location.href.split("#")[1] === 'project_overview') {
        sidebar_ul = '<li class="nav-item active"><a class="nav-link" href="#project_overview"><i class="material-icons">dashboard</i><p> Project Overview </p></a></li>'
    } else {
        sidebar_ul = '<li class="nav-item"><a class="nav-link" href="#project_overview"><i class="material-icons">dashboard</i><p> Project Overview </p></a></li>'
    }

    category_names = Object.keys(data.methods_structure)
    //active

    for (cat = 0; cat < category_names.length; cat++) {
        current_cat = category_names[cat]

        // check which is active.
        current_items = Object.keys(data.methods_structure[category_names[cat]])
        if (current_items.includes(window.location.href.split("#")[1])) {
            being_active = true
        } else {
            being_active = false
        }

        if (being_active) {
            sidebar_ul = sidebar_ul + '<li class="nav-item active">'
        } else {
            sidebar_ul = sidebar_ul + '<li class="nav-item">'
        }

        sidebar_ul = sidebar_ul +
            '<a class="nav-link" data-toggle="collapse" href="#' + current_cat.replace(' ', '_') + '">' +
            ' <i class="material-icons">'
        if (current_cat === "DATA PROCESSING") {
            sidebar_ul = sidebar_ul + 'donut_large'
        } else if (current_cat === 'MULTIVARIATE ANALYSIS') {
            sidebar_ul = sidebar_ul + 'reorder'
        } else if (current_cat === 'UNIVARIATE ANALYSIS') {
            sidebar_ul = sidebar_ul + 'remove'
        }
        sidebar_ul = sidebar_ul + '</i>' +
            '<p>' + current_cat + '<b class="caret"></b></p></a>'

        if (being_active) {
            sidebar_ul = sidebar_ul + '<div class="collapse show" id="' + current_cat.replace(' ', '_') + '">'
        } else {
            sidebar_ul = sidebar_ul + '<div class="collapse" id="' + current_cat.replace(' ', '_') + '">'
        }

        sidebar_ul = sidebar_ul +
            '<ul class="nav">'
        current_items = Object.keys(data.methods_structure[category_names[cat]])
        for (var it = 0; it < current_items.length; it++) {

            if (being_active) {
                sidebar_ul = sidebar_ul + '<li class="nav-item active">'
            } else {
                sidebar_ul = sidebar_ul + '<li class="nav-item ">'
            }

            sidebar_ul = sidebar_ul +
                '<a class="nav-link" href="#' + current_items[it] + '">' +
                '<span class="sidebar-mini"> B </span><span class="sidebar-normal"> ' +
                data.methods_structure[category_names[cat]][current_items[it]]['Method Name'] + ' </span>' +
                '</a></li>'
        }
        sidebar_ul = sidebar_ul + '</ul>'

            + '</div>' + '</li>'

        '</a>' + '</li>'

    }

    $("#sidebar_ul").html(sidebar_ul)
})
