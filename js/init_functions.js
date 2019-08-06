
start_cal = function(){
  $("body").append('<div id="overlay" style="background-color:rgba(0,0,0,0.5);position:absolute;top:0;left:0;height:100%;width:100%;z-index:999"></div>');
}
end_cal = function(){
  $("#overlay").remove();
}

get_time_string = function(){
	var d = new Date();var time_string = d.getTime().toString()
	return(time_string)
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
array_split_by_one_factor = function(array,fac,lev){
  //fac = unpack(p.data,"species")
  var result = [];
  for(var l1=0; l1<lev.length;l1++){
      var target_level = lev[l1]
      result.push(getAllIndexes(fac,target_level).map(ind => array[ind]))
  }
  return(result)
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





download_results = function (files_names, files_sources, zipfile_name) {
  $(".download").prop("disabled", true);
  $("#download_results").text("Downloading ... ")

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


  if(index_of_link.length === 0){
    var zip = new JSZip();
    zip.file(files_names[index_of_not_link[0]], files_sources[index_of_not_link[0]], { base64: true });

    zip.generateAsync({ type: "blob" })
                .then(function (blob) {
                  if(zipfile_name.includes(".zip")){
                    saveAs(blob, zipfile_name);
                  }else{
                    saveAs(blob, zipfile_name + ".zip");
                  }
                  $(".download").prop("disabled", false);
                  $("#download_results").text("Download Results")
                });
  }else{
    var allResults = [];
    for (var i = 0; i < index_of_link.length; i++) {
      console.log(i)
      if (index_of_link.includes(i)) {// check if this is a link.
        Papa.parse(files_sources[index_of_link[i]], {
          download: true,
          header: true,
          skipEmptyLines: true,
          error: function (err, file, inputElem, reason) {
            console.log(reason)
            $(".download").prop("disabled", false);
            $("#download_results").text("Download Results")
          },
          complete: function (results) {
            allResults.push(results);
            if (allResults.length == index_of_link.length) {
              var zip = new JSZip();
              for (var j = 0; j < index_of_link.length; j++) {
                zip.file(files_names[index_of_link[j]], Papa.unparse(allResults[j]))
              }
  
              for (var j = 0; j < index_of_not_link.length; j++) {
                zip.file(files_names[index_of_not_link[j]], files_sources[index_of_not_link[j]], { base64: true });
              }
  
              zip.generateAsync({ type: "blob" })
                .then(function (blob) {
                  saveAs(blob, zipfile_name + ".zip");
                  $(".download").prop("disabled", false);
                  $("#download_results").text("Download Results")
                });
            }
          }
        })
      }
    }
  }


}





save_results = function (files_names, files_sources, files_types, fold_name, parameters, epf_index) {

  console.log(files_sources)
  console.log(fold_name)

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



  $('#save_results_collapse').collapse('show')
  $(".download").prop("disabled", true);
  $("#save_results").text("Waiting User to Select a Folder ... ")
  // open a jstree.


  ocpu.call("open_project_structure_to_save_result", {
    project_id: localStorage['activate_project_id'],
    selected_data: localStorage['activate_data_id']
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
      $('#save_results_tree').on("select_node.jstree", function (e, data) {

        var when_done = function(){
          ocpu.call("save_results_to_project", {
            files_names: files_names,
            files_sources: files_sources,
            files_sources_data: allResults,
            files_types: files_types,
            fold_name: fold_name,
            parameters: parameters,
            epf_index: epf_index,
            project_id: localStorage['activate_project_id'],
            selected_folder: data.node.original.id
          }, function (session) {
            console.log(session)
            session.getObject(function (obj) {
              if (obj.status) {
                console.log("success")
                //if this is epf, update the id = project_structure_with_dataset_only and id=save_results_tree
                ocpu.call("open_project_structure_after_save_result", {
                  project_id: localStorage['activate_project_id'],
                  selected_data: localStorage['activate_data_id'],
                  saved_folder_id: data.node.original.id
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
                }).fail(function (e2) {
                  Swal.fire('Oops...', e2.responseText, 'error')
                })
              }
            })
          }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
          })
        }


        ddd = data
        //fff = files_sources
        console.log("selected")
        if (window.location.href.includes("localhost")) {//otherwise it will have issue of https://github.com/opencpu/opencpu/issues/345
          var files = files_sources;
          allResults = [];
          if(index_of_link.length===0){
            index_of_link[0] = 0
          }

          for (var i = 0; i < index_of_link.length; i++) {
            Papa.parse(files[index_of_link[i]], {
              download: true,
              header: true,
              skipEmptyLines: true,
              error: function (err, file, inputElem, reason) { 
                if(err.message = "Not Found"){ // this means there is no index_of_link and I've made a fake 'fake.csv'
                console.log("here")
                for (var j = 0; j < index_of_not_link.length; j++) {
                  allResults.push({fake:files_sources[index_of_not_link[j]]})
                }
                
                when_done()

                }
              },
              complete: function (results) {
                console.log("complete")
                allResults.push(results.data);
                if (allResults.length == index_of_link.length) {
                  // Do whatever you need to do
                  console.log("HERE")
                  console.log(allResults)
                  console.log(data.node.original.id)

                  for (var j = 0; j < index_of_not_link.length; j++) {
                    allResults.push(files_sources[index_of_not_link[j]])
                  }

                  when_done()

                  
                }
              }
            });
          }
        } else {
          ocpu.call("save_results_to_project", {
            files_names: files_names,
            files_sources: files_sources,
            files_sources_data: 'not_useful',
            files_types: files_types,
            fold_name: fold_name,
            parameters: parameters,
            epf_index: epf_index,
            project_id: localStorage['activate_project_id'],
            selected_folder: data.node.original.id
          }, function (session) {
            console.log(session)
          }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
          })
        }






      })


    })
  }).fail(function (e) {
    Swal.fire('Oops...', e.responseText, 'error')
  })






}

sequence = function(from = 0, to = 10){
  var N = to-from;
  var seq = Array.apply(null, {length: N}).map(Function.call, Number);
  var result = seq.map(x=>x+from)
  return(result)
}
function getAllIndexes(arr, val) {
  var indexes = [], i;
  for(i = 0; i < arr.length; i++)
      if (arr[i] === val)
          indexes.push(i);
  return indexes;
} // get all the indexes of value in an array https://stackoverflow.com/questions/20798477/how-to-find-index-of-all-occurrences-of-element-in-array
function sort(arr,desending=false) {
  if(desending){
    return arr.concat().sort(function(a, b){return b-a});
  }else{
    return arr.concat().sort();
  }

}
update_projects_table = function (id = "projects_table", call_back = when_projects_table_clicked) {
  console.log("HERE")
  console.log($("#projects_table").length)
  Papa.parse("http://localhost:5985/metda_userinfo/" + localStorage['user_id'] + "/metda_userinfo_" + localStorage['user_id'] + ".csv", {
    download: true,
    complete: function (results) {
      var table_html = "<thead>"
      for (var i = 0; i < results.data[0].length; i++) {
        table_html = table_html + "<th>" + results.data[0][i] + "</th>"
      }
      table_html = table_html + "</thead>"
      table_html = table_html + "<tbody>"
      for (var i = 1; i < results.data.length; i++) {
        table_html = table_html + "<tr>"
        for (var j = 0; j < results.data[i].length; j++) {
          table_html = table_html + "<td>" + results.data[i][j] + "</td>"
        }
        table_html = table_html + "</tr>"
      }
      table_html = table_html + "</tbody>"
      //console.log(table_html)
      $("#" + id).html(table_html)
      $("#" + id + " tr").click(call_back);
    }
  });
}