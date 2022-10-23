let jsonData = {};


//Populating the table with all the information
const populateTable = () =>{
    const table = document.getElementById("measurements-table");

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

        //Getting the measurement type
        const measurementColumn = document.createElement("td");
        measurementColumn.className = "measurement-column";
        measurementColumn.innerHTML = Object.keys(item.data);
        row.appendChild(measurementColumn);

        const valueColumn = document.createElement("td");
        valueColumn.className = "value-column";
        const value = Object.values(item.data);
        //formatting the value data
        valueColumn.innerHTML = value[0].toFixed(2);
        row.appendChild(valueColumn);


        table.appendChild(row);
    })
}


//Fetching the data and calling the populateTable function
fetchMeasurements = async () =>{
    try {
        const response = await fetch("https://webapi19sa-1.course.tamk.cloud/v1/weather/limit/50");
        jsonData = await response.json();
        populateTable();
    } catch (error) {
       console.error(error) 
    }
}

fetchMeasurements();