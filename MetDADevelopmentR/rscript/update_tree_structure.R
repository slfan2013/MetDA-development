# update_tree_structure = function(project_id, project_structure){

  # save(project_id, project_structure, file = "update_tree_structure.RData")

  # load("update_tree_structure.RData")
  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)



  for(i in 1:length(projectList$project_structure)){

    index = project_structure$id %in%  projectList$project_structure[[i]]$id
    if(sum(index) == 0){
      projectList$project_structure[[i]] = NA
    }else{
      projectList$project_structure[[i]]$text = project_structure$text[index]
    }


  }

  projectList$project_structure = projectList$project_structure[!is.na(projectList$project_structure)]




  if(exists("delete")){


    names_attachments = names(projectList$`_attachments`)



    structure_id = sapply(projectList$project_structure, function(x) x$id)

    projectList$`_attachments` = projectList$`_attachments`[which(names_attachments %in% structure_id)]

    }



  RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))



  result =  project_structure

  # return(TRUE)


# }
