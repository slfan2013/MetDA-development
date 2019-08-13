call_fun_temp <- function(parameter, ...) {
  save(parameter, file = "call_fun.RData") # for debugging


  # load("call_fun.RData")
  # parameter_names <- names(parameter)
  #
  #
  # for (i in 1:length(parameter)) {
  #   assign(parameter_names[i], parameter[[parameter_names[i]]])
  # }
  #
  # fileName <- URLencode(paste0("http://metda:metda@localhost:5985/metda_rscript/rscript/", fun_name, ".R"))
  #
  # eval(parse(text = gsub("\r", "", readr::read_file(fileName))))
  #
  # return(result)



  return(TRUE)
}


