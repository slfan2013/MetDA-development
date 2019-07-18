preview_result_structure <- function(
                                     project_id = "test21563210075",
                                     selected_data = "e.csv",
                                     project_id2 = "test31563293566",
                                     selected_data2 = "e.csv") {

  structures = get_to_be_added_structure(project_id,
                            selected_data,
                            project_id2,
                            selected_data2)
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

  included_sample_info <- sapply(structure_to_be_added_folders_only, function(x) intersect(unlist(x$parameter), colnames_p2))

  structure_to_be_added_folders_only_ids <- structure_to_be_added_folders_only_ids[sapply(included_sample_info, length) > 0]
  included_sample_info <- included_sample_info[sapply(included_sample_info, length) > 0]



  to_be_specified[["sample_info"]] <- c(to_be_specified[["sample_info"]], sapply(by(structure_to_be_added_folders_only_ids, unlist(included_sample_info), function(x) x), function(x) x, simplify = F))




  return(list(result_project_structure = result_project_structure, to_be_specified = to_be_specified))
}
