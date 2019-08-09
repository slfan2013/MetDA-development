load_project_overview <- function(project_id = "new project31560542628") {
  projectList <- jsonlite::fromJSON(URLencode(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id
    )
  ))

  return(list(project_structure = projectList$project_structure))
}
