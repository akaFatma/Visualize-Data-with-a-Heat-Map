let url='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
let req = new XMLHttpRequest();
let values =[]
let basetmp;
let data;
let xScale;
let yScale;
let width=1100;
let height = 500;
let padding = 60;
let svg = d3.select('svg');
let tooltip=d3.select('#tooltip');

let minyear;
let maxyear;



let createMap = () => {
    svg.attr("width",width)
       .attr("height",height)
}

let createScales =()=>{
 
    xScale=d3.scaleLinear()
    .domain([
        d3.min(values,(item)=>{
        return item['year']
    }),
    d3.max(values,(item)=>{
        return item['year']+1
    })])
    .range([padding,width-padding])

    yScale=d3.scaleTime()
    .domain([
         new Date(0,0,0,0,0,0,0),
         new Date(0,12,0,0,0,0)
        ]) // I would stop at 11 given that the months start at 0 and end at 11 in js
    .range([padding,(height-padding)]) ;                       //but there will be only 11 blocs for the cells instead of 12 (one for each month)

}

let createAxes = () => {
    xAxis = d3.axisBottom(xScale)
              .tickFormat(d3.format("d"));

    svg.append("g")
    .attr("id","x-axis")
    .call(xAxis)
    .attr("transform",'translate(0,'+ (height-padding)+')')

    yAxis = d3.axisLeft(yScale)
              .tickFormat(d3.timeFormat('%B'))

    svg.append("g")
    .call(yAxis)
    .attr("id","y-axis")
    .attr("transform",'translate('+ (padding)+')')
}


let createCells = () => {
      svg.selectAll('.cell')
          .data(values)
          .enter()
          .append('rect')
          .attr('class','cell')
          .attr('fill',(item) => {
            let variance = item['variance'];
            if(variance <=-2){
            return "Steelblue";
           } else if (variance <=0){
            return 'LightSteelblue'
           } else if (variance <=1){
            return 'orange'
           } else{
            return 'Crimson'
           }
         })
           .attr('data-month',(item)=>{
            return item['month']-1 //js months start from 0
           })
           .attr("data-year",(item)=>{
            return item['year']
           })
           .attr("data-temp",(item)=>{
            return  basetmp +item['variance']
           })
           .attr("height",(height - 2*padding)/12)
           .attr("y",(item)=>{
            return yScale(new Date(0,item['month']-1,0,0,0,0,0))
           })
           .attr('width',(item)=>{
              let nmbrofyears=maxyear-minyear;
              return (width-(2*padding))/nmbrofyears

           })
           .attr('x',(item)=>{
            return xScale(item['year'])
           })
           .on("mouseover",(item)=>{
            tooltip.transition()
            .style("visibility",'visible')
            .style("color","Orange")
            tooltip.text( 'Year : '+item['year']+'  || Variance :'+item['variance'])
            tooltip.attr("data-year",item['year'])
           })
           .on("mouseout",(item)=>{
            tooltip.transition()
            .style("visibility",'hidden')
            
           })
     

}

req.open('GET',url,true)
req.onload=()=> {
    let d = JSON.parse(req.responseText);
     basetmp = d['baseTemperature']
     values = d['monthlyVariance']
    minyear=d3.min(values,(item)=>{
        return item['year']
   })
   maxyear=d3.max(values,(item)=>{
        return item['year']
   })
  
    createMap()
    createScales()
    createAxes()
    createCells();
}
req.send()