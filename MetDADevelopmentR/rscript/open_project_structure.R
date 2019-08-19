# open_project_structure <- function(
#   project_id,
#   selected_data) {



  projectList <- jsonlite::fromJSON(URLencode(
    paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id
    )
  ), simplifyVector = FALSE)


  project_structure <- projectList$project_structure


  if (selected_data == "") {
    result_project_structure <- project_structure
  } else {
    result_project_structure <- project_structure

    id <- sapply(project_structure, function(x) {
      x$id
    })
    # open_folder_id <- project_structure[[which(id %in% selected_data)]]$parent
    # id_in_result <- sapply(result_project_structure, function(x) {
    #   x$id
    # })
    result_project_structure[[which(id %in% selected_data)]]$state <- list(
      opened = TRUE,
      selected = TRUE
    )
  }

  result = result_project_structure
# }
