templates_contents <- function(id = "missing_value_imputation") {
  # pacman::p_load(data.table)
  templates_contents <- read.csv("http://metda.fiehnlab.ucdavis.edu/db/templates/doc/templates_contents.csv")
  # id="missing_value_imputation"colnames(templates_contents)[1]='method_name'
  return(as.list(templates_contents[templates_contents[[1]] == id, ]))
}
