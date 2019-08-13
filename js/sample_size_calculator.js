
seq =  function(from, to, length) {
    result = [];

    if(from - to>0){ // from 1 to 0.
      for(var i=to; i<from+((from-to)/(length-1)); i=i+((from-to)/(length-1))) {
         result.push(i);
      }
      result.reverse();
    }else{
       for(var i=from; i<to+((to-from)/(length-1)); i=i+((to-from)/(length-1))) {
         result.push(i);
      }
    }
    return(result.slice(0, length))
  }
  dnorm = function(x,mean,sd){//require gaussian.js
    var distribution = gaussian(mean, Math.pow(sd, 2));
    var result = [];
    for(i=0;i<x.length;i++){
        result.push(distribution.pdf(x[i]))
    }
    return(result)
  }
  pnorm = function(q,mean,sd){//require gaussian.js
    var distribution = gaussian(mean, Math.pow(sd, 2));
    var result = [];
    for(i=0;i<q.length;i++){
        result.push(distribution.cdf(q[i]))
    }
    return(result)
  }
  rnorm = function(n, mean, sd){//require gaussian.js
    var distribution = gaussian(mean, Math.pow(sd, 2));
    var result = [];
    for(i=0;i<n;i++){
      result.push(distribution.ppf(Math.random()))
    }
    return(result)
  }
  qnorm = function(p, mean, sd){//require gaussian.js
    var distribution = gaussian(mean, Math.pow(sd, 2));
    var result = [];
    for(i=0;i<p.length;i++){
      result.push(distribution.cdf(p[i]))
    }
    return(result)
  }
  sumFunction = function(x,decimal = 2){
    var result = 0;
    for( var i = 0; i < x.length; i++ ){
      result += parseInt( x[i], 10 ); //don't forget to add the base
    }
    return(Number(result.toFixed(decimal)))
  }
  meanFunction = function(x,decimal = 2){
    var result = 0;
    for( var i = 0; i < x.length; i++ ){
      result += parseFloat( x[i], 10 ) //don't forget to add the base
    }
    result = result/(x.length)
    return(Number(result.toFixed(decimal)))
  }
  sdFunction = function(x,decimal = 2){
    var avg = meanFunction(x);
    var result = 0;
    var diff = [];
    for(var i=0; i<x.length; i++){
      diff.push(Math.pow((x[i] - avg),2));
    }
    return(Math.sqrt(Number((meanFunction(diff)))+0.01).toFixed(decimal))

  }
  storeItemAndReset = function(id){
    localStorage.setItem(id, $('#'+id).val());
    document.getElementById(id).value = localStorage.getItem(id);
  }
  qnorm = function(p,mean,sd){//require gaussian.js
    var distribution = gaussian(mean, Math.pow(sd, 2));
    var result = [];
    for(i=0;i<p.length;i++){
        result.push(distribution.ppf(p[i]))
    }
    return(result)
  }

  rep = function(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}
  extractNumber = function(txt){
    var numb = txt.match(/\d/g);
    numb = numb.join("");
    return(parseFloat(numb))
  }







  function LogGamma(Z) {
  	with (Math) {
  		var S=1+76.18009173/Z-86.50532033/(Z+1)+24.01409822/(Z+2)-1.231739516/(Z+3)+.00120858003/(Z+4)-.00000536382/(Z+5);
  		var LG= (Z-.5)*log(Z+4.5)-(Z+4.5)+log(S*2.50662827465);
  	}
  	return LG
  }

  function Betinc(X,A,B) {
  	var A0=0;
  	var B0=1;
  	var A1=1;
  	var B1=1;
  	var M9=0;
  	var A2=0;
  	var C9;
  	while (Math.abs((A1-A2)/A1)>.00001) {
  		A2=A1;
  		C9=-(A+M9)*(A+B+M9)*X/(A+2*M9)/(A+2*M9+1);
  		A0=A1+C9*A0;
  		B0=B1+C9*B0;
  		M9=M9+1;
  		C9=M9*(B-M9)*X/(A+2*M9-1)/(A+2*M9);
  		A1=A0+C9*A1;
  		B1=B0+C9*B1;
  		A0=A0/B1;
  		B0=B0/B1;
  		A1=A1/B1;
  		B1=1;
  	}
  	return A1/A
  }

  function tprobability(df,X) {
      with (Math) {
  		if (df<=0) {
  			alert("Degrees of freedom must be positive")
  		} else {
  			A=df/2;
  			S=A+.5;
  			Z=df/(df+X*X);
  			BT=exp(LogGamma(S)-LogGamma(.5)-LogGamma(A)+A*log(Z)+.5*log(1-Z));
  			if (Z<(A+1)/(S+2)) {
  				betacdf=BT*Betinc(Z,A,.5)
  			} else {
  				betacdf=1-BT*Betinc(1-Z,.5,A)
  			}
  			if (X<0) {
  				tcdf=betacdf/2
  			} else {
  				tcdf=1-betacdf/2
  			}
  		}
  		tcdf=round(tcdf*100000)/100000;
  	}
      return(tcdf);
  }



  function countunique(arr) {
      var a = [], b = [], prev;

      arr.sort();
      for ( var i = 0; i < arr.length; i++ ) {
          if ( arr[i] !== prev ) {
              a.push(arr[i]);
              b.push(1);
          } else {
              b[b.length-1]++;
          }
          prev = arr[i];
      }

      return [a, b];
  }





