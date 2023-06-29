import "./styles.css";
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

const jsonQueryBirth = {
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
                    "vm01"
                ]
            }
        }
    ],
    "response": {
        "format": "json-stat2"
    }
}

const jsonQueryDeath = {
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
                    "vm11"
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

async function showData () {
    const queryString = new URLSearchParams(window.location.search);
    let areaCode = queryString.get("area");
    areaCode = areaCode.replaceAll("'", '');
//    let queryString = window.location.search;
    const url1 = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
    const res2 = await fetch(url1);
    const data2 = await res2.json();
    let i = 0;
    if (!areaCode) return;

    let area = "";
    data2.variables[1].values.forEach((mun) => {
        if (mun == areaCode) {
            area = data2.variables[1].valueTexts[i];
            return;
        }
        i++;
    });
    if (!area) return;

    jsonQueryBirth.query[1].selection.values[0] = areaCode;
    let res = await fetch(url1, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(jsonQueryBirth)
    });
    if (!res.ok) return;
    const data1 = await res.json();

    jsonQueryDeath.query[1].selection.values[0] = areaCode;
    res = await fetch(url1, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(jsonQueryDeath)
    });
    if (!res.ok) return;
    const data3 = await res.json();


    chartData = {
        labels: Object.values(data1.dimension.Vuosi.category.label),
        datasets: [
            {
                name: "Births",
                values: data1.value
            },
            {
                name: "Deaths",
                values: data3.value
            }
        ]
    }
//  console.log(chartData);

    chart = new Chart("#chart", {
        title: `Births and deaths in ${area}`,
        data: chartData,
        type: "bar",
        height: 450,
        colors: ["#63d0ff", "#363636"]
    });
}

showData();
