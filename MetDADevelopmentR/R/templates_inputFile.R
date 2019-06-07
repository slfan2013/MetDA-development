templates_inputFile = function(path="D:\\MetDA-development\\GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx"){
  if(grepl("http",path)){
    messages = get_data_and_message(URLencode(path))$message
  }else{
    messages = get_data_and_message(path)$message
  }
  return(messages)
}