$("#sample_size_plot_div").load("sample_size_plot.html", function () {
    init_selectpicker()
})






$('input[type=radio][name=factors]').change(function () {
    var test_groups = $("input[name='test_groups']:checked").val();
    if (this.value == 'one factor') {
        $("#one_factor_show_index").show()
        $("#two_factor_show_index").hide()
        if (!test_groups.includes("groups")) {
            $("input[name=test_groups][value='two_independent_groups']").prop("checked", true);
        }
    } else if (this.value == 'two factors') {
        $("#one_factor_show_index").hide()
        $("#two_factor_show_index").show()
        if (test_groups.includes("groups")) {
            $("input[name=test_groups][value='independent_independent']").prop("checked", true);
        }
    }
    calculateeffectsize()
    calculatesamplesize()
});




$("#two_factor_show_index").hide()
calculatesamplesize = function () {
    document.getElementById("samplesize").innerHTML = '<i class="fa fa-question-circle fa-spin" style="font-size:24px"></i>'

    var test_groups = $("input[name='test_groups']:checked").val();

    $(".hide_all").hide()
    $("." + test_groups + "_show").show()

    effectsizevalue = Number($("#effectsize_samplesize").val())
    alpha = Number($("#alpha").val())
    power = Number($("#power").val())



    if (test_groups == "two_independent_groups") {
        $("#two_independent_groups_two_paired_groups_hint").show()
        $("#two_independent_groups_two_paired_groups_hint2").show()

        ocpu.call("call_fun", {
            parameter: {
                effectsize: effectsizevalue, sig_level: alpha, power: power, forplot: false, samplerange: null, effectsizerange: null, fun_name: "samplesize_onefactortwogroupspower"
            }
        }, function (session) {
            console.log(session)
            session.getObject(function (obj) {
                document.getElementById("samplesize").innerHTML = obj[0]
            })
        })
    } else if (test_groups == "two_paired_groups") {
        $("#two_independent_groups_two_paired_groups_hint").show()
        $("#two_independent_groups_two_paired_groups_hint2").show()
        ocpu.call("call_fun", {parameter:{
            effectsize: effectsizevalue, sig_level: alpha, power: power, forplot: false, samplerange: null, effectsizerange: null,fun_name:"samplesize_onefactortwopairedgroupspower"
        }}, function (session) {
            session.getObject(function (obj) {
                document.getElementById("samplesize").innerHTML = obj
            })
        })
    } else if (test_groups == "multiple_independent_groups") {
        $("#multiple_independent_groups_multiple_paired_groups_hint").show()
        ocpu.call("call_fun", {parameter:{
            k: Number($("#multiple_independent_groups_numgroups").val()), effectsize: effectsizevalue, sig_level: alpha, power: power, forplot: false, samplerange: null, effectsizerange: null,fun_name:"samplesize_onefactormultigroupspower"
        }}, function (session) {
            session.getObject(function (obj) {
                document.getElementById("samplesize").innerHTML = obj
            })
        })
    } else if (test_groups == "multiple_paired_groups") {
        $("#multiple_independent_groups_multiple_paired_groups_hint").show()
        ocpu.call("call_fun", {parameter:{
            m: Number($("#multiple_paired_groups_numgroups").val()), effectsize: effectsizevalue, sig_level: alpha, power: power,
            corr: Number($("#multiple_paired_groups_correlation").val()), epsilon: Number($("#multiple_paired_groups_epsilon").val()), forplot: false, samplerange: null, effectsizerange: null,fun_name:"samplesize_onefactormultipairedgroupspower"
        }}, function (session) {
            console.log(session)
            session.getObject(function (obj) {
                document.getElementById("samplesize").innerHTML = obj
            })
        })
    } else if (test_groups == "independent_independent") {
        ocpu.call("call_fun", {parameter:{
            k1: Number($("#independent_independent_numgroups1").val()), k2: Number($("#independent_independent_numgroups2").val()), effectsize: effectsizevalue, sig_level: alpha, power: power, forplot: false, samplerange: null, effectsizerange: null,fun_name:"samplesize_twofactorindindpower"
        }}, function (session) {
            session.getObject(function (obj) {
                document.getElementById("samplesize").innerHTML = obj
            })
        })
    } else if (test_groups == "independent_paired") {
        ocpu.call("call_fun", {parameter:{
            k: Number($("#independent_paired_numgroups1").val()), m: Number($("#independent_paired_numgroups2").val()), effectsize: effectsizevalue, sig_level: alpha, power: power, forplot: false, samplerange: null, effectsizerange: null,
            corr: Number($("#independent_paired_correlation").val()), epsilon: Number($("#independent_paired_epsilon").val()),fun_name:"samplesize_twofactorindpairedpower"
        }}, function (session) {
            console.log(session)
            session.getObject(function (obj) {
                document.getElementById("samplesize").innerHTML = obj
            })
        })
    }
    effectsizerange = [Number((Number(effectsizevalue) - Number(0.1)).toFixed(2)), Number(effectsizevalue.toFixed(2)), Number((Number(effectsizevalue) + Number(0.1)).toFixed(2))].join()
}
calculateeffectsize = function () {
    console.log("!!!")
    test_groups = $("input[name='test_groups']:checked").val();
    console.log(test_groups)
    pre = "." + test_groups + "_show "
    if (test_groups == "two_independent_groups") {
        effectsizevalue = Number((Math.abs($(pre + "input[name='caleffectsize.mean1']").val() - $(pre + "input[name='caleffectsize.mean2']").val()) / Math.sqrt((Number(Math.pow($(pre + "input[name='caleffectsize.sd1']").val(), 2)) + Number(Math.pow($(pre + "input[name='caleffectsize.sd2']").val(), 2))) / 2)).toFixed(4))
    } else if (test_groups == "two_paired_groups") {
        effectsizevalue = Number((Math.abs($(pre + "input[name='caleffectsize.mean1']").val() - $(pre + "input[name='caleffectsize.mean2']").val()) / Math.sqrt((Number(Math.pow($(pre + "input[name='caleffectsize.sd1']").val(), 2)) + Number(Math.pow($(pre + "input[name='caleffectsize.sd2']").val(), 2)) - 2 * $(pre + "input[name='caleffectsize.corr']").val() * $(pre + "input[name='caleffectsize.sd1']").val() * $(pre + "input[name='caleffectsize.sd2']").val()))).toFixed(4))
    } else if ($.inArray(test_groups, ["multiple_paired_groups", "multiple_independent_groups"]) > -1) {
        numofeffectsizes = Number($("#"+test_groups+"_numgroups").val());
        means = [];
        for (ii = 0; ii < numofeffectsizes; ii++) {
            means.push($("."+test_groups+"_show input[name='caleffectsize.mean"+(ii+1)+"']").val())
        }
        globalmean = meanFunction(means)
        meandiffssq = [];
        for (ii = 0; ii < numofeffectsizes; ii++) {
            meandiffssq.push(Math.pow($("."+test_groups+"_show input[name='caleffectsize.mean"+(ii+1)+"']").val() - globalmean, 2))
        }
        sigma_mu = Math.sqrt(meanFunction(meandiffssq))
        sds = [];
        for (ii = 0; ii < numofeffectsizes; ii++) {
            sds.push($("."+test_groups+"_show input[name='caleffectsize.sd"+(ii+1)+"']").val())
        }
        pooled_variance = meanFunction(sds)
        effectsizevalue = Number(Number(sigma_mu / pooled_variance).toFixed(4))
    } else {
        effectsizevalue = Number(Number(Math.sqrt($("."+test_groups+"_show .varianceexplained").val() / $("."+test_groups+"_show .totalvariance").val())).toFixed(4))
    }
    //$("#effectsizevalue").text(effectsizevalue.toFixed(4))
    $("#effectsize_samplesize").val(effectsizevalue)
    calculatesamplesize()
    effectsizerange = [Number((Number(effectsizevalue) - Number(0.1)).toFixed(2)), Number(effectsizevalue.toFixed(2)), Number((Number(effectsizevalue) + Number(0.1)).toFixed(2))].join()
}
calculateeffectsize()

