# preview_result_structure <- function(
#   project_id = "volcano b11565063656",
#   selected_data = "e.csv",
#   project_id2 = "volcano a21565064215",
#   selected_data2 = "e.csv") {

  save(project_id, selected_data, project_id2, selected_data2, file = "preview_result_structure.RData")

  load("preview_result_structure.RData")
  # structures = get_to_be_added_structure(project_id,
  #                           selected_data,
  #                           project_id2,
  #                           selected_data2)
  structures = call_fun(parameter = list(
    project_id = project_id,
    selected_data = selected_data,
    project_id2 = project_id2,
    selected_data2 = selected_data2,
    fun_name = "get_to_be_added_structure"
  ))
  project_structure = structures$project_structure
  structure_to_be_added = structures$structure_to_be_added
  result_project_structure <- c(project_structure, structure_to_be_added)


  to_be_specified <- list()
  to_be_specified[["sample_info"]] <- list()
  p2 <- data.table::fread(paste0("http://127.0.0.1:5985/metda_project/", project_id2, "/p.csv"))
  colnames_p2 <- colnames(p2)
  # perform the statistical analysis.
  added_icons <- sapply(structure_to_be_added, function(x) {
    x$icon
  }) # study nodes with icon folder because its children have same parameters.
  structure_to_be_added_folders_only <- structure_to_be_added[added_icons == "fa fa-folder"]
  structure_to_be_added_folders_only_ids <- sapply(structure_to_be_added_folders_only, function(x) x$id)

  structure_to_be_added_folders_only_fun_names = sapply(structure_to_be_added_folders_only, function(x) x$parameter$fun_name)
  names(structure_to_be_added_folders_only_fun_names) = structure_to_be_added_folders_only_ids

  included_sample_info <- sapply(structure_to_be_added_folders_only, function(x) intersect(unlist(x$parameter), colnames_p2), simplify = F)


  structure_to_be_added_folders_only_ids = rep(structure_to_be_added_folders_only_ids,sapply(included_sample_info, length))


  # structure_to_be_added_folders_only_ids <- structure_to_be_added_folders_only_ids[sapply(included_sample_info, length) > 0]

  included_sample_info <- included_sample_info[sapply(included_sample_info, length) > 0]

  if(length(structure_to_be_added_folders_only_ids)==0){
    to_be_specified[["sample_info"]] <- ""
    p1 = ""
  }else{
    to_be_specified[["sample_info"]] <- c(to_be_specified[["sample_info"]], sapply(by(structure_to_be_added_folders_only_ids, unlist(included_sample_info), function(x) {
      x
    }, simplify = FALSE), function(x) x, simplify = F))


    if(any(grepl("Data Subsetting",structure_to_be_added_folders_only_ids))){
      stop("Sorry. The Project has a data subset by the sample info, thus is cannot be performed automatically using one-click module. Please manually create these datasets and use them for one-click module.")
      p1 <- data.table::fread(paste0("http://127.0.0.1:5985/metda_project/", project_id, "/p.csv"))
    }else{
      p1 = ""
    }


  }









  f2 <- data.table::fread(paste0("http://localhost:5985/metda_project/", project_id2, "/f.csv"))
  colnames_f2 <- colnames(f2)


  included_compound_info <- sapply(structure_to_be_added_folders_only, function(x) intersect(unlist(x$parameter), colnames_f2), simplify = F)


  structure_to_be_added_folders_only_ids <- sapply(structure_to_be_added_folders_only, function(x) x$id)
  structure_to_be_added_folders_only_ids = rep(structure_to_be_added_folders_only_ids,sapply(included_compound_info, length))

  included_compound_info <- included_compound_info[sapply(included_compound_info, length) > 0]


  if(length(structure_to_be_added_folders_only_ids)==0){
    to_be_specified[["compound_info"]] <- ""
    f1 = ""
  }else{
    to_be_specified[["compound_info"]] <- c(to_be_specified[["compound_info"]], sapply(by(structure_to_be_added_folders_only_ids, unlist(included_compound_info), function(x) x, simplify = FALSE), function(x) x, simplify = F))

    if(any(grepl("Data Subsetting",structure_to_be_added_folders_only_ids))){
      stop("Sorry. The Project has a data subset by the compound info, thus is cannot be performed automatically using one-click module. Please manually create these datasets and use them for one-click module.")
      f1 <- data.table::fread(paste0("http://127.0.0.1:5985/metda_project/", project_id, "/f.csv"))
    }else{
      f1 = ""
    }

  }


  result = list(result_project_structure = result_project_structure, to_be_specified = to_be_specified, p1 = p1, f1 = f1)


#   return(TRUE)
# }
