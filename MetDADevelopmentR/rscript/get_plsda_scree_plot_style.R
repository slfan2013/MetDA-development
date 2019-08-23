# get_plsda_scree_plot_style = function(user_id){
userURL <- URLencode(
  paste0(
    "http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/",
    user_id
  )
)
userList <- jsonlite::fromJSON(userURL, simplifyVector = FALSE)

result = userList$plsda_scree_plot_layout
# }
