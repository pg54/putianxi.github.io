<template>
<div class="mainContent">
    <main-search></main-search>
    <!-- <leaflet-map></leaflet-map> -->
    <div id="bMap"></div>
    <!-- <baidu-map-test></baidu-map-test> -->
</div>


</template>

<script>
    import MainSearch from '../uielements/MainSearch.vue'
    import LeafletMap from '../uielements/LeafletMap.vue'
    import messageBus from '../utilities/messageBus.js'
    import {
        MP
    } from '../utilities/map.js'
    // import baiduMapTest from '../uielements/baiduMapTest.vue'

    const direct_city = ['北京市', '天津市', '上海市', '重庆市'];

    export default {
        components: {
            MainSearch,
            LeafletMap
        },
        data() {
            return {
                init_content_data: null,
                data_url: '../../assets/data/constructSite.json',
                ak: 'z0IfzZwyq7tGSjqzkBjDWWEe2kgKwuNa'
            };
        },
        methods: {
            fetchData(url) {
                this.$http.get(url).then((response) => {
                    this.init_content_data = response.json();
                    this.dataInit();
                });
            },

            initListenMsg() {
                messageBus.$on('area-select-update', (select_area) => {
                    console.log('select_area');
                    console.log(select_area);
                    // this.filterSelectData(select_area);
                });
            },

            filterSelectData(select_area) {
                // select all province
                if (select_area.province === 'all') {
                    this.notifyDataUpdate(this.init_content_data);
                    return;
                }

                let province_list = [];
                let city_list = [];

                // filter province
                for (let el of this.init_content_data.features) {
                    let properties = el.properties;
                    if (properties.province === select_area.province) {
                        province_list.push(el);
                    }
                }

                // filter city:
                if (select_area.city !== "all") {
                    for (let el of province_list) {
                        let city_name = null;
                        // 分离是否为直辖市
                        if (direct_city.indexOf(select_area.province) === -1) {
                            city_name = el.properties.city
                        } else {
                            city_name = el.properties.district
                        }

                        // 过滤本市数据
                        if (city_name === select_area.city) {
                            city_list.push(el)
                        }
                    }
                } else {
                    city_list = province_list;
                }

                let new_geojson_data = {
                    type: "FeatureCollection",
                    features: city_list
                }

                this.notifyDataUpdate(new_geojson_data);
            },
            dataInit() {
                messageBus.$emit('map-data-init', this.init_content_data);
                messageBus.$emit('searchbox-data-init', this.init_content_data);
                // sidebar only need update
                messageBus.$emit('sidebar-data-update', this.init_content_data);
            },
            notifyDataUpdate(data) {
                messageBus.$emit('map-data-update', data);
                messageBus.$emit('sidebar-data-update', data);
            },
            // initBaiduMap() {
            //     console.log(BMap);
            //     var map = new BMap(this.ak).Map("bMap");
            //     map.centerAndZoom(new BMap.Point(117.269945,31.86713), 13);
            //     map.enableScrollWheelZoom(true);
            // }
        },
        ready() {
            this.$nextTick(function () {
                var _this = this;
                MP(_this.ak).then(BMap => {
                    //在此调用api  
                    var map = new BMap.Map("bMap");

                    map.centerAndZoom(new BMap.Point(117.269945,31.86713), 4)
                    map.enableScrollWheelZoom(true);
                    map.addControl(new BMap.NavigationControl());    
                    map.addControl(new BMap.ScaleControl());    
                    map.addControl(new BMap.OverviewMapControl());  





                    console.log('多个位置点');
                    let adds = this.init_content_data.map(ele => ele.address);
                    console.log(adds);

                    var myGeo = new BMap.Geocoder();




                    myGeo.getPoint("南宁", function(point){
                        if (point) {
                            map.centerAndZoom(point, 16);
                            map.addOverlay(new BMap.Marker(point));
                        }else{
                            alert("您选择地址没有解析到结果!");
                        }
                    }, "中国");

                    
                    myGeo.getPoint("济南", function(point){
                        if (point) {
                            map.centerAndZoom(point, 16);
                            map.addOverlay(new BMap.Marker(point));
                        }else{
                            alert("您选择地址没有解析到结果!");
                        }
                    }, "中国");

                    
                    myGeo.getPoint("成都", function(point){
                        if (point) {
                            map.centerAndZoom(point, 16);
                            map.addOverlay(new BMap.Marker(point));
                        }else{
                            alert("您选择地址没有解析到结果!");
                        }
                    }, "中国");

                        





                    // myGeo.getPoint(add, function (point) {
                    //     if (point) {

                    //         var address = new BMap.Point(point.lng, point.lat);
                    //         addMarker(address, new BMap.Label(i + ":" + add, {
                    //             offset: new BMap.Size(20, -10)
                    //         }));
                    //     }
                    // }, "中国");



                    // // 编写自定义函数,创建标注
                    // function addMarker(point, label) {
                    //     var marker = new BMap.Marker(point);
                    //     map.addOverlay(marker);
                    //     marker.setLabel(label);
                    // }



                    

                })
            })
            this.fetchData(this.data_url);
            this.initListenMsg();
        },
    }
</script>

<style scoped>
.mainContent {
    width: 100%;
    height: 50vh;
}
#bMap {
    width: 100%;
    height: calc( 50vh - 32px);
}
</style>