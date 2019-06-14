load_project_overview = function(project_id="aaa1560462496"){

  projectList = jsonlite::fromJSON(paste0("http://metda:metda@localhost:5985/metda_project/",project_id))

  return(list(project_structure = projectList$project_structure))

}
