console.log("project_overview.js")

var update_jstree = function (project_structure) {
    $("#project_structure").jstree("destroy");
    $("#project_structure").jstree({
        'core': {
            'data': project_structure,
            'multiple': false, // cannot select multiple nodes.
            'expand_selected_onload': true,
            'check_callback': true
        },
        "plugins": ["contextmenu", "state"],
        "contextmenu": {// content when user right click a node.
            "show_at_node": true, // the menu follows the mouse.
            'items': function ($node) {
                clicked_node = JSON.parse(JSON.stringify($node));
                // define what can be done on a node.
                var renameable = true; // except root.
                var removeable = true; // except root.
                var downloadable = true; // everything is downloadable.
                if ($node.parent == '#') {
                    renameable = false;
                    removeable = false;
                }
                if ($node.icon == "fa fa-folder") {

                }
                var tree = $("#project_structure").jstree(true);
                var items = {
                    "Rename": {
                        "label": "Rename",
                        "icon": 'fa fa-edit',
                        "_disabled": !renameable,
                        "action": function (obj) {
                            tree.edit($node, null, function (node) {
                                start_cal()
                                nnn = node
                                console.log("trying to rename.")
                                //start_cal()
                                old_node = JSON.parse(JSON.stringify(node))
                                ocpu.call("call_fun", {parameter:{
                                    project_id: localStorage.activate_project_id,
                                    fun_name:"get_tree_structure"
                                }}, function (session) {
                                    console.log(session)
                                    session.getObject(function (obj) {
                                        jjj = obj
                                        old_node = clicked_node;
                                        new_name = node.text;
                                        old_id = old_node.id;
                                        old_name = old_node.text;
                                        old_parent = old_node.parent;
                                        sibling_node_indexes = getAllIndexes(unpack(obj, 'parent'), old_parent)
                                        all_node_text = unpack(obj, 'text')
                                        sibling_names = sibling_node_indexes.map(x => all_node_text[x])

                                        if (sibling_names.includes(new_name)) {
                                            alert("The name " + new_name + " is already taken.")
                                            update_jstree(project_structure)
                                            end_cal()
                                        } else {
                                            // delete the old node from the three. Add new node to the tree. When making new id, make sure that all the children can still find their parent.
                                            //timestamp = get_time_string();
                                            if ($node.icon === 'fa fa-folder') {
                                                //new_id = new_name + clicked_node.id.slice(-10)
                                            } else {
                                                //new_id = new_name
                                                suffix = old_name.split(".")[old_name.split(".").length-1]
                                                if(!new_name.includes("."+suffix)){
                                                    Swal.fire('File Extension Error', "You must keep the file extension of "+"."+suffix+". Otherwise, the file will be unusable.", 'error')
                                                    end_cal()
                                                    update_jstree(project_structure)
                                                    return;
                                                }
                                            }
                                            // change old node id.
                                            old_node_index = unpack(obj, "id").indexOf(old_id)
                                            //obj[old_node_index].id = new_id;
                                            obj[old_node_index].text = new_name;
                                            /*children_node_indexes = getAllIndexes(unpack(obj, 'parent'), old_id)
                                            for (var i = 0; i < children_node_indexes.length; i++) {
                                                obj[children_node_indexes[i]].parent = new_id
                                            }*/
                                            ocpu.call("call_fun", {parameter:{
                                                project_id: localStorage.activate_project_id,
                                                project_structure: obj,
                                                fun_name:"update_tree_structure"
                                            }}, function (session) {
                                                console.log(session)
                                                session.getObject(function (obj) {
                                                    uu = obj
                                                    update_jstree(obj)
                                                    end_cal()
                                                })
                                            }).fail(function (e) {
                                                Swal.fire('Oops...', e.responseText, 'error')
                                                end_cal()
                                            })


                                        }
                                    })
                                })


                            })
                        }
                    },
                    "Remove": {
                        "label": "Delete",
                        "icon": "fa fa-trash-o",
                        "_disabled": !removeable,
                        "action": function (obj) {
                            bbb = obj
                            //var r = confirm("Are you sure you want to remove '"+bbb.reference[0].innerText+"' and all its children files?");
                            const swalWithBootstrapButtons = Swal.mixin({
                                customClass: {
                                    confirmButton: 'btn btn-success',
                                    cancelButton: 'btn btn-danger'
                                },
                                buttonsStyling: false,
                            })
                            swalWithBootstrapButtons.fire({
                                title: 'Are you sure?',
                                text: "Are you sure you want to remove '" + obj.reference[0].innerText + "' and all its children files? After removal, it would be able to recover!",
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Yes, delete it!',
                                cancelButtonText: 'No, cancel!',
                                reverseButtons: true
                            }).then((result) => {
                                if (result.value) {
                                    var selected_node_id = obj.reference[0].id.substring(0, obj.reference[0].id.length - '_anchor'.length);
                                    console.log(selected_node_id)
                                    start_cal()
                                    ocpu.call("call_fun", {parameter:{
                                        project_id: localStorage.activate_project_id,
                                        fun_name:"get_tree_structure"
                                    }}, function (session) {
                                        console.log("get_tree_structure")
                                        session.getObject(function (obj) {
                                            ooo = obj
                                            
                                            var remove_index = [];
                                            var bad_id = [];
                                            bad_id.push(selected_node_id)
                                            //var saved_index;
                                            for (var i = 0; i < obj.length; i++) {
                                                if (bad_id.indexOf(obj[i].id) > -1) {// is the node is a bamakeProjectListTableHTMLd id, remove this node.
                                                    remove_index.push(i)
                                                    saved_index = obj[i].id
                                                }
                                                if (bad_id.indexOf(obj[i].parent) > -1) {
                                                    remove_index.push(i)
                                                    bad_id.push(obj[i].id)
                                                }
                                            }

                                            if(bad_id.includes(localStorage.activate_data_id)){
                                                localStorage.activate_data_id = 'e.csv'
                                            }

                                            for (var i = remove_index.length - 1; i > -1; i--) {
                                                if (obj[remove_index[i]].attachment_id !== undefined) { // delete attachment as well
                                                    delete doc._attachments[[obj[remove_index[i]].attachment_id]]
                                                }
                                                obj.splice(remove_index[i], 1)
                                            }

                                            ocpu.call("call_fun", {parameter:{
                                                project_id: localStorage.activate_project_id,
                                                project_structure: obj,
                                                delete:true,
                                                fun_name:"update_tree_structure"
                                            }}, function (session) {
                                                //window.open(session.loc +"files/call_fun.RData")
                                                console.log(session)
                                                session.getObject(function (obj) {
                                                    update_jstree(obj)
                                                    end_cal()
                                                    Swal.fire({
                                                        type: 'success',
                                                        title: 'Deteleted!'
                                                    })
                                                })
                                            }).fail(function (e) {
                                                Swal.fire('Oops...', e.responseText, 'error')
                                                end_cal()
                                            })

                                        })
                                    })

                                } else if (result.dismiss === Swal.DismissReason.cancel) {
                                    swalWithBootstrapButtons.fire(
                                        'Cancelled',
                                        'Your files are safe :)',
                                        'error'
                                    )
                                }
                            })



                        }
                    },
                    "Download": {
                        "label": "Download",
                        "icon": "fa fa-download",
                        "_disabled": !downloadable,
                        "action": function (obj) {
                            nnn = $node
                            start_cal()
                            if ($node.original.icon === "fa fa-folder") {
                                tree = $("#project_structure").jstree(true)
                                selected_node_id = $node.id
                                unincluded_folder = [];
                                included_path = [];
                                included_id = [];
                                included_path[0] = tree.get_path(selected_node_id, "/");
                                included_id[0] = selected_node_id
                                unincluded_folder[0] = selected_node_id
                                while (unincluded_folder.length > 0) {
                                    update_unincluded_folder = []
                                    for (var i = 0; i < unincluded_folder.length; i++) {
                                        children = tree.get_node(unincluded_folder[i]).children
                                        for (var j = 0; j < children.length; j++) {
                                            child_node = tree.get_node(children[j])
                                            if (tree.is_leaf(child_node, "/")) {
                                                included_id.push(child_node.id)
                                                included_path.push(tree.get_path(child_node, "/"))
                                            } else {
                                                included_id.push(child_node.id)
                                                included_path.push(tree.get_path(child_node, "/"))
                                                update_unincluded_folder.push(child_node.id)
                                            }
                                        }
                                    }
                                    unincluded_folder = update_unincluded_folder
                                }

                                
                                ocpu.call("call_fun", {parameter:{
                                    project_id: localStorage.activate_project_id,
                                    id: included_id,
                                    path: included_path,
                                    fun_name:"download_folder_as_zip"
                                }}, function (session) {
                                    console.log(session)
                                    session.getObject(function (obj) {
                                        window.open(session.loc + "files/" + obj[0])
                                        end_cal()
                                    })
                                }).fail(function (e) {
                                    Swal.fire('Oops...', e.responseText, 'error')
                                    end_cal()
                                })



                            } else {
                                window.open("https://metda.fiehnlab.ucdavis.edu/db/metda_project/" + localStorage.activate_project_id + "/" + $node.original.id)
                                end_cal()
                            }
                        }
                    }
                }
                return items;

            }
        }
    }).on('ready.jstree', function () {
        $("#project_structure").jstree("open_all");
    })
}


ocpu.call("call_fun", {parameter:{
    project_id: localStorage['activate_project_id'],
    fun_name:"get_tree_structure"
}}, function (session) {
    session.getObject(function (obj) {
        $("#project_name").text("project name: "+obj[0].text)
        update_jstree(obj)
        
    })
})

