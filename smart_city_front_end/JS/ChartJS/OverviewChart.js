console.log("Ran");

var ctx = document.getElementById("myChart").getContext('2d');


var fillData = [
        {
            fill_level: 20,
            date: new Date(2012, 01, 3)
        },
        {
            fill_level: 30,
            date: new Date(2012, 02, 5)
        },
        {
            fill_level: 40,
            date: new Date(2012, 03, 6)
        },
        {
            fill_level: 55,
            date: new Date(2012, 04, 9)
        },
        {
            fill_level: 76,
            date: new Date(2012, 05, 12)
        },
    ];


    var labels = [];
    var data = [];

    for (var i = 0; i < fillData.length; i++) {
        labels.push(fillData[i].date.getMonth() + "/" + fillData[i].date.getDay());
        data.push(fillData[i].fill_level);
    }

 new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '# of Votes',
                data: data,
                backgroundColor: [
                'rgba(54, 162, 235, 0.2)'
            ],
                borderWidth: 1
        }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Fill Level % (Percentage)'
                    },
                    ticks: {
                        beginAtZero: true,
                        max: 100
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date (Month/Day)'
                    }
                }]
            }
        }
    });