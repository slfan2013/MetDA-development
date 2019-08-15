console.log("data_subsetting_parameter_settings.js")

p_column_names = Object.keys(p[0])
p_column_unique = {}
p_column_unique_length = {}
p_column_type = {}

for(var i=0; i<p_column_names.length; i++){
    p_column_unique[p_column_names[i]] = unpack(p, p_column_names[i])
    p_column_unique_length[p_column_names[i]] = p_column_unique[p_column_names[i]].length
    p_column_type[p_column_names[i]] = jStat.sum(p_column_unique.SampleID.map(x=>Number(x)==NaN)) == 0? "Categorical":"Numeric"
}




    
// localStorage.activate_data_id
// project_id
ocpu.call("get_compound_sample_info",{
    project_id:project_id
},function(session){
    session.getObject(function(obj){
        ooo = obj
        sample_related_info_keys = Object.keys(obj.sample_related_info)
        sample_related_info = {}
        for(var i=0; i<sample_related_info_keys.length;i++){
            sample_related_info[sample_related_info_keys[i]] = {
                text:obj.sample_related_info[sample_related_info_keys[i]]['text'],
                column_names:obj.sample_related_info[sample_related_info_keys[i]]['column_names'],
                column_levels:obj.sample_related_info[sample_related_info_keys[i]]['column_levels'],
                column_type:obj.sample_related_info[sample_related_info_keys[i]]['column_type']
            }
        }
        // now I need to put the file names. if any changes, just change the ith div. ith file, ith columns, ith levels, ith type.




    })
})