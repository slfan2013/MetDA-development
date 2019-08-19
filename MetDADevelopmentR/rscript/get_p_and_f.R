# get_p_and_f = function(project_id){
  # 1 read the  project.
  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)



  which_p = which(sapply(projectList$project_structure,function(x){
    identical(x$epf,'p')
  }))
  p = data.table::fread(paste0(projectUrl, "/",projectList$project_structure[[which_p]]$id))


  which_f = which(sapply(projectList$project_structure,function(x){
    identical(x$epf,'f')
  }))
  f = data.table::fread(paste0(projectUrl, "/",projectList$project_structure[[which_f]]$id))


  result = list(p = p, f = f, projectList= projectList)
# }
