import Vue from 'vue'
import VueResource from 'vue-resource'
// import AppHeader from './uilayout/AppHeader.vue'
import AppLayout from './uilayout/AppLayout.vue'
import AppContent from './uilayout/AppContent.vue'
import AppSidebar from './uilayout/AppSidebar.vue'
// import AppFooter from './uilayout/AppFooter.vue'
import VueTouch from './vue-touch'

Vue.use(VueResource)
Vue.use(VueTouch)

Vue.directive('draggable', {
    bind: function (el) {
      el.style.position = 'absolute';
      var startX, startY, initialMouseX, initialMouseY;
  
      function mousemove(e) {
        var dx = e.clientX - initialMouseX;
        var dy = e.clientY - initialMouseY;
        el.style.top = startY + dy + 'px';
        el.style.left = startX + dx + 'px';
        return false;
      }
  
      function mouseup() {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      }
  
      el.addEventListener('mousedown', function(e) {
        startX = el.offsetLeft;
        startY = el.offsetTop;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        return false;
      });
    }
  })

new Vue({
    el: 'body',
    components: {
        AppLayout, AppContent, AppSidebar
    }
})
