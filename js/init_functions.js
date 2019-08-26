initialize_nav_link = function () {
  console.log("trying to initialize the links")

  $.getJSON("https://metda.fiehnlab.ucdavis.edu/db/templates/methods", function (data) {
    methods_data = data
    sidebar_ul = ""


    sidebar_ul = sidebar_ul + '<li class="nav-item"><a class="nav-link" href="#project_overview">Project Overview <span class="sr-only">(current)</span></a></li>'

    category_names = Object.keys(data.methods_structure)

    for (cat = 0; cat < category_names.length; cat++) {
      current_cat = category_names[cat]

      // check which is active.
      current_items = Object.keys(data.methods_structure[category_names[cat]])
      console.log(current_items)



      if (current_items.includes(window.location.href.split("#")[1])) {
        being_active = true
      } else {
        being_active = false
      }
      console.log(being_active)

      if (being_active) {
        sidebar_ul = sidebar_ul + '<li class="dropdown-submenu">' +
          '<a class="dropdown-item dropdown-toggle" href="#">' + current_cat + '</a>'
      } else {
        sidebar_ul = sidebar_ul + '<li class="dropdown-submenu">' +
          '<a class="dropdown-item dropdown-toggle" href="#">' + current_cat + '</a>'
      }

      sidebar_ul = sidebar_ul + '<ul class="dropdown-menu">'

      for (var it = 0; it < current_items.length; it++) {
        sidebar_ul = sidebar_ul + '<li><a class="dropdown-item" href="#' + current_items[it] + '">' + data.methods_structure[category_names[cat]][current_items[it]]['Method Name'] + '</a></li>'

      }

      sidebar_ul = sidebar_ul + '</ul>'
      sidebar_ul = sidebar_ul + '</li>'


    }
    $("#navbarDropdownMenuLink_items").html(sidebar_ul)

    $('.dropdown-menu a.dropdown-toggle').on('mouseenter', function (e) {
      var $el = $(this);
      var $parent = $(this).offsetParent(".dropdown-menu");
      if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
      }
      var $subMenu = $(this).next(".dropdown-menu");
      $subMenu.toggleClass('show');

      $(this).closest("a").toggleClass('open');
      $(this).parents('a.dropdown-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
        $('.dropdown-menu .show').removeClass("show");
      });
      if (!$parent.parent().hasClass('navbar-nav')) {
        $el.next().css({
          "top": $el[0].offsetTop,
          "left": $parent.outerWidth() - 4
        });
      }
      return false;
    });



  })

}



function nestedObjectToArray(obj) {
  if (typeof (obj) !== "object") {
    return [""];
  }
  var result = [];
  if (obj.constructor === Array) {
    obj.map(function (item) {
      result = result.concat(nestedObjectToArray(item));
    });
  } else {
    Object.keys(obj).map(function (key) {
      if (obj[key]) {
        var chunk = nestedObjectToArray(obj[key]);
        chunk.map(function (item) {
          result.push(key + "." + item);
        });
      } else {
        result.push(key);
      }
    });
  }
  return result;
};

function get(reference, pathParts) {
  if (typeof pathParts === 'string') {
    pathParts = pathParts.split('.');
  }

  var index = 0,
    pathLength = pathParts.length;

  for (; index < pathLength; index++) {
    var key = pathParts[index];

    if (reference == null) {
      break;
    } else if (
      typeof reference[key] === 'object' &&
      index !== pathLength - 1
    ) {
      reference = reference[key];
    } else {

      if (index < pathLength - 1) {
        return;
      }

      return reference[key];
    }
  }
};

prepare_layout = function (layout) {
  var oo = nestedObjectToArray(layout)
  var ooo = oo.map(x => x.slice(0, -1))

  for (var i = 0; i < ooo.length; i++) {



    var current_value = get(layout, ooo[i]);
    if (current_value.length == 1 && Array.isArray(current_value)) {
      set(layout, ooo[i], current_value[0]);
    } else {

      if (current_value.map(x => x.length).filter(unique) == 1) {
        set(layout, ooo[i], [].concat.apply([], current_value));
      }
      // change [[1],[2]] to [1,2]
    }
  }
  return (layout)
}

















