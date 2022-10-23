let jsonData = {};
let selection = 0;


//Populating the table with all the information
const populateTable = () =>{
    const table = document.getElementById("light-table");

    jsonData.map(item =>{
        const row = document.createElement("tr");
        const d = new Date(item.date_time);

        const dateColumn = document.createElement("td");
        dateColumn.className = "date-column";
        //formatting the date data
        dateColumn.innerHTML = d.getDate() + "/" + (d.getMonth() + 1) + "/" +d.getFullYear();
        row.appendChild(dateColumn);

        const timeColumn = document.createElement("td");
        timeColumn.className = "time-column";
        //formatting the time data
        timeColumn.innerHTML = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
        row.appendChild(timeColumn);

        const valueColumn = document.createElement("td");
        valueColumn.className = "value-column";
        const value = item.light;
        //formatting the light level value
        valueColumn.innerHTML = parseFloat(value).toFixed(2) + "%";
        row.appendChild(valueColumn);

        table.appendChild(row);


        //formating the time for the chart depending on the timespan selected
        if(selection == 0){
            item.timeFormated = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
            }
            else{
                item.timeFormated =  d.getDate() + "/" + (d.getMonth() + 1) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            }
    })
}

//Drawing the chart
const drawLightChart = ()=>{

    const lightChart = Chart.getChart("light-chart");

    //destroying the chart if the chart already existed
    if(lightChart != undefined){
      lightChart.destroy();
    }

    //Creating the chart
    new Chart("light-chart",{
        type: "line",
        data:{
            datasets:[{
                data: jsonData,
                backgroundColor: "red",
                borderColor: "red"
            }]
        },
        options:{
            parsing:{
                xAxisKey: "timeFormated",
                yAxisKey: "light",
                key: "light"
            },
            responsive: true,
            plugins:{
                legend:{display: false}
            },
            scales: {
                y: {
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }

        }

    });
}


//Fetching the data and calling the populateTable and drawLightChart functions
fetchMeasurements = async () =>{
    let response;

    //fetching the data from a different site depending on the timespan selected
    try {
        if(selection == 0){
          response = await fetch("https://webapi19sa-1.course.tamk.cloud/v1/weather/light");
        }
        else response = await fetch("https://webapi19sa-1.course.tamk.cloud/v1/weather/light/" + selection);
        
        jsonData = await response.json();
        populateTable();
        drawLightChart();
    } catch (error) {
       console.error(error) 
    }
}

//Making it so that the chart and the table are redone if the timespan is changed
const selectElement = document.getElementById("timespanSelect");
selectElement.addEventListener("change", (event) =>{
    document.getElementById("light-table").innerHTML="";
    selection = selectElement.value;
    fetchMeasurements();
})

fetchMeasurements();