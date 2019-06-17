open_project_structure_to_save_result <- function(
                                                  project_id,
                                                  selected_data) {
  projectList <- jsonlite::fromJSON(URLencode(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id
    )
  ), simplifyVector = FALSE)


  project_structure <- projectList$project_structure

  needed_folder <- sapply(project_structure, function(x) {
    x$icon == "fa fa-folder"
  })



  if (selected_data == "") {
    result_project_structure <- project_structure[needed_folder]
  } else {
    result_project_structure <- project_structure[needed_folder]

    id <- sapply(project_structure, function(x) {
      x$id
    })
    open_folder_id <- project_structure[[which(id %in% selected_data)]]$parent
    id_in_result <- sapply(result_project_structure, function(x) {
      x$id
    })
    result_project_structure[[which(id_in_result %in% open_folder_id)]]$state <- list(
      opened = TRUE,
      selected = TRUE
    )
  }

  return(result_project_structure)
}