function set(reference, pathParts, value) {
  if (typeof pathParts === 'string') {
    pathParts = pathParts.split('.');
  }

  var index = 0,
    pathLength = pathParts.length,
    result = reference,
    previousresult,
    previousKey;

  for (; index < pathLength; index++) {
    var key = pathParts[index];

    if ((typeof result !== 'object' || result === null) && index < pathLength) {
      if (typeof key !== 'symbol' && !Number.isNaN(Number(key))) {
        result = previousresult[previousKey] = [];
      }
      else {
        result = previousresult[previousKey] = {};
      }
    }
    if (index === pathLength - 1) {
      result[key] = value;
    }
    else {
      previousresult = result;
      previousKey = key;
      result = result[key];
    }
  }
};
cumsum = function (myarray) {
  var new_array = [];
  myarray.reduce(function (a, b, i) { return new_array[i] = a + b; }, 0);
  return (new_array) // [5, 15, 18, 20]
}


start_cal = function () {
  $("body").append('<div id="overlay" style="background-color:rgba(0,0,0,0.5);position:absolute;top:0;left:0;height:100%;width:100%;z-index:999"></div>');
}
end_cal = function () {
  $("#overlay").remove();
}

get_time_string = function () {
  var d = new Date(); var time_string = d.getTime().toString()
  return (time_string)
}

init_ripples = function () {
  $.material.init()
}
String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

function unpack(rows, key) {

  for (var i = 0; i < rows.length; i++) {
    if (rows[i] === null) {
      rows[i] = ""
    }
  }

  return rows.map(function (row) { return row[key]; });
}// unpack(data,key)

function groupData(labels, values) {
  return labels.reduce(function (hash, lab, i) { // for each label lab
    if (hash[lab])                               // if there is an array for the values of this label
      hash[lab].push(values[i]);                // push the according value into that array
    else                                        // if there isn't an array for it
      hash[lab] = [values[i]];                // then create one that initially contains the according value
    return hash;
  }, {});
}
function unique(value, index, self) {
  return self.indexOf(value) === index;
} // [].filter(unique)


revalue = function (array, old_val, new_val) {
  var result = [];

  for (var j = 0; j < array.length; j++) {

    for (var i = 0; i < old_val.length; i++) {

      if (array[j] === old_val[i]) {
        result.push(new_val[i])
      }

    }

  }

  return (result)

}
function sum(xs) {
  return xs.reduce((total, x) => total + x, 0)
}

function mean(xs) {
  return sum(xs) / xs.length
}

function zip(xs, ys) {
  return range(xs.length)
    .reduce((arr, i) => [...arr, [xs[i], ys[i]]], [])
}

function range(start, end) {
  if (end == null) {
    end = start
    start = 0
  }

  return new Array(end - start).fill().map((_, i) => i + start)
}

function stdev(xs) {
  const xhat = mean(xs)
  const squareDistances = xs.map(x => Math.pow(x - xhat, 2))
  return Math.sqrt(sum(squareDistances) / (xs.length - 1))
}

