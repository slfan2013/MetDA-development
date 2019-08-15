inputFile <- function(path = "D:\\MetDA-development\\MetDADevelopmentR\\GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx") {
  if (grepl("http", path)) {
    # result <- get_data_and_message(URLencode(path))

  result = call_fun(parameter = list(
    path = URLencode(path),
    fun_name = "get_data_and_message"
  ))


  } else {
    # result <- get_data_and_message(path)
    result = call_fun(parameter = list(
      path = path,
      fun_name = "get_data_and_message"
    ))
  }
  ### --  now create a temp project to store currently working data.
  temp_project_id <- paste0("temp_project_", as.integer(Sys.time()))
  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", temp_project_id))
  projectList <- list(a = temp_project_id, b = "1-967a00dff5e02add41819138abb3284d")
  names(projectList)[1:2] <- c("_id", "_rev")
  RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))


  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", temp_project_id))
  projectList <- jsonlite::fromJSON(projectUrl)
  e <- result$e_matrix
  f <- result$f
  p <- result$p

  write.csv(e, "e.csv", row.names = f$label)
  write.csv(f, "f.csv", row.names = FALSE)
  write.csv(p, "p.csv", row.names = FALSE)
  projectList[["_attachments"]] <- list()
  projectList[["_attachments"]][["e.csv"]] <- list(
    content_type = "application/vnd.ms-excel",
    data = gsub("data:text/csv;base64,", "", markdown:::.b64EncodeFile("e.csv"))
  )
  projectList[["_attachments"]][["f.csv"]] <- list(
    content_type = "application/vnd.ms-excel",
    data = gsub("data:text/csv;base64,", "", markdown:::.b64EncodeFile("f.csv"))
  )
  projectList[["_attachments"]][["p.csv"]] <- list(
    content_type = "application/vnd.ms-excel",
    data = gsub("data:text/csv;base64,", "", markdown:::.b64EncodeFile("p.csv"))
  )



  current_parameters <- call_fun(list(current_parameters = as.list(match.call())[-1], fun_name = "get_current_parameters"))
  projectList[["project_structure"]] <- list(
    list(
      id = temp_project_id,
      parent = "#",
      text = temp_project_id,
      icon = "fa fa-folder"
    ),
    list(
      id = "e.csv",
      parent = temp_project_id,
      text = "e.csv",
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      epf = "e",
      parameter = list(
        r_function = "create_new_project",
        parameters = current_parameters
      )
    ),
    list(
      id = "f.csv",
      parent = temp_project_id,
      text = "f.csv",
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      epf = "f",
      parameter = list(
        r_function = "create_new_project",
        parameters = current_parameters
      ),
      subset = c("compound")
    ),
    list(
      id = "p.csv",
      parent = temp_project_id,
      text = "p.csv",
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      epf = "p",
      parameter = list(
        r_function = "create_new_project",
        parameters = current_parameters
      ),
      subset = c("sample")
    )
  )




  RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))


  return(list(message = result$message, project_id = temp_project_id, p = p, f = f))
}
