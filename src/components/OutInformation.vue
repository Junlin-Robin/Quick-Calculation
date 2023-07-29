<template>
  <h2>DFT calculation for isotope fractionation</h2>
  <v-chart class="chart" autoresize :option="option" id="chart" />
</template>

<script setup>
import * as echarts from "echarts/core";
import { GridComponent, ToolboxComponent } from "echarts/components";
import { ScatterChart, LineChart } from "echarts/charts";
import { UniversalTransition, LabelLayout } from "echarts/features";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { nextTick, reactive, ref, watchEffect } from "vue";

import { useCalculateStore } from "../stores/calculate";
import { storeToRefs } from "pinia";
import ecStat from "echarts-stat";

const store = useCalculateStore();

const { calculation_results } = storeToRefs(store);

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  UniversalTransition,
  ToolboxComponent,
  ScatterChart,
  LabelLayout,
]);

let showData = reactive([]);

watchEffect(() => {
  showData = calculation_results.value.map((item) => {
    return {
      name: item.name,
      data: item.value.map((innerItem) => {
        return [innerItem.row, innerItem.column, innerItem.temperature];
      }),
      type: "line",
      smooth: true,
      emphasis: {
        itemStyle: {
          shadowBlur: 8,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    };
  });

  nextTick(() => {
    //把所有的数据删掉再传一遍，避免内部的merge算
    echarts.getInstanceByDom(document.getElementById("chart")).clear();
    option.value.series = showData;
  });
});

// echarts.registerTransform(ecStat.transform.regression);
const option = ref({
  tooltip: {
    trigger: "item",
    formatter: function (a) {
      return `<p align="center" style="color:rgb(80, 80, 80);font-size:15px;margin-bottom:8px">${
        a.seriesName
      }</p><hr/>T:${a.data[0].toFixed(2)} &nbsp 1000lnβ:${a.data[1].toFixed(
        2
      )}`;
    },
  },
  legend: {
    orient: "vertical",
    left: "11%",
    top: "2%",
  },
  xAxis: [
    {
      type: "value",
      axisTick: {
        alignWithLabel: true,
      },
      boundaryGap: false,
      name: "10^6/T^2",
      nameRotate: 0,
      nameLocation: "center",
      nameTextStyle: {
        fontSize: 20,
        fontWeight: 600,
        padding: [16, 0, 0, 0],
      },
      splitLine: {
        show: false,
      },
    },
  ],
  yAxis: {
    type: "value",
    axisLine: {
      show: true,
    },
    axisTick: {
      show: true,
    },
    name: "1000lnβ",
    nameRotate: 90,
    nameLocation: "center",
    nameTextStyle: {
      fontSize: 20,
      fontWeight: 600,
      padding: [0, 0, 40, 20],
    },
    splitLine: {
      show: false,
    },
  },
  grid: {
    show: true,
    borderColor: "#6E7079",
    top: "1%",
    // right:"8%"
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  series: [...showData],
});
</script>

<style scoped>
.chart {
  height: 90%;
  width: 95%;
  margin: 16px auto 0 auto;
}
h2 {
  text-align: center;
  margin: 20px auto 0 auto;
}
p {
  color: rgb(48, 48, 48);
}
</style>
