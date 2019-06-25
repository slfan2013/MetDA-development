save_score_plot_style <- function(method, style, user_id) {
  # save(method, style,file = "test.RData")
  userURL <- URLencode(
    paste0(
      "http://metda:metda@localhost:5985/metda_userinfo/",
      user_id
    )
  )
  userList <- jsonlite::fromJSON(userURL, simplifyVector = FALSE)


  userList$pca_score_plot_layout <- style


  RCurl::getURL(userURL, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(userList, auto_unbox = TRUE, force = TRUE))

  return(TRUE)
}
