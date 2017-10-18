<template>
    <div class="control has-icon" id="main-search">
        <input class="input" type="text" placeholder="搜索项目" v-model="query"
               @keyup="keyUp" @keyup.enter="searchNow"
        >
        <i class="fa fa-search"></i>
        <i class="fa fa-times icon-close" 
           v-show="query.length"
           @click="resetSearch()"
        ></i>

        <!-- <ul v-show="hasItems" class="search-list">
            <li v-for="item in items" :class="activeClass($index)" 
                @mousedown.prevent="hit" @mousemove="setActive($index)">

                {{ item.name }}

            </li>
        </ul> -->


    </div>
</template>

<script>
    // import Bloodhound from 'bloodhound-js';
    import messageBus from '../utilities/messageBus.js'
    // import VueTypeahead from '../utilities/VueTypeahead.js'
    import Wade from 'wade'

    export default {
        // extends: VueTypeahead,
        data() {
            return {
                engine: [],
                query: '',
                limit: 5,
                minChars: 2,
            }
        },

        methods: { 

            // init Bloodhound data
            initListenMsg() {
                messageBus.$on('searchbox-data-init', (search_data) => {
                    this.engine.push(search_data);
                    console.log('engine');
                    console.log(this.engine);
                });
            },
            keyUp() {
                console.log('keyUp');
            },
            searchNow() {
                console.log('aEngine');
                console.log(this.engine);
                var newEngine = this.engine.filter(ele => ele.name.indexOf(this.query) > -1);
                console.log(newEngine);
                
            },

        },
        ready() {
            console.log(Wade);
            this.initListenMsg();
        }

    }
</script>

<style>
    #main-search {
        margin-bottom: 1rem;
        position: relative;
    }

    #main-search input {
        border-radius: 0;
    }

    #main-search input:focus {
        border: 1px solid #ed6c63;
    }

    #main-search i.icon-close {
        left: auto;
        right: 4px;
        color: #69707a;
        cursor: pointer;
        pointer-events: auto;
    }

    #main-search ul {
        position: absolute;
        padding: 0;
        margin-top: 1rem;
        width: 100%;
        background-color: #fdfdfd;
        list-style: none;
        border-radius: 1px;
        box-shadow: 0 2px 3px rgba(17,17,17,.1),0 0 0 1px rgba(17,17,17,.1);
        z-index: 1001;
    }

    #main-search li {
        padding: 10px 16px;
        border-bottom: 1px solid #d3d6db;
        cursor: pointer;
    }

    #main-search li:first-child {
        border-radius: 1px 1px 0 0;
    }

    #main-search li:last-child {
        border-radius: 0 0 1px 1px;
        border-bottom: 0;
    }

    #main-search li {
        font-weight: 400;
        font-size: 14px;
        color: #222324;
    }

    #main-search li.active {
        background-color: #ed6c63;
        color: white;
    }

    
</style>