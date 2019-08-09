# get_heatmap_plot_style = function(user_id){
  userURL <- URLencode(
    paste0(
      "http://metda:metda@localhost:5985/metda_userinfo/",
      user_id
    )
  )
  userList <- jsonlite::fromJSON(userURL, simplifyVector = FALSE)

  result = userList$heatmap_plot_layout
  # return(userList$heatmap_plot_layout)
# }
