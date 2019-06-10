templates_inputFile = function(path="D:\\MetDA-development\\GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx"){
  if(grepl("http",path)){
    result = get_data_and_message(URLencode(path))
  }else{
    result = get_data_and_message(path)
  }


  # now create a temp project to store currently working data.
  temp_project_id = paste0("temp_project_",as.integer(Sys.time()))
  projectUrl = URLencode(paste0("http://metda:metda@localhost:5985/metda_project/",temp_project_id))
  projectList = list(a = temp_project_id,b = "1-967a00dff5e02add41819138abb3284d",e = result$e_matrix, f = result$f, p = result$p)
  names(projectList)[1:2] = c("_id","_rev")


  RCurl::getURL(projectUrl,customrequest='PUT',httpheader=c('Content-Type'='application/json'),postfields=jsonlite::toJSON(projectList,auto_unbox = TRUE, force = TRUE))



  return(list(message = result$message,project_id = temp_project_id))
}
