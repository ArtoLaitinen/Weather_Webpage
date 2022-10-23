let jsonData = {};
let selection = 0;

//Populating the table with all the information
const populateTable = () =>{
    const table = document.getElementById("temperature-table");

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
        const value = item.temperature;
        //formatting the temperature value
        valueColumn.innerHTML = parseFloat(value).toFixed(2) + " °C"
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
const drawTemperatureChart = ()=>{
    const temperatureChart = Chart.getChart("temperature-chart");

    //destroying the chart if the chart already existed
    if(temperatureChart != undefined){
      temperatureChart.destroy();
    }

    //Creating the chart
    new Chart("temperature-chart",{
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
                yAxisKey: "temperature",
                key: "temperature"
            },
            responsive: true,
            plugins:{
                legend:{display: false},
            },
            scales: {
                y: {
                    suggestedMin: -10,
                    suggestedMax: 20
                }
            }

        }

    });
    
}

//Fetching the data and calling the populateTable and drawTemperatureChart functions
fetchMeasurements = async () =>{

    let response;

    //fetching the data from a different site depending on the timespan selected
    try {
        if(selection == 0){
          response = await fetch("https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature");
        }
        else response = await fetch("https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/" + selection);


        jsonData = await response.json();
        populateTable();
        drawTemperatureChart();
    } catch (error) {
       console.error(error); 
    }
}

//Making it so that the chart and the table are redone if the timespan is changed
const selectElement = document.getElementById("timespanSelect");
selectElement.addEventListener("change", (event) =>{
    document.getElementById("temperature-table").innerHTML="";
    selection = selectElement.value;
    fetchMeasurements();
})

fetchMeasurements();