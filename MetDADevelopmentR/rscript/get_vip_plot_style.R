# get_vip_plot_style = function(user_id){
userURL <- URLencode(
  paste0(
    "http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/",
    user_id
  )
)
userList <- jsonlite::fromJSON(userURL, simplifyVector = T, flatten = TRUE)

result = userList$vip_plot_layout
