/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.2788196132014, "KoPercent": 4.721180386798595};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9505956038111307, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.994240129225145, 500, 1500, "OAuth CURL API Request (cached)"], "isController": false}, {"data": [0.9295055197634289, 500, 1500, "UMA_CURL_API_Request (cache)"], "isController": false}, {"data": [0.24, 500, 1500, "Mix_Customer_Login"], "isController": false}, {"data": [0.9894607843137255, 500, 1500, "Mix_CURL_API_Request (cache)"], "isController": false}, {"data": [0.17857142857142858, 500, 1500, "Login_Consumer"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "UMA-RS-check-access"], "isController": false}, {"data": [0.9064757481940144, 500, 1500, "Basic CURL API Request"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": false}, {"data": [0.01, 500, 1500, "Mix_CURL_API_Request (no cache)"], "isController": false}, {"data": [0.275, 500, 1500, "Login_Uma"], "isController": false}, {"data": [0.01904761904761905, 500, 1500, "UMA-get-RPT"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "UMA_CURL_API_Request (no cache)"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler"], "isController": false}, {"data": [0.905, 500, 1500, "OAuth CURL API Request (no cache)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 545245, 25742, 4.721180386798595, 184.6435639024612, 0, 68064, 26.0, 30.0, 15113.980000000003, 450.3283855259289, 466.7152856232945, 0.20814780260032442], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["OAuth CURL API Request (cached)", 141149, 100, 0.07084711900190578, 176.40236912765914, 11, 1964, 292.0, 333.0, 409.0, 470.67081486816784, 514.9173976923545, 0.0], "isController": false}, {"data": ["UMA_CURL_API_Request (cache)", 145749, 10261, 7.040185524428984, 138.97196550233812, 6, 805, 342.0, 376.0, 430.0, 487.59835670699067, 427.75118727459926, 0.0], "isController": false}, {"data": ["Mix_Customer_Login", 100, 0, 0.0, 8005.66, 66, 16172, 15091.6, 15222.25, 16164.589999999997, 0.8757794437048974, 0.21531003413350383, 0.3814429998949065], "isController": false}, {"data": ["Mix_CURL_API_Request (cache)", 106080, 1118, 1.053921568627451, 211.19295814479605, 8, 48877, 26.0, 30.0, 15113.980000000003, 342.91255859059316, 372.1248371080491, 0.0], "isController": false}, {"data": ["Login_Consumer", 168, 48, 28.571428571428573, 8312.696428571431, 73, 15210, 15110.1, 15134.05, 15204.48, 0.8635223487807887, 0.20262898865084913, 0.37526117696040134], "isController": false}, {"data": ["UMA-RS-check-access", 105, 0, 0.0, 10291.485714285714, 87, 40724, 24211.800000000007, 27766.899999999994, 40288.459999999985, 0.5107500729642961, 0.166183784901255, 0.20144986136783732], "isController": false}, {"data": ["Basic CURL API Request", 151164, 14102, 9.328940753089359, 165.3710407239812, 7, 1642, 326.0, 365.0, 415.9900000000016, 503.81954165500144, 556.6680533492231, 0.0], "isController": false}, {"data": ["Login", 100, 0, 0.0, 123.86, 64, 305, 180.8, 202.89999999999998, 304.1899999999996, 0.9949456759660923, 0.23513364607792417, 0.41682782713813826], "isController": false}, {"data": ["Mix_CURL_API_Request (no cache)", 100, 93, 93.0, 25406.860000000004, 1148, 68064, 39989.5, 52259.95, 68049.31999999999, 0.7678781223844151, 2.216288230732018, 0.0], "isController": false}, {"data": ["Login_Uma", 120, 15, 12.5, 5218.466666666665, 22, 15148, 15055.8, 15077.5, 15144.85, 0.6146942664392298, 0.14481932790865643, 0.26712787945845434], "isController": false}, {"data": ["UMA-get-RPT", 105, 0, 0.0, 15369.304761904763, 936, 39782, 23148.200000000004, 29410.09999999999, 39526.87999999999, 0.4768890483565495, 0.11496432415738247, 0.0], "isController": false}, {"data": ["UMA_CURL_API_Request (no cache)", 105, 5, 4.761904761904762, 104.52380952380952, 11, 453, 228.4, 313.9999999999999, 452.4, 0.47803105836076326, 0.4209847738571643, 0.0], "isController": false}, {"data": ["JSR223 Sampler", 100, 0, 0.0, 0.41000000000000003, 0, 8, 1.0, 2.9499999999999886, 7.949999999999974, 1.0091224671026076, 0.0, 0.0], "isController": false}, {"data": ["OAuth CURL API Request (no cache)", 100, 0, 0.0, 386.54, 48, 2215, 1163.6000000000006, 1631.6499999999976, 2213.349999999999, 0.9927134830345266, 1.1318581766086924, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected not to contain \/error\/", 63, 0.2447362287312563, 0.011554438830250622], "isController": false}, {"data": ["0/OK", 1311, 5.092844378836143, 0.24044236994378673], "isController": false}, {"data": ["7/OK", 24368, 94.6624193924326, 4.469183578024558], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 545245, 25742, "7/OK", 24368, "0/OK", 1311, "Test failed: text expected not to contain \/error\/", 63, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["OAuth CURL API Request (cached)", 141149, 100, "0/OK", 100, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["UMA_CURL_API_Request (cache)", 145749, 10261, "7/OK", 10261, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Mix_CURL_API_Request (cache)", 106080, 1118, "0/OK", 1118, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login_Consumer", 168, 48, "Test failed: text expected not to contain \/error\/", 48, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Basic CURL API Request", 151164, 14102, "7/OK", 14102, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Mix_CURL_API_Request (no cache)", 100, 93, "0/OK", 93, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login_Uma", 120, 15, "Test failed: text expected not to contain \/error\/", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["UMA_CURL_API_Request (no cache)", 105, 5, "7/OK", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
