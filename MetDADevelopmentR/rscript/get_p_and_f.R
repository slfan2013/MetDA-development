# get_p_and_f = function(project_id){



pacman::p_load(data.table)

if(!exists("return_projectList")){
  return_projectList = FALSE
}


data = call_fun(parameter = list(project_id=project_id,activate_data_id=activate_data_id,fun_name="read_data_from_projects"))
e = data$e
f = data$f
p = data$p


#
#
#   # 1 read the  project.
#   projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
#   projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)
#
#
#
#   which_p = which(sapply(projectList$project_structure,function(x){
#     identical(x$epf,'p')
#   }))
#   p = data.table::fread(paste0(projectUrl, "/",projectList$project_structure[[which_p]]$id))
#
#
#   which_f = which(sapply(projectList$project_structure,function(x){
#     identical(x$epf,'f')
#   }))
#   f = data.table::fread(paste0(projectUrl, "/",projectList$project_structure[[which_f]]$id))
if(return_projectList){
  result = list(p = p, f = f, projectList= projectList)

}else{
  result = list(p = p, f = f)

}
# }
