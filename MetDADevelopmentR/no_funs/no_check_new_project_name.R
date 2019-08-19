check_new_project_name <- function(user_id = "slfan", new_name = "project1") {
  meta_userinfo <- read.csv(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/slfan/metda_userinfo_", user_id, ".csv")))

  if (new_name %in% meta_userinfo$project_name) {
    stop(paste0("The Project Name: ", new_name, " Has Already Been Taken. Please try another one."))
  } else {
    return("good")
  }
}
