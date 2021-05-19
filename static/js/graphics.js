window.onload = function () {
    const requestCtx = document.getElementById('requestChart').getContext('2d'); 
    const responseCtx = document.getElementById('responseChart').getContext('2d');

    var requestChart = new Chart(requestCtx, {
        type: 'line',
        data: {
            labels: "red",
            datasets: [{
                label: 'GET',
                data: 1,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1,
                tension: 0.3
            },
                {
                    label: 'POST',
                    data: 0,
                    backgroundColor: [
                        'rgba(99, 132, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(99, 132, 255, 1)'
                    ],
                    borderWidth: 1,
                    tension: 0.3
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    var responseChart = new Chart(responseCtx, {
        type: 'line',
        data: {
            labels: "red",
            datasets: [{
                label: '200',
                data: 1,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1,
                tension: 0.3
            },
            {
                label: '400',
                data: 0,
                backgroundColor: [
                    'rgba(99, 132, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(99, 132, 255, 1)'
                ],
                borderWidth: 1,
                tension: 0.3
            }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    function toNormalTime(time) {
        hours = new Date(time).getHours().toString();
        mins = new Date(time).getMinutes().toString();
        return hours + ':' + mins;
    }

    let rawTime = [];
    let normalTime = [];
    let now = new Date();
    for (let i = 14; i > -1; i--) {
        temp = now - (i * 1000 * 60);
        rawTime.push(temp);
        normalTime.push(toNormalTime(temp));
    }

    function updateReqs(data) {
        getData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        postData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        data.forEach(member => {
            for (let i = 0; i < normalTime.length; i++) {
                if (toNormalTime(member.time) == normalTime[i]) {
                    if (member.method == "GET") {
                        getData[i]++;
                    }
                    if (member.method == "POST") {
                        postData[i]++;
                    }
                    break;
                }
            }
        });
        requestChart.data.labels = normalTime;
        requestChart.data.datasets[0].data = getData;
        requestChart.data.datasets[1].data = postData;
        requestChart.update();
    };

    function updateRes(data) {
        code200 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        code400 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        data.forEach(member => {
            for (let i = 0; i < normalTime.length; i++) {
                if (toNormalTime(member.time) == normalTime[i]) {
                    if (member.code == 200) {
                        code200[i]++;
                    }
                    if (member.code >= 400 && member.code < 500) {
                        code400[i]++;
                    }
                    break;
                }
            }
        });
        responseChart.data.labels = normalTime;
        responseChart.data.datasets[0].data = code200;
        responseChart.data.datasets[1].data = code400;
        responseChart.update();
    };

    ajaxCall();
    
    window.setInterval(
        ajaxCall
        , 60000);

    function ajaxCall() {
        $.getJSON("/requests", function (data) {
            updateReqs(data);
        });
        $.getJSON("/responses", function (data) {
            updateRes(data);
        });
    }
}

