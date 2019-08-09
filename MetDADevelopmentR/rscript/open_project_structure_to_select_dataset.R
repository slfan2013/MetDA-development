# open_project_structure_to_select_dataset = function(
#   project_id = "fdeq1560538867",
#   selected_data = "result dataset1562687052.csv"
# ){
  save(project_id, selected_data, file = "test.RData")

  projectList <- jsonlite::fromJSON(URLencode(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id
    )
  ),simplifyVector = FALSE)


  project_structure = projectList$project_structure


  epf = sapply(project_structure,function(x){x$epf})
  id = sapply(project_structure,function(x){x$id})
  parent = sapply(project_structure,function(x){x$parent})



  needed_id = id[epf %in% "e"]
  parents = parent[epf %in% "e"]

  while(length(parents)>0){
    needed_id = c(needed_id, parents)
    parents = parent[id %in% parents]
  }

  if(selected_data == ""){
    result_project_structure = project_structure[id %in% needed_id]
  }else{
    result_project_structure = project_structure[id %in% needed_id]


    result_id = sapply(result_project_structure, function(x){x$id})
    result_project_structure[[which(result_id %in% selected_data)]]$state = list(
      opened = TRUE,
      selected = TRUE
    )


  }

  p = data.table::fread(paste0("http://metda:metda@localhost:5985/metda_project/",project_id,"/p.csv"))
  f = data.table::fread(paste0("http://metda:metda@localhost:5985/metda_project/",project_id,"/f.csv"))
  e = data.table::fread(paste0("http://metda:metda@localhost:5985/metda_project/",project_id,"/",selected_data))

  p = p[p$label %in% colnames(e),]
  f = f[f$label %in% e[[1]],]


  result = list(result_project_structure = result_project_structure, p = p, f = f)

  # return(TRUE)



# }