function covariance(xs, ys) {
  const xhat = mean(xs)
  const yhat = mean(ys)

  const total = sum(zip(xs, ys).map(([x, y]) => (x - xhat) * (y - yhat)))

  return total / (xs.length - 1)
}
function delta(aij, res, i, j) {
  for (var k = 0, sum = aij; k < j; ++k) if (res[i][k]) sum -= res[i][k] * res[j][k]
  return sum
}
function cholesky(matrix) {
  var len = matrix.length,
    res = Array(len)
  if (matrix.length !== matrix[len - 1].length) throw Error('Input matrix must be square or lower triangle')

  res[0] = [Math.sqrt(matrix[0][0])]

  for (var i = 1; i < len; ++i) {
    res[i] = Array(i + 1); // lower triangle
    for (var j = 0; j < i; ++j) {
      res[i][j] = delta(matrix[i][j], res, i, j) / res[j][j]
    }
    res[i][i] = Math.sqrt(delta(matrix[i][i], res, i, i))
  }
  return res
}
ellipse = function (x, y, level = 0.95) {
  var dfn = 2
  var segments = 51
  var dfd = x.length - 1
  if (dfd < 2) {
    return ({ x: null, y: null })
  } else {

    var shape = [[covariance(x, x), covariance(x, y)], [covariance(y, x), covariance(y, y)]]
    var center = [mean(x), mean(y)]
    var chol_decomp = cholesky(shape)
    chol_decomp = [[chol_decomp[0][0], chol_decomp[1][0]], [0, chol_decomp[1][1]]]

    var radius = Math.sqrt(dfn * jStat.centralF.inv(level, dfn, dfd))

    var angles = Array.apply(null, { length: segments + 1 }).map(Number.call, Number).map(x => x * 2 * (Math.PI / segments))
    var unit_circle = angles.map(x => [Math.cos(x), Math.sin(x)])
    var b = jStat(jStat.transpose(math.multiply(unit_circle, chol_decomp))).multiply(radius)

    var ellipse = []
    for (var i = 0; i < b.length; i++) {
      ellipse.push(b[i].map(x => center[i] + x))
    }
    return (ellipse)
  }
}
transparent_rgba = function (rgba, alpha = 0.1) {
  console.log(rgba)
  var splits = rgba.split(",")
  if (splits.length == 3) {
    var splits = rgba.split("(").map(x => x.split(")"))
    splits = splits[1]

    return ("rgba(" + [splits[0], alpha + ")"].join(","))
  } else {
    return ([splits[0], splits[1], splits[2], alpha + ")"].join(","))
  }

}
function trim(str) {
  return str.replace(/^\s+|\s+$/gm, '');
}
array_split_by_one_factor = function (array, fac, lev) {
  //fac = unpack(p.data,"species")
  var result = [];
  for (var l1 = 0; l1 < lev.length; l1++) {
    var target_level = lev[l1]
    result.push(getAllIndexes(fac, target_level).map(ind => array[ind]))
  }
  return (result)
}
function hexToRgb(hex, alpha) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 'rgba(' + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ',' + alpha + ')' : null;
}// from RGB color to hex code
function rgbaToHex(rgba) {
  if (rgba === null) {
    return (null)
  }

  var parts = rgba.substring(rgba.indexOf("(")).split(",")
  if (parts.length === 3) {
    r = parseInt(trim(parts[0].substring(1)), 10),
      g = parseInt(trim(parts[1]), 10),
      b = parseInt(trim(parts[2]), 10),
      a = "1.00"
  } else {
    r = parseInt(trim(parts[0].substring(1)), 10),
      g = parseInt(trim(parts[1]), 10),
      b = parseInt(trim(parts[2]), 10),
      a = parseFloat(trim(parts[3].substring(0, parts[3].length - 1))).toFixed(2);
  }



  r = r.toString(16).length == 1 ? "0" + r.toString(16) : r.toString(16)
  g = g.toString(16).length == 1 ? "0" + g.toString(16) : g.toString(16)
  b = b.toString(16).length == 1 ? "0" + b.toString(16) : b.toString(16)

  a = (a * 255).toString(16).substring(0, 2).length == 1 ? "0" + (a * 255).toString(16).substring(0, 2) : (a * 255).toString(16).substring(0, 2)


  return ('#' + r + g + b + a);
}
function colourNameToHex(colour) {
  var colours = {
    "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
    "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
    "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
    "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
    "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
    "honeydew": "#f0fff0", "hotpink": "#ff69b4",
    "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
    "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
    "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
    "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead", "navy": "#000080",
    "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
    "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
    "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
    "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00", "yellowgreen": "#9acd32"
  };

  if (typeof colours[colour.toLowerCase()] != 'undefined')
    return colours[colour.toLowerCase()];

  return false;
}
init_fileInput = function () {
  // FileInput
  //eval("$('.form-file-simple .inputFileVisible').click(function() {$(this).siblings('.inputFileHidden').trigger('click');});$('.form-file-simple .inputFileHidden').change(function() {var filename = $(this).val().replace(/C:\\fakepath\\/i, '');$(this).siblings('.inputFileVisible').val(filename);});$('.form-file-multiple .inputFileVisible, .form-file-multiple .input-group-btn').click(function() {$(this).parent().parent().find('.inputFileHidden').trigger('click');$(this).parent().parent().addClass('is-focused');});$('.form-file-multiple .inputFileHidden').change(function() {var names = '';for (var i = 0; i < $(this).get(0).files.length; ++i) {if (i < $(this).get(0).files.length - 1) {names += $(this).get(0).files.item(i).name + ',';} else {names += $(this).get(0).files.item(i).name;}}$(this).siblings('.input-group').find('.inputFileVisible').val(names);});$('.form-file-multiple .btn').on('focus', function() {$(this).parent().siblings().trigger('focus');});$('.form-file-multiple .btn').on('focusout', function() {$(this).parent().siblings().trigger('focusout');});")

  // FileInput
  $('.form-file-simple .inputFileVisible').click(function () {
    $(this).siblings('.inputFileHidden').trigger('click');
  });

  $('.form-file-simple .inputFileHidden').change(function () {
    var filename = $(this).val().replace(/C:\\fakepath\\/i, '');
    $(this).siblings('.inputFileVisible').val(filename);
  });

  $('.form-file-multiple .inputFileVisible, .form-file-multiple .input-group-btn').click(function () {
    $(this).parent().parent().find('.inputFileHidden').trigger('click');
    $(this).parent().parent().addClass('is-focused');
  });

  $('.form-file-multiple .inputFileHidden').change(function () {
    var names = '';
    for (var i = 0; i < $(this).get(0).files.length; ++i) {
      if (i < $(this).get(0).files.length - 1) {
        names += $(this).get(0).files.item(i).name + ',';
      } else {
        names += $(this).get(0).files.item(i).name;
      }
    }
    $(this).siblings('.input-group').find('.inputFileVisible').val(names);
  });

  $('.form-file-multiple .btn').on('focus', function () {
    $(this).parent().siblings().trigger('focus');
  });

  $('.form-file-multiple .btn').on('focusout', function () {
    $(this).parent().siblings().trigger('focusout');
  });
}

