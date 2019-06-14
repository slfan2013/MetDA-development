/*
ocpu.call("load_project_overview",{
    project_id:localStorage['activate_project_id']
},function(session){
    session.getObject(function(obj){
        console.log(obj)

        $("#project_structure").jstree("destroy");
        $("#project_structure").jstree({'core':{
            'data':obj.project_structure,
            'multiple':false, // cannot select multiple nodes.
            'expand_selected_onload':true,
            'check_callback' : true
          },
          "plugins" : ["contextmenu","state"],
          
        })

    })
})
*/