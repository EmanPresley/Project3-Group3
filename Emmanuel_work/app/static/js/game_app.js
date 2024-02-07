// select the dropdown
let dropdown = d3.selectAll("#dropdown").attr("selected", "selected");

// add an event listener for a CHANGE
dropdown.on("change", function () {
  let selectedValue = dropdown.value;
  
  // on change, do work
  doWork();
});

// get the new data
function doWork() {
  let category = dropdown.property("value");

  // grab the data
  let url = `/api/v1.0/games/${category}`;

  // make request
  d3.json(url).then(function (data) {
    console.log(data);

    makeBar1(data,category);
    makeBar2(data,category);
    //make metadata chart
    // makeMeta(data);
  });
}



function makeBar1(data, category) {

  // Trace for the Data
  let trace = {
    x: data.bar1_data.map(row => row.values).reverse(),
    y: data.bar1_data.map(row => row.labels).reverse(),
    type: "bar",
    orientation: "h",
    marker: {
      color: "red"
    }
  };

  // Data array
  let traces = [trace];

  // Apply a title to the layout
  let layout = {
    title: `Top 10 ${category}`,
    margin: { l: 250 },
    plot_bgcolor: "3d3867", // Set the background color here
    paper_bgcolor: "3d3867", // Set the border color here
    titlefont: {
      color: "white" // Set the title color here
    }
    
  };
  
  if (category === "genre") {
    layout.title = `The genres with the most amount of titles`;

    layout.xaxis = {
      title: "# of Titles in Genre",
      color: "white"
    };
    layout.yaxis = {
      title: "Genre",
      color: "white"
    };
  } else if (category === "rating") {
    layout.title = `The titles with the highest ratings`;
    layout.xaxis = {
      title: "Rating",
      color: "white"
    };
    layout.yaxis = {
      title: "Title",
      color: "white"
    };
  } else if (category === "plays") {
    layout.title = `The titles with the most amount of plays`;

    layout.xaxis = {
      title: "# of Times Played",
      color: "white"
    };
    layout.yaxis = {
      title: "Title",
      color: "white"
    };

    // Adjust the margin to 500 if the category is "plays"
    layout.margin.l = 275;
  }

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar1", traces, layout);

}

function makeMeta(data) {
  let panel = d3.select("#sample-metadata");
  panel.html("");

  //loop through each key in the dictionary 
 
  for (let i = 0; i < 5; i++){
    let row = data.map_data[i];
    panel.append("p").text(`Title: ${row["Title"]}`);
    panel.append("p").text(`Rating: ${row["Rating"]}`);   
    panel.append("p").text(`Publisher: ${row["Publisher"]}`);
  

    panel.append("hr")

  }
}

function makeBar2(data, category) {
  // Trace for the Data
  let trace = {
    x: data.bar2_data.map(row => row.values).reverse(),
    y: data.bar2_data.map(row => row.labels).reverse(),
    type: "bar",
    orientation: "h",
    marker: {
      color: "red"
    }
  };

  // Data array
  let traces = [trace];

  // Apply a title to the layout
  let layout = {
    title: `Bottom 10 ${category}`,
    margin: { l: 200 },
    plot_bgcolor: "3d3867", // Set the background color here
    paper_bgcolor: "3d3867", // Set the border color here
    titlefont: {
      color: "white" // Set the title color here
    }
  };

  // Apply a title and labels to the layout
  if (category === "genre") {
    layout.title = `The genres with the least amount of titles`;
    layout.xaxis = {
      title: "# of Titles in Genre",
      color: "white"
    };
    layout.yaxis = {
      title: "Genre",
      color: "white"
    };
    document.getElementById("genre-paragraph").style.display = "block";
    document.getElementById("rating-paragraph").style.display = "none";
    document.getElementById("plays-paragraph").style.display = "none";
  } else if (category === "rating") {
    layout.title = `The titles with the lowest ratings`;
    layout.xaxis = {
      title: "Rating",
      color: "white"
    };
    layout.yaxis = {
      title: "Title",
      color: "white"
    };
    document.getElementById("genre-paragraph").style.display = "none";
    document.getElementById("rating-paragraph").style.display = "block";
    document.getElementById("plays-paragraph").style.display = "none";
  } else if (category === "plays") {
    layout.title = `The titles with the least amount of plays`;
    layout.xaxis = {
      title: "# of Times Played",
      color: "white"
    };
    layout.yaxis = {
      title: "Title",
      color: "white"
    };
    layout.margin.l = 300;
    document.getElementById("genre-paragraph").style.display = "none";
    document.getElementById("rating-paragraph").style.display = "none";
    document.getElementById("plays-paragraph").style.display = "block";
  }

  // Render the plot to the div tag with id "bar2"
  Plotly.newPlot("bar2", traces, layout);
}


// INITIALIZE plot on page load
doWork();