multiple_independent_groups_numgroups_change_determine = function(){
    temp_div = '<h3><em>ANOVA</em></h3>'
    for(var i=0; i<$("#multiple_independent_groups_numgroups").val();i++){
        temp_current_index = i+1
        temp_div = temp_div + '<div class="row">'+
        '<div class="col-lg-6">'+
        '<label>Mean '+temp_current_index+'</label>'+
    '<input class="form-control" type="number" name="caleffectsize.mean'+temp_current_index+'"'+
    'onchange="calculateeffectsize();" value="'+temp_current_index+'">'+
    '</div>'+
    '<div class="col-lg-6">'+
    '<label>SD '+temp_current_index+'</label>'+
    '<input class="form-control" type="number" name="caleffectsize.sd'+temp_current_index+'"'+
    'onchange="calculateeffectsize();" value="1">'+
    '</div>'+'</div>'
    }
    
    
    $("#multiple_independent_groups_determine_div").html(temp_div)
}

multiple_independent_groups_numgroups_change_determine()



multiple_paired_groups_numgroups_change_determine = function(){
    temp_div = '<h3><em>repeated ANOVA</em></h3>'
    for(var i=0; i<$("#multiple_paired_groups_numgroups").val();i++){
        temp_current_index = i+1
        temp_div = temp_div + '<div class="row">'+
        '<div class="col-lg-6">'+
        '<label>Mean '+temp_current_index+'</label>'+
    '<input class="form-control" type="number" name="caleffectsize.mean'+temp_current_index+'"'+
    'onchange="calculateeffectsize();" value="'+temp_current_index+'">'+
    '</div>'+
    '<div class="col-lg-6">'+
    '<label>SD '+temp_current_index+'</label>'+
    '<input class="form-control" type="number" name="caleffectsize.sd'+temp_current_index+'"'+
    'onchange="calculateeffectsize();" value="1">'+
    '</div>'+'</div>'
    }
    
    
    $("#multiple_paired_groups_determine_div").html(temp_div)
}

