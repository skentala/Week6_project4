import "./styles.css";
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

const jsonQuery = {
    "query": [
        {
            "code": "Vuosi",
            "selection": {
                "filter": "item",
                "values": [
                    "2000",
                    "2001",
                    "2002",
                    "2003",
                    "2004",
                    "2005",
                    "2006",
                    "2007",
                    "2008",
                    "2009",
                    "2010",
                    "2011",
                    "2012",
                    "2013",
                    "2014",
                    "2015",
                    "2016",
                    "2017",
                    "2018",
                    "2019",
                    "2020",
                    "2021"
                ]
            }
        },
        {
            "code": "Alue",
            "selection": {
                "filter": "item",
                "values": [
                    "SSS"
                ]
            }
        },
        {
            "code": "Tiedot",
            "selection": {
                "filter": "item",
                "values": [
                    "vaesto"
                ]
            }
        }
    ],
    "response": {
        "format": "json-stat2"
    }
}

let chartData = [];
let chart = null;
let areaCode = "";

async function showData (area) {
    const url1 = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
    const res2 = await fetch(url1);
    const data2 = await res2.json();
    let i = 0;
    data2.variables[1].valueTexts.forEach((mun) => {
        if (mun.toUpperCase() == area.toUpperCase()) {
            areaCode = data2.variables[1].values[i];
            console.log(areaCode);
            return;
        }
        i++;
    });
    if (!areaCode) return;
    jsonQuery.query[1].selection.values[0] = areaCode;
    const res1 = await fetch(url1, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(jsonQuery)
    });
    if (!res1.ok) return;
    const data1 = await res1.json();


    chartData = {
        labels: Object.values(data1.dimension.Vuosi.category.label),
        datasets: [
            {
                name: "Population",
                values: data1.value
            }
        ]
    }
//  console.log(chartData);

    chart = new Chart("#chart", {
        title: `Population in ${area}`,
        data: chartData,
        type: "line",
        height: 450,
        colors: ["#eb5146"]
    });
}

const buttonSubmit = document.getElementById("submit-data");
buttonSubmit.addEventListener("click", async () => {
    event.preventDefault();
    const inputArea = document.getElementById("input-area").value;
    await showData(inputArea);
//    const newLink = document.createElement("a");
//    newLink.id = "navigation";
    let newLink = document.getElementById("navigation");
    newLink.href = `/newchart.html?area='${areaCode}'`;
//    newLink.innerHTML = "View birth and death charts";
//    document.body.appendChild(newLink);
});

const buttonAdd = document.getElementById("add-data");
buttonAdd.addEventListener("click", () => {
    if (!chart) return;
    let newValue = 0;
    let num = 0;
    let previous = null;
    let current = null;
    chartData.datasets[0].values.forEach((point) =>{
        current = point;
        num += 1;
        if (!previous){
            previous = current;
        }
        else {
            newValue += current - previous;
            previous = current;
        }
    })
    if (current){
        newValue = newValue / (num-1);
        newValue += current;
    }
    chart.addDataPoint("Next", [newValue]);
});

async function showPage(){
  await showData("whole country");
  let newLink = document.getElementById("navigation");
  console.log("Kood: "+areaCode);
  newLink.href = `/newchart.html?area='${areaCode}'`;
  console.log(newLink.href);
}

showPage();
