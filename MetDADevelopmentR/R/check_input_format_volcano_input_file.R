check_input_format_volcano_input_file <- function(path = "volcano_plot_input.csv") {

  save(path, file = "check_input_format_volcano_input_file.RData")

  load("check_input_format_volcano_input_file.RData")
  result = data.table::fread(path)

  if(sum(!c("label", "p_values", "fold_changes") %in% colnames(result))>1){
    stop("You are missing at least one of the columns, label, p-values, and (or) fold_changes.")
  }


  ### --  now create a temp project to store currently working data.
  temp_project_id <- paste0("temp_project_", as.integer(Sys.time()))
  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", temp_project_id))
  projectList <- list(a = temp_project_id, b = "1-967a00dff5e02add41819138abb3284d")
  names(projectList)[1:2] <- c("_id", "_rev")
  RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))


  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", temp_project_id))
  projectList <- jsonlite::fromJSON(projectUrl)
  e <- result
  write.csv(e, path, row.names = FALSE)
  projectList[["_attachments"]][[path]] <- list(
    content_type = "application/vnd.ms-excel",
    data = gsub("data:text/csv;base64,", "", markdown:::.b64EncodeFile(path))
  )
  RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))


  result = list()
  result$message = list()

  result$message$success_message = "Succeed"
  result$message$warning_message = ""

  return(list(message = result$message, project_id = temp_project_id))
  return(TRUE)
}