init_selectpicker = function () {
  $(".selectpicker").selectpicker();
}


loadjscssfile = function (filename, filetype) {
  if (filetype == "js") { //if filename is a external JavaScript file
    var fileref = document.createElement('script')
    fileref.setAttribute("type", "text/javascript")
    fileref.setAttribute("src", filename)
  }
  else if (filetype == "css") { //if filename is an external CSS file
    var fileref = document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filename)
  }
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref)
}





function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}


save_results = function (files_names, files_sources, files_types, fold_name, parameters, epf_index, compound_sample_index) {
  // 2. What to do after get all the Results.
  // if it is a project, need to ask user to select a folder first. Otherwise, just call save_results_to_project to save in a temp project.
  when_get_allResults_done = function (fold_name) {
    console.log(fold_name)
    var is_temp_project = parameter.project_id.includes("temp_project_")
    if (!is_temp_project) {
      ocpu.call("call_fun", {
        parameter: {
          project_id: parameter.project_id,
          selected_data: localStorage['activate_data_id'],
          fun_name: "open_project_structure_to_save_result"
        }
      }, function (session) {
        session.getObject(function (obj) {
          ooo = obj
          console.log(obj)
          $("#save_results_tree").jstree("destroy");
          $("#save_results_tree").jstree({
            'core': {
              'data': obj,
              'multiple': false, // cannot select multiple nodes.
              'expand_selected_onload': true,
              'check_callback': true
            }
          })
          current_fold_name = fold_name
          $('#save_results_tree').on("select_node.jstree", function (e, data) {
            current_fold_name = window["current_fold_name"]
            console.log(current_fold_name)
            ddd = data
            var selected_folder = data.node.original.id


            var children = $("#save_results_tree").jstree("get_children_dom", $("#save_results_tree").jstree("get_selected"));
            children_folder_names=[]
            for (var i = 0; i < children.length; i++) {
              children_folder_names[i] = children[i].innerText
            }
            
            if(children_folder_names.includes(current_fold_name)){
              
              var index = 2
              while(children_folder_names.includes(current_fold_name+index)){
                
                index++;
              }
              current_fold_name = current_fold_name + index
            }
            
            var current_fold_name = prompt("Please Enter a Folder Name.", current_fold_name);

            if(["\\","/",":","*","?","<",">","|"].some(el=>current_fold_name.includes(el))){
              alert("Error: folder name cannot contain any of the following '\\/:*?<>| '.")

              if(children_folder_names.includes(current_fold_name)){
                alert("Error: this destination already contains a fold name "+current_fold_name+".")
              }else{
                call_save_results_to_project_to_save(is_temp_project, selected_folder,current_fold_name)
              }
            }else{
              call_save_results_to_project_to_save(is_temp_project, selected_folder,current_fold_name)
            }
            

            
          })
        })
      })
    } else {
      var selected_folder = 'to_be_determined'
      call_save_results_to_project_to_save(is_temp_project, selected_folder, fold_name)
    }

  }
  call_save_results_to_project_to_save = function (is_temp_project, selected_folder, fold_name) {
    ocpu.call("call_fun", {
      parameter: {
        files_names: files_names,
        files_sources: files_sources,
        files_sources_data: allResults,
        files_types: files_types,
        fold_name: fold_name,
        parameters: parameters,
        epf_index: epf_index,
        compound_sample_index: compound_sample_index,
        project_id: project_id,
        selected_folder: selected_folder,
        fun_name: "save_results_to_project"
      }
    }, function (session) {
      console.log("save_results_to_project")
      console.log(session)
      session.getObject(function (obj) {
        if (obj.status) {
          console.log("success")
          if (!is_temp_project) {
            ocpu.call("call_fun", {
              parameter: {
                project_id: parameter.project_id,
                selected_data: localStorage['activate_data_id'],
                saved_folder_id: selected_folder,
                fun_name: "open_project_structure_after_save_result"
              }
            }, function (session) {
              session.getObject(function (obj) {
                ooo = obj
                $("#save_results_tree").jstree("destroy");
                $("#save_results_tree").jstree({
                  'core': {
                    'data': obj,
                    'multiple': false, // cannot select multiple nodes.
                    'expand_selected_onload': true,
                    'check_callback': true
                  }
                })
              })
            }).fail(function (e3) {
              Swal.fire('Oops...', e3.responseText, 'error')
            })
          } else {
            window.open(session.loc + "files/" + parameter.fun_name + " - result.zip");
          }
        }
      })
    }).fail(function (e2) {
      Swal.fire('Oops...', e2.responseText, 'error')
    })
  }
  console.log(files_sources)
  

  index_of_link = []
  index_of_not_link = []
  // check how many are links. not links include base64 plots.
  for (var i = 0; i < files_names.length; i++) {
    if (files_sources[i].substring(0, 4) === 'http') {
      index_of_link.push(i)
    } else {
      index_of_not_link.push(i)
    }
  }

  // 1. Get the allResults first.
  var files = files_sources;
  allResults = [];
  if (index_of_link.length === 0) { // if there is no csv files.
    //index_of_link[0] = 0
    console.log("no csv files detected")
    for (var j = 0; j < index_of_not_link.length; j++) {
      allResults.push({ fake: files_sources[index_of_not_link[j]] })
    }
    when_get_allResults_done(fold_name)
  } else {

    download_files = function (file_link) {
      Papa.parse(file_link, {
        download: true,
        header: true,
        skipEmptyLines: true,
        error: function (err, file, inputElem, reason) {
          console.log("save_results Error: ")
          console.log(err)
        },
        complete: function (results) {
          console.log(results)
          console.log("complete")
          allResults.push(results.data);


          if (allResults.length == index_of_link.length) {
            // Do whatever you need to do
            console.log("csv download finished. HERE")
            console.log(allResults)
            //console.log(data.node.original.id)
            for (var j = 0; j < index_of_not_link.length; j++) {
              allResults.push(files_sources[index_of_not_link[j]])
            }
            
            when_get_allResults_done(fold_name)
          } else {
            i = i + 1
            download_files(files[index_of_link[i]])
          }
        }
      });
    }

    var i = 0
    //while(i<index_of_link.length){

    file_link = files[index_of_link[i]]
    download_files(file_link)







  }
}







