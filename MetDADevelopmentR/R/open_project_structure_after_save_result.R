open_project_structure_after_save_result <- function(
  project_id,
  selected_data,
  saved_folder_id) {
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

    id_in_result <- sapply(result_project_structure, function(x) {
      x$id
    })
    result_project_structure[[which(id_in_result %in% saved_folder_id)]]$state <- list(
      opened = TRUE,
      selected = TRUE
    )
  }


  # put the new result_project_structure to CouChDB!!!
  # userinfoList$`_attachments`[["metda_userinfo_slfan.csv"]] <- list(
  #   projectList = "application/vnd.ms-excel",
  #   data = strsplit(markdown:::.b64EncodeFile("metda_userinfo_slfan.csv"), "base64,")[[1]][2]
  # )
  #
  # RCurl::getURL(userinfoUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(userinfoList, auto_unbox = TRUE, force = TRUE))


  return(result_project_structure)
}
