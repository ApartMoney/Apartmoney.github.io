$(function(){
    getApartDatas();
});

// based on prepared DOM, initialize echarts instance
var myChart = echarts.init(document.getElementById('main'));
var apartDatas;
var apartMaxDatas;
var area1 = ['193-1', '185-1', '168-1', '165-10', '165-7', '164-1'];
var area2 = ['762-2', '116-6', '160-1', '165-2', '165-13', '166-1', '130-2', '130-4'];
var area3 = ['107-1', '139-1', '150-1', '155-2', '155-17', '156-1', '149-2', '115-1'];
var area4 = ['154-1','970-1','155-9','155-12','159-1','184-1'];
var area5 = ['102-2','102-3','102-10','102-16','103-26','103-2','103-6','103-27','103-15','103-16','104-13','104-2'];
var area6 = ['82-1', '83-1', '85-1'];

function refreshCharts(){
    myChart.clear();
    var treeMapData = [{
        "value": 0,
        "name": "1단지",
        "path": "1단지",
        "children": []
    },{
        "value": 0,
        "name": "2단지",
        "path": "2단지",
        "children": []
    },{
        "value": 0,
        "name": "3단지",
        "path": "3단지",
        "children": []
    },{
        "value": 0,
        "name": "4단지",
        "path": "4단지",
        "children": []
    },{
        "value": 0,
        "name": "5단지",
        "path": "5단지",
        "children": []
    },{
        "value": 0,
        "name": "6단지",
        "path": "6단지",
        "children": []
    }]

    for(var i = 0 ; i < apartDatas.length ; i ++){
        var data = apartDatas[i];
        if(data.cancelYN == 'Y'){
            continue;
        }
        var index = getRootIndex(data);

        if($('#area'+(index+1)).prop('checked')){
            var money = parseInt(data.dealMoney.replace(",",""));
            treeMapData[index].value += money;
            var mapData = {
                "value": money,
                "name": data.apartName,
                "dealFloor" : data.dealFloor,
                "maxMoney" : getMaxMoney(data.apartAddress, data.apartSize),
                "apartSize" : data.apartSize,
                "dealDate" : data.dealYear + '. ' + data.dealMonth + '. ' + data.dealDay,
                "path": (index+1) + "단지/" + data.apartName
            }
            treeMapData[index].children.push(mapData);
        }
    }

    myChart.setOption(option = {
        /*             tooltip: {
                        formatter: function (info) {
                            var value = info.value;
                            var treePathInfo = info.treePathInfo;
                            var treePath = [];

                            for (var i = 1; i < treePathInfo.length; i++) {
                                treePath.push(treePathInfo[i].name);
                            }

                            return [
                                '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                                'Disk Usage: ' + formatUtil.addCommas(value) + ' KB',
                            ].join('');
                        }
                    }, */
        series: [
            {
                name: '청라실',
                type: 'treemap',
                upperLabel: {
                    show: true,
                    height: 50,
                    formatter: function (params) {
                        var arr = [
                            '{name|' + params.name + ' (' + echarts.format.addCommas(params.value) + '만)}'
                        ];

                        return arr.join('\n');
                    },
                    rich: {
                        name: {
                            fontSize: 25,
                            color: '#fff',
                            lineHeight: 50
                        }
                    }
                },
                label: {
                    normal: {
                        position: 'insideTopLeft',
                        formatter: function (params) {
                            var arr = [
                                '{name|' + params.name + '}',
                                '{hr|}',
                                '{budget| 금액 : ' + echarts.format.addCommas(params.value) + '}',
                                '{dealDate| 최고가 대비 : ' + (params.value / parseInt(params.data.maxMoney.replace(',',''), 10) * 100).toFixed(2) + '%}',
                                '{dealDate| 최고가 : ' + echarts.format.addCommas(params.data.maxMoney) + '}',
                                '{dealDate| 전용 ' + params.data.apartSize + 'm² (' + params.data.dealFloor + '층)' + '}',
                                '{dealDate| 거래일 : ' + params.data.dealDate+'}'
                            ];

                            return arr.join('\n');
                        },
                        rich: {
                            budget: {
                                fontSize: 20,
                                lineHeight: 30,
                                color: 'yellow'
                            },
                            dealDate: {
                                fontSize: 15,
                                lineHeight: 30,
                                color: '#fff'
                            },
                            name: {
                                fontSize: 15,
                                color: '#fff'
                            },
                            hr: {
                                width: '100%',
                                borderColor: 'rgba(255,255,255,0.2)',
                                borderWidth: 0.5,
                                height: 0,
                                lineHeight: 10
                            }
                        }
                    }
                },
                itemStyle: {
                    borderColor: '#fff'
                },
                levels: getLevelOption(),
                data: treeMapData
            }
        ]
    });
}

