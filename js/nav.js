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

open_tutorial = function(name=null){
    if(name == null){
        window.open("https://github.com/slfan2013/MetDA-development/raw/master/MetSolution%20Tutorial/MetSolution%20-%20Tutorial.pptx")
    }else{
        window.open("https://github.com/slfan2013/MetDA-development/raw/master/MetSolution%20Tutorial/MetSolution%20-%20Tutorial - " + name + ".pptx")
    }
    
}