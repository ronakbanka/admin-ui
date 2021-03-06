
$(document).ready(function()
{
    AdminStats.startup();
});

var AdminStats =
{
    startup: function()
    {
        var deferred = $.ajax({
                                  url: Constants.URL__STATS,
                                  dataType: "json",
                                  type: "GET"
                              });

        deferred.done(function(response, status)
        {            
            AdminStats.data = response;

            AdminStats.initialize();
        });

        deferred.fail(function(xhr, status, error)
        {
            window.location.href = "login.html";
        });        
    },

    initialize: function()
    {
        $(window).resize(this.resize);

        $("#Label").text(this.data.label);

        var config = {
                         "sPaginationType": "full_numbers",
                         "aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
                         "iDisplayLength": 100,
                         "sScrollY": "219px",
                         "bScrollCollapse": true,
                         "sDom": 'T<"clear">lfrtip',
                         "bAutoWidth": false,
                         "aaSorting": [[0, "desc"]],
                         "oTableTools": {
                                            "aButtons": [],
                                            "sRowSelect": "none"
                                        }
                     };

        config["aoColumns"] = [
                                  {
                                      "sTitle":  "Date",
                                      "sWidth":  "170px",
                                      "mRender": Format.formatDateNumber
                                  },
                                  {
                                      "sTitle":  "Organizations",
                                      "sWidth":  "110px",
                                      "sClass":  "cellRightAlign",
                                      "sType":   "formatted-num",
                                      "mRender": Format.formatNumber
                                  },
                                  {
                                      "sTitle":  "Spaces",
                                      "sWidth":  "80px",
                                      "sClass":  "cellRightAlign",
                                      "sType":   "formatted-num",
                                      "mRender": Format.formatNumber
                                  },
                                  {
                                      "sTitle":  "Users",
                                      "sWidth":  "80px",
                                      "sClass":  "cellRightAlign",
                                      "sType":   "formatted-num",
                                      "mRender": Format.formatNumber
                                  },
                                  {
                                      "sTitle":  "Apps",
                                      "sWidth":  "80px",
                                      "sClass":  "cellRightAlign",
                                      "sType":   "formatted-num",
                                      "mRender": Format.formatNumber
                                  },
                                  {
                                      "sTitle":  "Total",
                                      "sWidth":  "80px",
                                      "sClass":  "cellRightAlign",
                                      "sType":   "formatted-num",
                                      "mRender": Format.formatNumber
                                  },
                                  {
                                      "sTitle":  "Running",
                                      "sWidth":  "80px",
                                      "sClass":  "cellRightAlign",
                                      "sType":   "formatted-num",
                                      "mRender": Format.formatNumber
                                  },
                                  {
                                      "sTitle":  "DEAs",
                                      "sWidth":  "80px",
                                      "sClass":  "cellRightAlign",
                                      "sType":   "formatted-num",
                                      "mRender": Format.formatNumber
                                  }
                              ];

        this.statisticsTable = $("#StatisticsTable").dataTable(config);

        Table.addClearFilterButton("StatisticsTableContainer", this.statisticsTable);

        var tableData = [];

        var items = this.data.items;

        for (var index in items)
        {
            var item = items[index];

            var row = [];

            Stats.updateStatsTableRow(row, item);

            tableData.push(row);
        }

        this.statisticsTable.fnAddData(tableData);


        var stats = Stats.buildStatsData(items);

        this.chart = Stats.createStatsChart("Chart", stats);


        document.body.style.visibility = "visible";


        this.resize();

        //Stats.hideChartSeries("Chart", [1, 4]);
    },

    resize: function()
    {
        AdminStats.statisticsTable.fnDraw();

        var windowHeight = $(window).height();
        var windowWidth  = $(window).width();

        var tablePosition = $("#StatisticsTableContainer").position();
        var tableHeight   = $("#StatisticsTableContainer").outerHeight(true);
        var tableWidth    = $("#StatisticsTableContainer").outerWidth(true);

        var maxHeight = windowHeight - tablePosition.top  - tableHeight - 50;        
        var maxWidth  = windowWidth  - tablePosition.left - tableWidth  - 60;        

        var minChartWidth  = 500;
        var minChartHeight = 260;

        if (windowWidth > (tableWidth + minChartWidth))
        {
            $("#Chart").width(maxWidth);
            $("#Chart").height(Math.max(tableHeight - 40, minChartHeight));
        }
        else
        {
            $("#Chart").width(tableWidth - 40);
            $("#Chart").height(Math.max(maxHeight, minChartHeight));
        }

        AdminStats.chart.replot({resetAxes: true});
    }
};

