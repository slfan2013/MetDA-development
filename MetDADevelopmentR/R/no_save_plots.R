save_plots = function(plot_base64, project_id="boxplot b31564960713"){
  save(plot_base64,project_id,file = "plot_base64.RData")


  load("plot_base64.RData")
  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = FALSE)

  attachments_ID = names(projectList$`_attachments`)


  times = names(plot_base64)
  for(i in 1:length(plot_base64)){
    current_time = times[i]
    plots = plot_base64[[current_time]]
    plots_name = names(plots)
    for(j in 1:length(plots)){
      plots_name_temp = strsplit(plots_name[j],"\\.")[[1]]
      name_without_suffix = paste0(plots_name_temp[1:(length(plots_name_temp)-1)])
      suffix = plots_name_temp[length(plots_name_temp)]

      id = paste0(name_without_suffix, current_time, ".", suffix)

      index = which(attachments_ID %in% id)


      projectList$`_attachments`[[id]] <- list(
        content_type = projectList$`_attachments`[[id]]$content_type,
        data = plots[[j]]
      )
    }
  }
  RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))


  return(TRUE)
}
