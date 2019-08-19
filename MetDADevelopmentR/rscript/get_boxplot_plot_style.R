# get_boxplot_plot_style = function(user_id){
  userURL <- URLencode(
    paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/",
      user_id
    )
  )
  userList <- jsonlite::fromJSON(userURL, simplifyVector = FALSE)

  result = userList$boxplot_plot_layout
  # return(userList$boxplot_plot_layout)
# }
