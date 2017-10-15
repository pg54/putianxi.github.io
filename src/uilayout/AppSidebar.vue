<template>
<div class='hospitalInfos'>
    <div class='dragger' @mousedown='draggerMousedown($event)'></div>
    <area-select-box></area-select-box>

    <div v-if="totalPage">

        <hospital-box v-for="hospital in hospital_show_list"
                      :hospital-info="hospital"
        >
        </hospital-box >
    </div>

    <div v-else class="safe-area">
        <h4>
            <span class="icon"><i class="fa fa-check"></i></span>此地区暂时没有项目
        </h4>
    </div>

</div>
</template>

<script>
    import HospitalBox from '../uielements/HospitalBox.vue'
    import AreaSelectBox from '../uielements/AreaSelectBox.vue'
    import messageBus from '../utilities/messageBus.js'

    const LIST_MAX_LEN = 4;

    export default {
        components: { HospitalBox, AreaSelectBox },
        data() {
            return {
                hospital_list: [],
                hospital_show_list: [],
                currentPage: 1,
                totalPage: 1,
            };
        },
        methods: {
            initListenMsg() {
                messageBus.$on('sidebar-data-update', (map_data) => {
                    // restore page
                    this.currentPage = 1;
                    this.totalPage = 1;

                    // update list
                    this.genHosptialList(map_data);
                });
            },
            genHosptialList(map_data) {
                // clear old list
                this.hospital_list = []
                
                // update hospital_list
                for(let el of map_data.features) {
                    this.hospital_list.push(el);
                }

                // update totalPage
                this.totalPage = Math.ceil(this.hospital_list.length / LIST_MAX_LEN);

                // update show list
                // this.refreshShowList();
                this.hospital_show_list = this.hospital_list.slice(0, this.hospital_list.length);
            },
            updatePageList(direction) {
                if(direction === 'prev') {
                    this.currentPage -= 1;

                    if(this.currentPage < 1) {
                        this.currentPage = 1;
                    }
                }
                else {
                    this.currentPage += 1;

                    if(this.currentPage > this.totalPage) {
                        this.currentPage = this.totalPage;
                    }
                }
                this.refreshShowList();
            },
            refreshShowList() {
                let slice_start = (this.currentPage - 1) * LIST_MAX_LEN;
                let slice_end = (this.currentPage) * LIST_MAX_LEN;

                // last page 
                if(this. currentPage === this.totalPage ) {
                    this.hospital_show_list = this.hospital_list.slice(-LIST_MAX_LEN);
                }
                else {
                    this.hospital_show_list = this.hospital_list.slice(slice_start, slice_end);
                }
                
            },
            draggerMousedown(ev) {
                let dragger = document.querySelector('.dragger');
                console.log(dragger);

                console.log(ev);
              dragger.onMouseMove = function (ev) {
                console.log('onMouseMove')
              }



                
            },
            draggerMousemove(ev) {
                console.log(ev);
            }
        },
        ready() {
            this.initListenMsg();
        }
    }
</script>

<style>
    .hospitalInfos {
        height: 250px;
        overflow-y: scroll;
    }
    .dragger {
        width: 100%;
        height: 50px;
        background: #EDEDED
    
    }

    .card-pagination .button {
        border-radius: 2px;
    }

    .pagination-title {
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
    }

    .safe-area {
        padding: 20px 0;
        background-color: #6AA747;
    }

    .safe-area h4 {
        color: #fff;
        text-align: center;
        line-height: 24px;
        font-size: 14px;
    }

    .safe-area .icon {
        margin-right: 5px;
        font-size: 18px;
    }
</style>
