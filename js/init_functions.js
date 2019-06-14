init_ripples = function () {
  $.material.init()
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



results_card_body_load = function (page, obj, session) {//multiple pages may use one page style.
  if (['missing_value_imputation'].includes(page)) {
    $("#results_card_body").load("one_top_description_bottom_table.html", function () {
      init_selectpicker
      var append_results_fun = window[window.location.href.split("#")[1] + "_append_results"];
      append_results_fun(obj, session)
    })
  }
}



download_results = function (files_names, files_sources, zipfile_name) {
  $(".download").prop("disabled", true);
  $("#download_results").text("Downloading ... ")
  var allResults = [];
  for (var i = 0; i < files_names.length; i++) {
    console.log(i)
    Papa.parse(files_sources[i], {
      download: true,
      header: true,
      skipEmptyLines: true,
      error: function (err, file, inputElem, reason) {
        alert("Papa.parse error: " + reason)
        $(".download").prop("disabled", false);
        $("#download_results").text("Download Results")
      },
      complete: function (results) {
        allResults.push(results.data);
        if (allResults.length == files_names.length) {
          var zip = new JSZip();
          for (var j = 0; j < files_names.length; j++) {
            zip.file(files_names[j], Papa.unparse(allResults[j]))
          }
          //zip.file("Partial Correlations "+time_stamp+".csv", Papa.unparse(oo.data_matrix2))
          zip.generateAsync({ type: "blob" })
            .then(function (blob) {
              saveAs(blob, zipfile_name);
              $(".download").prop("disabled", false);
              $("#download_results").text("Download Results")
            });
        }
      }
    })
  }
}



function unpack(rows, key) {

  for(var i=0; i<rows.length;i++){
    if(rows[i] === null){
      rows[i] = ""
    }
  }

    return rows.map(function(row)
    { return row[key]; });
}