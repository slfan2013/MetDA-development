# save_volcano_plot_style <- function(method, style, user_id) {
  save(method, style,user_id,file = "test.RData")
  userURL <- URLencode(
    paste0(
      "http://metda:metda@localhost:5985/metda_userinfo/",
      user_id
    )
  )
  userList <- jsonlite::fromJSON(userURL, simplifyVector = FALSE)


  for(i in 1:length(style$traces)){
    style$traces[[names(style$traces)[i]]] = sapply(style$traces[[i]], function(x){
      if(class(x) == "character"){

        return(c(x))

      }else if(class(x) == "matrix"){
        return(x[,1])
      }
    }, simplify = F)

    if(length(style$traces[[names(style$traces)[i]]])==1){
      style$traces[[names(style$traces)[i]]] = as.character(style$traces[[names(style$traces)[i]]])
    }
  }

  userList$volcano_plot_layout <- style


  RCurl::getURL(userURL, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(userList, auto_unbox = TRUE, force = TRUE))

  result = TRUE
# }
