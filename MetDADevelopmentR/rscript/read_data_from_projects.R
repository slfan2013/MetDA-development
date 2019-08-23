# read_data_from_projects = function(project_id, activate_data_id){
  f = read.csv(URLencode(paste0(
    "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
    project_id,
    "/f.csv"
  )), stringsAsFactors = FALSE)
  p = read.csv(URLencode(paste0(
    "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
    project_id,
    "/p.csv"
  )), stringsAsFactors = FALSE)

  e = read.csv(
    URLencode(paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/",activate_data_id
    ))
    ,row.names  = 1)


  f = f[f$label %in% rownames(e),]
  p = p[p$label %in% colnames(e),]

  e = data.matrix(e)

  e = call_fun(parameter = list(e = e, fun_name="deal_with_missing_values"))


  f = f[f$label %in% rownames(e),]
  p = p[p$label %in% colnames(e),]

  result = list(f=f,p=p,e=e)

# }
