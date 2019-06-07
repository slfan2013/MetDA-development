templates_comtents = function(id="missing_value_imputation"){
  # pacman::p_load(data.table)
  templates_comtents = read.csv("http://127.0.0.1:5985/test/doc/templates_comtents.csv")
  colnames(templates_comtents)[1]='id'
  return(as.list(templates_comtents[templates_comtents[[1]] == id,]))
}
