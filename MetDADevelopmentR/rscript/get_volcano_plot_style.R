# get_volcano_plot_style = function(user_id){
  userURL <- URLencode(
    paste0(
      "http://metda:metda@localhost:5985/metda_userinfo/",
      user_id
    )
  )
  userList <- jsonlite::fromJSON(userURL, simplifyVector = FALSE)

  result = userList$volcano_plot_layout
# }
