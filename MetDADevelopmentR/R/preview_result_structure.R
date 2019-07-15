preview_result_structure <- function(
                                     project_id = "bbb1560533346",
                                     selected_data = "e.csv",
                                     project_id2 = "test11563203482",
                                     selected_data2 = "result dataset1563203546.csv") {
  projectList <- jsonlite::fromJSON(URLencode(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id
    )
  ), simplifyVector = FALSE)


  project_structure <- projectList$project_structure


  id <- sapply(project_structure, function(x) {
    x$id
  })
  parents <- sapply(project_structure, function(x) {
    x$parent
  })

  project_structure[[which(id %in% selected_data)]]$state <- list(
    opened = TRUE,
    selected = TRUE
  )

  selected_data_parent <- parents[id %in% selected_data]

  projectList2 <- jsonlite::fromJSON(URLencode(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id2
    )
  ), simplifyVector = FALSE)


  project_structure2 <- projectList2$project_structure

  id2 <- sapply(project_structure2, function(x) {
    x$id
  })

  activate_data_ids2 <- sapply(project_structure2, function(x) {
    x$parameter$activate_data_id
  })

  icons2 <- sapply(project_structure2, function(x) {
    x$icon
  })

  parents2 <- sapply(project_structure2, function(x) {
    x$parent
  })
  selected_data2_parent2 <- parents2[id2 %in% selected_data2]

  round <- 1
  needed_id2 <- c()
  being_activated_data_id2 <- c()
  being_activated_data_id2[1] <- selected_data2
  while (length(being_activated_data_id2) > 0) {
    needed_id2 <- c(needed_id2, being_activated_data_id2)
    print(round)
    print(being_activated_data_id2)
    being_activated_data_id2 <- id2[activate_data_ids2 %in% being_activated_data_id2]
    round <- round + 1
  }
  needed_id2 <- needed_id2[!needed_id2 %in% selected_data2]
  structure_to_be_added <- project_structure2[id2 %in% needed_id2]
  for (i in 1:length(structure_to_be_added)) {
    if (structure_to_be_added[[i]]$parent == selected_data2_parent2) {
      structure_to_be_added[[i]]$parent <- selected_data_parent
    }

    structure_to_be_added[[i]]$li_attr <- list(
      class = "text-danger"
    )

    structure_to_be_added[[i]]$state <- list(
      opened = TRUE
    )
  }





  result_project_structure <- c(project_structure, structure_to_be_added)

  return(result_project_structure)
}
