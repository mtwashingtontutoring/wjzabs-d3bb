import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

// https://sinequa.github.io/sba-angular/tipstricks/d3-angular.html
// https://medium.com/netscape/visualizing-data-with-angular-and-d3-209dde784aeb
// https://www.codecademy.com/resources/docs/d3/selection/csv

@Component({
  selector: 'app-baseball',
  standalone: true,
  imports: [],
  templateUrl: './baseball.component.html',
  styleUrl: './baseball.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BaseballComponent implements OnInit {

  data: stats[] = [];


  constructor() { }

  async ngOnInit() {
    await this.getData();
    console.log(this.data)
  }

  async getData() {
    let that = this;

    await d3.csv("assets/Baseball.csv", (d: any) => {
      // console.log(data)
        d.y = +d["runs86"];
        d.x = +d["atbat86"];
        d.r = +d["homer86"];
        d.xa = 0;
        d.ya = 0;
        d.xaa = 0;
        d.yaa = 0;
      return d;
    }).then((data:stats[]) => {
      this.data = data;
      data.sort(function (a: any, b:any) { return b.r - a.r; });
      that.createChart(data);
      console.log({data})
    }).catch (e => console.error(e)) 
    

  }

  createChart(data: stats[]) {
    let that = this;

    let margin = { top: 30, right: 50, bottom: 40, left: 50 };
    let width = 960 - margin.left - margin.right;
    let height = 500 - margin.top - margin.bottom;

    // let svg = d3.select("body")
    let svg = d3.select("#baseball")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    // let zoomed = function () {
    //   svg.attr("transform", d3.event.transform);
    //   console.log(svg)
    // }

    // -----------------------------------------------------------
    // Begin - I commented this out since it was getting the focus on drag
    // -- Jeffery
    // ***********************************************************
    // let view = svg.append("rect")
    //   .attr("class", "view")
    //   .attr("x", 0.5)
    //   .attr("y", 0.5)
    //   .attr("width", width - 1)
    //   .attr("height", height - 1)
    //   .style("fill", "none")
    //   .style("pointer-events", "all")
    // -----------------------------------------------------------
    // END - I commented this out since it was getting the focus on drag
    // -- Jeffery
    // ***********************************************************
      // .call(d3.zoom()
      //   .scaleExtent([1 / 2, 10])
      //   .on("zoom", zoomed));


    let xscale = d3.scaleLinear()
      .domain([0, 800])
      .range([0, width]);

    let yscale = d3.scaleLinear()
      .range([height, 0]);

    let radius = d3.scaleSqrt()
      .range([2, 8]);

    let xAxis = d3.axisBottom(xscale).tickSize(-height)
    // let xAxis = d3.axisBottom()
    //   .tickSize(-height)
    //   .scale(xscale);

    let yAxis = d3.axisLeft(yscale).tickSize(-width)
    // let yAxis = d3.axisLeft()
    //   .tickSize(-width)
    //   .scale(yscale)

    // let color = d3.scaleCategory20();
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    // https://snyk.io/advisor/npm-package/d3/functions/d3.extent
    // const yDomain = d3.extent(data, d => d.y);

    console.log({y: (d3.extent(data, (d:stats) => d.y))})
    // yscale.domain(d3.extent(data, (d:stats) => d.y)).nice();
    yscale.domain([0, 130])

    // yscale.domain(d3.extent(data, function (d) {
    //   return d.y;
    // })).nice();

    console.log({r: (d3.extent(data, (d:stats) => d.r))})
    // radius.domain(d3.extent(data, (d:stats) => d.r)).nice();
    radius.domain([0, 40])

    // radius.domain(d3.extent(data: any[], function (d) {
    //   return d.r;
    // })).nice();

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .call(xAxis);

    svg.append("g")
      .attr("transform", "translate(0,0)")
      .attr("class", "y axis")
      .call(yAxis);

    let group = svg.selectAll("g.bubble")
      .data(data)
      .enter().append("g")
      .attr("class", "bubble")
      .attr("transform", function (d) {
        return "translate(" + xscale(d.x || 0) + "," + yscale(d.y || 0) + ")"
      })
      .on("mouseover", (event: any, d:stats) => {
        // console.log(event, d);
        let player = d["name1"] + " " + d["name2"];
        d3.selectAll(".mytooltip")
          .html("<div>Player:" + player + "<br/><br/>"
          + "<span>(x,y):" + ' (' + d["x"] +',' +  d["y"] + ')' + "</span>" + "<br/>"
          + "<span>Runs:" + d["runs86"] + "</span>" + "<br/>"
          + "<span>At-Bats:" + d["atbat86"] + "</span>" + "<br/>"
          + "<span>Homers:" + d["homer86"] + "</span>" + "<br/>")
          .style("left", function (d) { return event.pageX + "px" })
          .style("top", function (d) { return (event.pageY - 120) + "px" })
          .transition().duration(200)
          .style("opacity", .9);
      })
      .on("mouseout", (event: any, d:stats) => {
        // console.log({event, d})
        d3.selectAll(".mytooltip")
          .transition().duration(600)
          .style("opacity", 0);
      })

      const move = (selection: any, event: any, d: any) => {
  
        const x = this.clamped(xscale(d.x) + event.dx, 0, width)
        const y = this.clamped(yscale(d.y) + event.dy, 0, height)
  
        d.x = xscale.invert(x);
        d.y = yscale.invert(y);
  
        selection
          .attr("transform", `translate(${x}, ${y})`)
  
        d3.select('#tooltip')
          .style("left", x + 'px')
          .style("top", (y + 30) + 'px')
      };

      svg.selectAll("g.bubble")
      .call(d3.drag()
        .on("start", (event: any, d: unknown)=>{})
        .on("drag", function(event: any, d: unknown){
          move(d3.select(this), event, d);
        })
        .on("end", (event: any, d: unknown)=>{}) as any
      )
      // .call(d3.drag()
      // .on("start", dragstarted)
      // .on("drag", (event: any, d: stats) => { d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y); }))
      // .on("end", () => { g.attr("cursor", "grab"); });

      // svg.call(d3.zoom()
      // .extent([[0, 0], [width, height]])
      // .scaleExtent([1, 8])
      // .on("zoom", zoomed));

    group
      .append("circle")
      .attr("r", function (d:stats) { return radius(d.r || 0); })
      .style("fill", (d:stats) => { return color( d["team86"]) })

    group
      .append("text")
      .attr("x", function (d) { return radius(d.r || 0); })
      .attr("alignment-baseline", "middle")
      .text(function (d) {
        return d["name1"] + " " + d["name2"];
      });



    group

        // https://d3js.org/d3-drag#drag-events
        // https://www.d3indepth.com/interaction/

        
    // group.call(drag)
    //     .on("start", (e: DragEvent, d: stats) => {
    //       console.log("drag started", e, d);
    //       // d3.select(this).raise().classed("drag-active", true);
    //       d.xm0 = e.x;
    //       d.ym0 = e.y;
    //       d.xm1 = e.x;
    //       d.ym1 = e.y;
    //     })
    //     .on("drag", (e: DragEvent, d: stats) => {
    //       console.log("drag-active", e, d);
    //       d.xm1 = e.x;
    //       d.ym1 = e.y;
    //       if (d.xm0) {d.xa = d.xm1 - d.xm0};
    //       if (d.ym0) {d.ya = d.ym1 - d.ym0};
    //       d3.selectAll(".drag-active").attr("transform", (d: any, i) => {
    //         return (
    //           "translate(" +
    //           (xscale(d.x) + d.xaa + d.xa) +
    //           "," +
    //           (yscale(d.y) + d.yaa + d.ya) +
    //           ")"
    //         );
    //       });
    //     })
    //     .on("end", (e: DragEvent, d: stats) => {
    //       console.log("drag ended", e, d);
    //       d.xaa = (d.xaa || 0) + (d.xa || 0);
    //       d.yaa = (d.yaa || 0) + (d.ya || 0);
    //       // d3.select(this).classed("drag-active", false);
    //     })
    



    svg.append("text")
      .attr("x", 6)
      .attr("y", -2)
      .attr("class", "label")
      .text("Runs (86)");

    svg.append("text")
      .attr("x", width - 2)
      .attr("y", height - 6)
      .attr("text-anchor", "end")
      .attr("class", "label")
      .text("At Bats (86)");

    let legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) { return "translate(2," + i * 14 + ")"; });

    legend.append("rect")
      .attr("x", width)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", color);

    legend.append("text")
      .attr("x", width + 16)
      .attr("y", 6)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function (d) { return d; });

    legend
    .on("mouseover", (event: MouseEvent, type: string) => {
      d3.selectAll(".legend").style("opacity", 0.1);
      d3.selectAll(".legend").filter((d:any) => { return d === type; }).style("opacity", 1);
      d3.selectAll(".bubble")
        .style("opacity", 0.1)
        .filter((d:any) => { return d["team86"] === type; })
        .style("opacity", 1);
    })
    .on("mouseout", (event: any, type: string) => {
      d3.selectAll(".legend").style("opacity", 1);
      d3.selectAll(".bubble").style("opacity", 1);
    });

  }

  private clamped(value: number, min: number, max: number): number {
    if(value < min) {
      return min;
    } else if (value > max) {
      return max;
    }
    return value;
  }


  // drag = d3.drag()
  //   .on("drag", (e) => {
  //     // console.log(e);
  //     // console.log(e.target.x, e.x);
  //     e.target.x = e.x;
  //     e.target.y = e.y;   
  //     this.update();         
  //   })
    drag = d3.drag()
    .on("drag", this.handleDrag)

    handleDrag(e:any) {
      console.log(typeof(e), e)
      e.target.x = e.x;
      e.target.y = e.y;
      // this.update();

      let margin = { top: 30, right: 50, bottom: 40, left: 50 };
      let width = 960 - margin.left - margin.right;
      let height = 500 - margin.top - margin.bottom;

      let xscale = d3.scaleLinear()
      .domain([0, 800])
      .range([0, width]);

      let yscale = d3.scaleLinear()
        .range([height, 0]);

      console.log(this.data)

      d3.select('svg')
      .selectAll("g.bubble")
      .data(this.data)
      .enter().append("g")
      .attr("class", "bubble")
      .attr("transform", function (d) {
        return "translate(" + xscale(d.x || 0) + "," + yscale(d.y || 0) + ")"
      });

      // d3.select('svg')
      // .selectAll('g.bubble')
      // .data(this.data)
      // .join('g.bubble')
      // .attr('cx', (d: any) => { return d.x; })
      // .attr('cy', (d: any) => { return d.y; })
      // .attr('r', (d: any) => { return d.r; });
    }

  update() {
    d3.select('svg')
      .selectAll('circle')
      .data(this.data)
      .join('circle')
      .attr('cx', (d: any) => { return d.x; })
      .attr('cy', (d: any) => { return d.y; })
      .attr('r', (d: any) => { return d.r; });
  }



// https://observablehq.com/@d3/drag-zoom

  // dragstarted() {
  //   d3.select(this).raise();
  //   g.attr("cursor", "grabbing");
  // }

  // dragged(event: any, d: stats) {
  //   d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
  // }

  // dragended() {
  //   g.attr("cursor", "grab");
  // }

  // zoomed({transform}: any) {
  //   g.attr("transform", transform);
  // }


}

export interface stats {

  row: number;
  name1: string;
  name2: string;
  atbat86: number;
  hits86: number;
  homer86: number;
  runs86: number;
  rbi86: number;
  walks86: number;
  years: number;
  atbat: number;
  hits: number;
  homeruns: number;
  runs: number;
  rbi: number;
  walks: number;
  league86: string;
  div86: string;
  team86: string;
  posit86: string;
  outs86: number;
  assist86: number;
  error86: number;
  sal87: number;
  league87 :string;
  team87: string;
  y?: number;
  x?: number;
  r?: number;
  xa?: number;
  ya?: number;
  xaa?: number;
  yaa?: number;
          xm0?: number;
          ym0?: number;
          xm1?: number;
          ym1?: number;
}
