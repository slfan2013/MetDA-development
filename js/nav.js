console.log("nav loaded")

contact = function () {
    alert("Shoot me an email! Happy to Discuss! slfan@ucdavis.edu")
}


refresh = function () {
    var result = confirm("Are you sure? You will lost all the projects associated with this web browser.");

    if(result){
        localStorage.clear();
        window.location.replace("#home");
        location.reload();
    }
    
}

open_tutorial = function(){
    
}