multiple_paired_groups_numgroups_change_determine()



calculatesamplesize()

/*$("#requestplot").click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
})*/


powersampleplot = function () {
    var test_groups = $("input[name='test_groups']:checked").val();

    effectsizevalue = Number($("#effectsize_samplesize").val())
    alpha = Number($("#alpha").val())
    power = Number($("#power").val())
    samplerange = $("#samplerange").val()
    effectsizerange = $("#effectsizerange").val()


    if (test_groups == "two_independent_groups") {

        ocpu.call("call_fun", {
            parameter: {
                effectsize: effectsizevalue, sig_level: alpha, power: power, forplot: true, samplerange: samplerange, effectsizerange: effectsizerange, fun_name: "samplesize_onefactortwogroupspower"
            }
        }, function (session) {
            console.log(session)
            session.getObject(function (obj) {
                obj_sample_size_plot = obj
                sample_size_plot_debounced()
            })
        })
    } else if (test_groups == "two_paired_groups") {
        ocpu.call("call_fun", {
            parameter: {
                effectsize: effectsizevalue, sig_level: alpha, power: power, forplot: true, samplerange: samplerange, effectsizerange: effectsizerange, fun_name: "samplesize_onefactortwopairedgroupspower"
            }
        }, function (session) {
            session.getObject(function (obj) {
                session.getObject(function (obj) {
                    obj_sample_size_plot = obj
                    sample_size_plot_debounced()
                })
            })
        })
    } else if (test_groups == "multiple_independent_groups") {
        ocpu.call("call_fun", {parameter:{
            k: Number($("#multiple_independent_groups_numgroups").val()), effectsize: effectsizevalue, sig_level: alpha, power: power, forplot: true, samplerange: samplerange, effectsizerange: effectsizerange,fun_name:"samplesize_onefactormultigroupspower"
        }}, function (session) {
            session.getObject(function (obj) {
                obj_sample_size_plot = obj
                sample_size_plot_debounced()
            })
        })
    } else if (test_groups == "multiple_paired_groups") {
        ocpu.call("call_fun", {parameter:{
            m: Number($("#multiple_paired_groups_numgroups").val()), effectsize: effectsizevalue, sig_level: alpha, power: power,
            corr: Number($("#multiple_paired_groups_correlation").val()), epsilon: Number($("#multiple_paired_groups_epsilon").val()), forplot: true, samplerange: samplerange, effectsizerange: effectsizerange,fun_name:"samplesize_onefactormultipairedgroupspower"
        }}, function (session) {
            session.getObject(function (obj) {
                obj_sample_size_plot = obj
                sample_size_plot_debounced()
            })
        })
    } else if (test_groups == "independent_independent") {
        ocpu.call("call_fun", {parameter:{
            k1: Number($("#independent_independent_numgroups1").val()), k2: Number($("#independent_independent_numgroups2").val()), effectsize: effectsizevalue, sig_level: alpha, power: power, forplot: true, samplerange: samplerange, effectsizerange: effectsizerange,fun_name:"samplesize_twofactorindindpower"
        }}, function (session) {
            session.getObject(function (obj) {
                obj_sample_size_plot = obj
                sample_size_plot_debounced()
            })
        })
    } else if (test_groups == "independent_paired") {
        ocpu.call("call_fun", {parameter:{
            k: Number($("#independent_paired_numgroups1").val()), m: Number($("#independent_paired_numgroups2").val()), effectsize: effectsizevalue, sig_level: alpha, power: power,
            corr: Number($("#independent_paired_correlation").val()), epsilon: Number($("#independent_paired_epsilon").val()), forplot: true, samplerange: samplerange, effectsizerange: effectsizerange,fun_name:"samplesize_twofactorindpairedpower"
        }}, function (session) {
            session.getObject(function (obj) {
                obj_sample_size_plot = obj
                sample_size_plot_debounced()
            })
        })
    }


}


