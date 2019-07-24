console.log("scree.plot");



scree_plot_fun = function ({ys=undefined, texts=undefined, hovertexts=undefined, names=undefined, add_line_trace=undefined, line_trace_index=undefined,ylab=undefined,xlab=undefined,title=undefined, plot_id=undefined}) { // ys, texts, hovertexts, is [[xxx],[xxx]]. names is [x,x,x].add_line_trace is true
    var x = Array.from({ length: ys[0].length }, (v, k) => k + 1);
    //var text1 = y1.map(x => (x*100).toFixed(2)+"%" )
    //var hovertext1 = text1.map((x,i) => "PC"+ (i+1)+": "+x)
    var myPlot = document.getElementById(plot_id)
    scree_plot_data = []
    for (var i = 0; i < ys.length; i++) {
        scree_plot_data.push({
            orientation: "v",
            base: 0,
            x: x,
            y: ys[i],
            text: texts[i],
            type: 'bar',
            marker: {
                autocolorscale: false,
                color: "rgba(89,181,199,1)",
                line: {
                    width: 2,
                    color: "rgba(89,181,199,1)"
                }
            },
            showlegend: true,
            xaxis: "x",
            yaxis: "y",
            hoverinfo: "text",
            mode: "",
            name: names[i]
        })
    }

    if (add_line_trace) {
        scree_plot_data.push({ //line trace.
            x: x,
            y: ys[line_trace_index],
            text: texts[line_trace_index],
            mode: "lines+markers",
            line: {
                width: 2,
                color: "rgba(0,0,0,1)",
                dash: "solid"
            },
            hoveron: "points",
            showlegend: false,
            xaxis: "x",
            yaxis: "y",
            hoverinfo: "text",
            marker: {
                autocolorscale: false,
                color: "rgba(0,0,0,1)",
                opacity: 1,
                size: 6,
                symbol: "circle",
                line: {
                    width: 2,
                    color: "rgba(0,0,0,1)"
                }
            },
            name: ""
        })
        scree_plot_data.push({ // scatter trace.
            x: x.map(x => x + 0.3),
            y: ys[line_trace_index].map(x => x + 0.02),
            text: texts[line_trace_index],
            hovertext: hovertexts[line_trace_index],
            textfont: {
                size: 15,
                color: "rgba(0,0,0,1)",
            },
            type: 'scatter',
            mode: "text",
            hoveron: "points",
            showlegend: false,
            xaxis: "x",
            yaxis: "y",
            hoverinfo: "text",
            name: ""
        })
    }


    scree_plot_layout = {
        /*margin:{
          t:42,
          r:7.3,
          b:42,
          l:60
        },*/
        font:{
          color:"rgba(0,0,0,1)",
          family:"Dorid Sans",
          size:18
        },
        title:title,
        titlefont:{
          color:"rgba(0,0,0,1)",
          family:"Dorid Sans",
          size:25
        },
        xaxis:{
          type:"linear",
          autorange:false,
          range:[0.4,10.6],
          tickmode:"array",
          ticktext:x,
          tickvals:x,
          categoryorder:"array",
          categoryarray:x,
          nticks:null,
          ticks:"outside",
          tickcolor:"rbga(0,0,0,1)",
          ticklen:3.65,
          tickwidth:0.66,
          showticklabels:true,
          tickfont:{
            color:"rgba(0,0,0,1)",
            family:"Dorid Sans",
            size:15,
            tickangle:0
          },
          showline:false,
          linecolor:null,
          linewidth:0,
          showgrid:true,
          domain:[0,1],
          gridcolor:"rgba(0,0,0,0)",
          gridwidth:0,
          zeroline:false,
          anchor:"y",
          title:xlab,
          titlefont:{
            color:"rgba(0,0,0,1)",
            family:"Dorid Sans",
            size:18
          },
          hoverformat:".2f"
        },
        yaxis:{
          type:"linear",
          autorange:true,
          /*range:[-0.01,
          y.reduce(function(a, b) {
                      return Math.max(a, b);
                  })*1.1],*/
          tickmode:"array",
          categoryorder:"array",
          nticks:null,
          ticks:"outside",
          tickcolor:"rgba(0,0,0,1)",
          ticklen:3.65,
          tickwidth:0.66,
          showticklabels:true,
          tickfont:{
            color:"rgba(0,0,0,1)",
            family:"Dorid Sans",
            size:15
          },
          tickangle:0,
          showline:false,
          linecolor:"rgba(0,0,0,1)",
          showgrid:true,
          domain:[0,1],
          gridcolor:"rgba(0,0,0,0.2)",
          gridwidth:0,
          zeroline:false,
          anchor:"x",
          title:ylab,
          titlefont:{
            color:"rgba(0,0,0,1)",
            family:"Dorid Sans",
            size:18
          },
          hoverformat:".2f"
        },
        shapes:[
          {
            type:"rect",
            fillcolor:null,
            line:{
              color:'rgba(0,0,0,1)',
              width:1,
              linetype:"solid"
            },
            yref:"paper",
            xref:"paper",
            x0:0,
            x1:1,
            y0:0,
            y1:1
          },
        ],
        showlegend:true,
        hovermode:"closest",
        barmode:"group"
      };

      Plotly.newPlot(plot_id, scree_plot_data, scree_plot_layout, { editable: false })


            .then(gd => {
                scree_plot_gd = gd
                // Note: cache should not be re-used by repeated calls to JSON.stringify.
                var cache = [];
                fullLayout = JSON.stringify(scree_plot_gd._fullLayout, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Duplicate reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // Enable garbage collection
                // Note: cache should not be re-used by repeated calls to JSON.stringify.
                var cache = [];
                fullData = JSON.stringify(scree_plot_gd._fullData, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Duplicate reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // Enable garbage collection

                scree_plot_parameters = {
                    full_data:JSON.parse(fullData),
                    full_layout:JSON.parse(fullLayout),
                    data: scree_plot_gd.data,
                    layout: scree_plot_gd.layout,
                }
               
            
                Plotly.toImage(gd,{format:'svg'})
                    .then(
                      function(url)
                       {
                         scree_plot_url = url
                         scree_plot_url2 = scree_plot_url.replace(/^data:image\/svg\+xml,/, '');
                         scree_plot_url2 = decodeURIComponent(scree_plot_url2);
                         plot_url.scree_plot=  btoa(unescape(encodeURIComponent(scree_plot_url2)))
                         files_sources[3] = plot_url.scree_plot
                          /*var canvas = document.createElement("canvas");
                          var context = canvas.getContext("2d");
                          canvas.width = 4000;
                          canvas.height = 3000;
                          var image = new Image();
                          context.clearRect ( 0, 0, 4000, 3000 );
                          var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(url.replace("data:image/svg+xml,",""))); // Convert SVG string to data URL

                          var image = new Image();
                          image.onload = function() {
                              context.drawImage(image, 0, 0, 4000, 3000);
                              var img = canvas.toDataURL("image/png");
                              base64 = img.replace("data:image/png;base64,","")
                              plot_url.scree_plot = base64
                          };
                          image.src = imgsrc*/
                       }
                   )



            })
            ;






}

gather_page_information_to_scree_plot = function () {

    ys = [obj_scree_plot.variance]
    texts = ys.map(function(x){
        return(x.map(function(z){
            return((z*100).toFixed(2)+"%")
        }))
    })
    hovertexts = texts.map(function(x){
        return(x.map(function(z,i){
            return("PC"+(i+1)+": "+z)
        }))
    })

    names = ["Variance Explained"]
    add_line_trace = true
    line_trace_index = 0

    ylab = "Percentage of Variance Explained"
    xlab = "Number of Principal Components"
    title = "Scree Plot"

    plot_id = "scree_plot"


    scree_plot_fun({ys:ys, texts:texts, hovertexts:hovertexts, names:names, add_line_trace:add_line_trace, line_trace_index:line_trace_index, ylab:ylab,xlab:xlab, title:title,plot_id:plot_id})
}
gather_page_information_to_scree_plot()