sequence = function (from = 0, to = 10) {
  var N = to - from;
  var seq = Array.apply(null, { length: N }).map(Function.call, Number);
  var result = seq.map(x => x + from)
  return (result)
}
function getAllIndexes(arr, val) {
  var indexes = [], i;
  for (i = 0; i < arr.length; i++)
    if (arr[i] === val)
      indexes.push(i);
  return indexes;
} // get all the indexes of value in an array https://stackoverflow.com/questions/20798477/how-to-find-index-of-all-occurrences-of-element-in-array
function sort(arr, desending = false) {
  if (desending) {
    return arr.concat().sort(function (a, b) { return b - a });
  } else {
    return arr.concat().sort();
  }

}
update_projects_table = function (id = "projects_table", select_call_back = "when_projects_table_click_selected", rename_call_back = "when_projects_table_click_renamed", delete_call_back = "when_projects_table_click_deleted") {
  console.log("HERE")
  console.log($("#projects_table").length)
  Papa.parse("https://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/" + localStorage['user_id'] + "/metda_userinfo_" + localStorage['user_id'] + ".csv", {
    download: true,
    complete: function (results) {
      rrr = results
      project_name_index = results.data[0].indexOf("project_name")

      project_names = results.data.map(x => x[project_name_index])
      project_names.shift()
      project_names.pop()


      if (results.data[1][0] === "") {
        table_html = "<small>You don't have any project yet. Create One!</small>"
      } else {
        var table_html = "<thead><tr>"
        for (var i = -1; i < results.data[0].length + 1; i++) {
          if (i === -1) {
            table_html = table_html + "<th class='text-center'>" + "#" + "</th>"
          } else if (i === results.data[0].length) {
            table_html = table_html + "<th class='disabled-sorting text-right'>" + "Actions" + "</th>"
          } else {
            table_html = table_html + "<th>" + results.data[0][i] + "</th>"
          }

        }
        table_html = table_html + "</tr></thead>"
        table_html = table_html + "<tfoot><tr>"
        for (var i = -1; i < results.data[0].length + 1; i++) {
          if (i === -1) {
            table_html = table_html + "<th class='text-center'>" + "#" + "</th>"
          } else if (i === results.data[0].length) {
            table_html = table_html + "<th class='disabled-sorting text-right'>" + "Actions" + "</th>"
          } else {
            table_html = table_html + "<th>" + results.data[0][i] + "</th>"
          }

        }
        table_html = table_html + "</tr></tfoot>"


        table_html = table_html + "<tbody>"
        for (var i = 1; i < results.data.length - 1; i++) {
          var current_project_id = results.data[i][0]


          table_html = table_html + "<tr>"
          for (var j = -1; j < results.data[i].length + 1; j++) {
            if (j === -1) {
              table_html = table_html + "<td class='text-center'>" + (j + 2) + "</td>"
            } else if (j === results.data[i].length) {
              table_html = table_html + "<td class='text-right'>"
              if (!select_call_back === false) {
                table_html = table_html + '<button class="btn btn-just-icon btn-link" title="Select This Project" onclick="' + select_call_back + '(\'' + current_project_id + '\')"> <i class="material-icons" style="color:green">check</i> </button>'
              }
              if (!rename_call_back === false) {
                table_html = table_html + '<button class="btn btn-just-icon btn-link" title="Rename This Project" onclick="' + rename_call_back + '(\'' + current_project_id + '\')"> <i class="material-icons" style="color:orange">edit</i> </button>'
              }
              if (!delete_call_back === false) {
                table_html = table_html + '<button class="btn btn-just-icon btn-link" title="Delete This Project" onclick="' + delete_call_back + '(\'' + current_project_id + '\')"> <i class="material-icons" style="color:red">close</i> </button>'
              }

              table_html = table_html + "</td>"
            } else {
              table_html = table_html + "<td>" + results.data[i][j] + "</td>"
            }

          }
          table_html = table_html + "</tr>"
        }
        table_html = table_html + "</tbody>"
        //console.log(table_html)
      }

      $("#" + id).html(table_html)
      //$("#" + id + " tr").click(call_back);


      if ($.fn.dataTable.isDataTable('#' + id)) {

        if (results.data[1][0] === "") {
          $("#" + id).DataTable().destroy();
          $("#" + id).html(table_html)
        }

      } else {
        $("#" + id).DataTable({
          "pagingType": "full_numbers",
          "lengthMenu": [
            [10, 25, 50, -1],
            [10, 25, 50, "All"]
          ],
          responsive: true,
          language: {
            search: "_INPUT_",
            searchPlaceholder: "Search records",
          }
        });
      }




    }
  });
}