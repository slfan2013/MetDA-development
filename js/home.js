

function change_url() {
    $(".contents").hide();
    $("#"+window.location.href.split("#")[1]+"_content").show();


    $("#"+window.location.href.split("#")[1]+"_content").load(window.location.href.split("#")[1]+".html")
}
change_url();
window.addEventListener('hashchange', change_url, false);