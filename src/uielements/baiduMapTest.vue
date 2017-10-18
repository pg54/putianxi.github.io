<template>
    <div id="XSDFXPage" class="XSDFXPage"></div>
</template>
<script>
    export default {
        name:'',
        data () {
            return {

            }
        },
        ready() {
            // 百度地图API功能
            // 创建Map实例
            var map = new BMap.Map("XSDFXPage",{enableMapClick:true});
            // 初始化地图,设置中心点坐标和地图级别
            map.centerAndZoom(new BMap.Point(116.4035,39.915), 11);
            // 添加地图类型控件
            map.addControl(new BMap.MapTypeControl());
            // 设置地图显示的城市 此项是必须设置的
            map.setCurrentCity("杭州");
            // 开启鼠标滚轮缩放
            map.enableScrollWheelZoom(true);
            // 设置定时器，对地图进行自动移动
            setTimeout(function(){
                map.panTo(new BMap.Point(113.262232,23.154345));
            }, 2000);
            setTimeout(function(){
                map.setZoom(14);
            },4000);
            /************************************************
             添加折线
             *************************************************/
            var pointGZ = new BMap.Point(113.262232,23.154345);
            var pointHK = new BMap.Point(110.35,20.02);
            setTimeout(function(){
                var polyline = new BMap.Polyline([pointGZ,pointHK],{strokeColor:"blue",strokeWeight:5,strokeOpacity:0.5});
                map.addOverlay(polyline);
            },6000);
            /************************************************
             添加工具条、比例尺控件
             *************************************************/
            map.addControl(new BMap.ScaleControl({anchor:BMAP_ANCHOR_TOP_LEFT}));
            map.addControl(new BMap.NavigationControl());
            map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,type:BMAP_NAVIGATION_CONTROL_SMALL}));
            /************************************************
             添加定位相关控件
             *************************************************/
            var navigationControl = new BMap.NavigationControl({
                //靠左上角
                anchor:BMAP_ANCHOR_TOP_LEFT,
                //LARGE类型
                type:BMAP_NAVIGATION_CONTROL_LARGE,
                //启用显示定位
                enableGeolocation:true
            });
            map.addControl(navigationControl);
            //添加定位控件
            var geolocationControl = new BMap.GeolocationControl();
            geolocationControl.addEventListener("localtionSuccess",function(e) {
                //定位成功事件
                var address = '';
                address += e.addressComponent.province;
                address += e.addressComponent.city;
                address += e.addressComponent.district;
                address += e.addressComponent.street;
                address += e.addressComponent.streetNumber;
                alert("当前定位地址为："+ address);
            });
            geolocationControl.addEventListener("locationError",function(e) {
                //定位失败事件
                alert(e.message);
            });
            map.addControl(geolocationControl);

            /************************************************
             添加自定义控件类，放大ZoomControl
             *************************************************/
            function ZoomControl() {
                //默认停靠位置和偏移量
                this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
                this.defaultOffset = new BMap.Size(50,23);
            }
            //通过JavaScript的prototype属性继承于BMap.Control
            ZoomControl.prototype = new BMap.Control();
            //自定义控件必须实现自己的initialize方法，并且将控件的DOM元素返回
            //在本方法中创建div容器，并将其添加到地图容器中
            ZoomControl.prototype.initialize = function(map) {
                //创建一个DOM元素
                var div = document.createElement('div');
                //添加文字说明
                div.appendChild(document.createTextNode('放大两级'));
                //添加样式
                div.style.color = '#40C5CC';
                div.style.cursor = 'pointer';
                div.style.border = '3px solid gray';
                div.style.backgroundColor = '#eee';
                //绑定事件，点击触发
                div.onclick = function(e) {
                    map.setZoom(map.getZoom() + 2);
                }
                //添加DOM元素到地图上
                map.getContainer().appendChild(div);
                //将DOM元素返回
                return div;
            }
            //创建控件
            var myZoomCtrl = new ZoomControl();
            map.addControl(myZoomCtrl)

            /************************************************
             添加添加城市列表控件
             *************************************************/
            map.addControl(new BMap.CityListControl({
                anchor:BMAP_ANCHOR_BOTTOM_RIGHT,
                offset:new BMap.Size(130,23)
                // 切换城市之间事件
                // onChangeBefore: function(){
                //    alert('before');
                // },
                // 切换城市之后事件
                // onChangeAfter:function(){
                //   alert('after');
                // }
            }));
            /************************************************
             添加新图标
             *************************************************/
                //定义新图标
            var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/fox.gif",new BMap.Size(300,157));
            //创建标注
            var marker = new BMap.Marker(pointHK,{icon:myIcon});
            var marker1 = new BMap.Marker(pointGZ,{icon:myIcon});
            //将标注放大地图上
            map.addOverlay(marker);
            map.addOverlay(marker1);
            //文字提示
            var label = new BMap.Label('广州西站',{offset:new BMap.Size(140,10)});
            marker1.setLabel(label);
            //添加新图标的监听事件
            marker1.addEventListener('click',function(){
                var p = marker1.getPosition();//获取位置
                alert("点击的位置是：" + p.lng + ',' + p.lat);
            })

            /************************************************
             添加曲线
             *************************************************/
            var beijingPosition=new BMap.Point(116.432045,39.910683),
                hangzhouPosition=new BMap.Point(120.129721,30.314429),
                taiwanPosition=new BMap.Point(121.491121,25.127053);
            var point = [beijingPosition,hangzhouPosition,taiwanPosition];

            var curve = new BMapLib.CurveLine(point, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});//创建弧线
            map.addOverlay(curve);//添加到地图上
            curve.enableEditing();//开启编辑功能

            /************************************************
             给地图添加右键菜单
             *************************************************/
            var menu = new BMap.ContextMenu();

            var txtMenuItem = [
                {
                    text:'放大',
                    callback:function(){map.zoomIn()}
                },
                {
                    text:'缩小',
                    callback:function(){map.zoomOut()}
                }
            ];
            for(var i=0; i < txtMenuItem.length; i++){
                menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
            }
            map.addContextMenu(menu);

            setTimeout(function(){
                map.centerAndZoom(new BMap.Point(116.404, 39.915), 15); //地位

                var myP1 = new BMap.Point(116.380967,39.913285);    //起点
                var myP2 = new BMap.Point(116.424374,39.914668);    //终点
                var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/Mario.png", new BMap.Size(32, 70), {    //小车图片
                    //offset: new BMap.Size(0, -5),    //相当于CSS精灵
                    imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
                });
                var driving2 = new BMap.DrivingRoute(map,{renderOptions:{map:map,autoViewport:true}});//驾车实例
                driving2.search(myP1,myP2);//显示一条公路

                window.run = function() {
                    var driving = new BMap.DrivingRoute(map);
                    driving.search(myP1,myP2);
                    driving.setSearchCompleteCallback(function(){
                        var pts = driving.getResults().getPlan(0).getRoute(0).getPath();//通过驾车实例，获得一系列点的数组
                        var paths = pts.length;//获得几个点
                        var carMK = new BMap.Marker(pts[0],{icon:myIcon});
                        map.addOverlay(carMK);
                        i = 0;
                        function resetMKPoint(i){
                            carMK.setPosition(pts[i]);
                            if(i<paths){
                                setTimeout(function(){
                                    i++;
                                    resetMKPoint(i);
                                },100)
                            }
                        }
                        setTimeout(function(){
                            resetMKPoint(5);
                        },100)
                    });
                }
                //启动 run方法
                setTimeout(function(){
                    run();
                },1500)
            },8000);

            //添加全景控件展示
            map.addTileLayer(new BMap.PanoramaCoverageLayer());
            var stCtrl = new BMap.PanoramaControl(0);//构建全景控件
            stCtrl.setOffset(new BMap.Size(20,70));
            map.addControl(stCtrl);

            //添加驾车起点和终点
            /*var transit = new BMap.DrivingRoute(map,{
             renderOptions:{
             map:map,
             panel:"r-result",
             enableDragging:true//可进行拖拽
             }
             });
             transit.search('西单','魏公村');*/

            //添加根据ip地址进行定位
            setTimeout(function(){
                function myPosition(result){
                    var cityName = result.name;
                    map.setCenter(cityName);
                    alert('当前定位城市：'+cityName);
                }
                var myCity = new BMap.LocalCity();
                myCity.get(myPosition)
            },18000);

        }
    }
</script>
<style scoped>
    html,body,.XSDFXPage{
        width: 100%;
        height: 50vh;
        overflow: hidden;
        margin: 0;
        font-family: "微软雅黑";
    }
</style>