function getRootIndex(data){
    if(area1.indexOf(data.apartAddress) != -1){
        return 0;
    }else if(area2.indexOf(data.apartAddress) != -1){
        return 1;
    }else if(area3.indexOf(data.apartAddress) != -1){
        return 2;
    }else if(area4.indexOf(data.apartAddress) != -1){
        return 3;
    }else if(area5.indexOf(data.apartAddress) != -1){
        return 4;
    }else if(area6.indexOf(data.apartAddress) != -1){
        return 5;
    }
}

function colorMappingChange(value) {
    var levelOption = getLevelOption(value);
    chart.setOption({
        series: [{
            levels: levelOption
        }]
    });
}

var formatUtil = echarts.format;

function getLevelOption() {
    return [
        {
            itemStyle: {
                borderColor: '#777',
                borderWidth: 0,
                gapWidth: 1
            },
            upperLabel: {
                show: false
            }
        },
        {
            itemStyle: {
                borderColor: '#555',
                borderWidth: 2,
                gapWidth: 1
            },
            emphasis: {
                itemStyle: {
                    borderColor: '#ddd'
                }
            }
        },
        {
            colorSaturation: [0.35, 0.5],
            itemStyle: {
                borderWidth: 2,
                gapWidth: 1,
                borderColorSaturation: 0.6
            }
        }
    ];
}

for(var i = 0 ; i < 15 ; i ++){
    var toDay = new Date();
    toDay.setDate(toDay.getDate() - i);

    $('#dealDate').append( '<option value="' + toDay.getFullYear() +  ( (toDay.getMonth()+1) < 10 ? "0" + (toDay.getMonth()+1) : ""+(toDay.getMonth()+1) ) + ( toDay.getDate() < 10 ? "0" + toDay.getDate()  : "" + toDay.getDate() ) + '">' + toDay.getFullYear() + '. ' + ( (toDay.getMonth()+1) < 10 ? "0" + (toDay.getMonth()+1) : ""+(toDay.getMonth()+1) )  + '. ' +  ( toDay.getDate() < 10 ? "0" + toDay.getDate()  : "" + toDay.getDate() ));
}

$('#dealDate').append('<option value="maxDelaData">모든신고가');

function getApartDatas(){
    myChart.clear();
    myChart.showLoading();
    $.get('maxDelaData.json',function(datas){
        apartMaxDatas = datas;

        $.get($('#dealDate').val() + '.json',function(datas){
            apartDatas = datas;

            if(apartDatas.length > 0){
                refreshCharts();
            }else{
                alert('등록된 거래 데이터가 없습니다.');
            }
            myChart.hideLoading();
        }).fail(function(){
            alert('등록된 거래 데이터가 없습니다.');
            myChart.hideLoading();
        });

    }).fail(function(){
        alert('등록된 거래 데이터가 없습니다.');
        myChart.hideLoading();
    });
}

function getMaxMoney(address, size) {
    for (var i = 0; i < apartMaxDatas.length; i++) {
        if (apartMaxDatas[i].apartAddress == address && apartMaxDatas[i].apartSize == size)
            return apartMaxDatas[i].dealMoney;
    }
}