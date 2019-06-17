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
        console.log(reason)
        $(".download").prop("disabled", false);
        $("#download_results").text("Download Results")
      },
      complete: function (results) {
        allResults.push(results);
        if (allResults.length == files_names.length) {
          var zip = new JSZip();
          for (var j = 0; j < files_names.length; j++) {
            zip.file(files_names[j], Papa.unparse(allResults[j]))
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

save_results = function (files_names, files_sources, files_types, fold_name,parameters,epf_index) {
  console.log(files_sources)
  $('#save_results_collapse').collapse('toggle')
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
        console.log("!!")

        ocpu.call("save_results_to_project", {
          files_names: files_names,
          files_sources: files_sources,
          files_types:files_types,
          fold_name: fold_name,
          parameters:parameters,
          epf_index:epf_index,
          project_id: localStorage['activate_project_id'],
          selected_folder: data.node.original.id
        }, function (session) {
          console.log(session)
        }).fail(function (e2) {
          Swal.fire('Oops...', e2.responseText, 'error')
        })
      })


    })
  }).fail(function (e) {
    Swal.fire('Oops...', e.responseText, 'error')
  })






}