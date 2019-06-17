revalue = function(vector, old_value, new_value){



  return(sapply(vector,function(x){
    eval(parse(text = paste0("switch(x,",paste0(paste0("'",old_value,"'='",new_value,"'"),collapse = ","),")")))
  }))
}

