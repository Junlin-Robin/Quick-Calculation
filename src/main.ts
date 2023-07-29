// import { createApp } from "vue";
// import "./style.css";
// import App from "./App.vue";

// import * as echarts from "echarts";
// import VueECharts from 'vue-echarts'





// const app = createApp(App);

// app.component('v-c ahart', VueECharts);
// // app.config.globalProperties.$echarts = echarts;
// app.mount("#app");
// // createApp(App).mount('#app');



import { createApp } from 'vue'
import "./style.css";
import App from "./App.vue";
import ECharts from 'vue-echarts'
import { use } from "echarts/core";
import {createPinia} from "pinia"

// 手动引入 ECharts 各模块来减小打包体积
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent
]);

const app = createApp(App)

// 全局注册组件（也可以使用局部注册）
app.component('v-chart', ECharts)

app.use(createPinia())

app.mount('#app');

