get_current_parameters <- function(current_parameters) {
  current_parameters <- sapply(current_parameters, function(x) {
    as.character(x)[2]
  }, simplify = FALSE)

  return(current_parameters)
}
