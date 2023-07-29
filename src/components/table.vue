<template>
  <h3>DFT计算结果</h3>
  <table>
    <ul>
      <li v-for="item in calculation_results" :key="item.id">
        <th colspan="3">{{ item.name }}</th>
        <tr class="info">
          <td>计算的同位素：{{ item.information[0] }}</td>
          <td>计算的原子数：{{ item.information[1] }}</td>
          <td>固定的原子数：{{ item.information[2] }}</td>
        </tr>
        <tr>
          <td>T (℃)</td>
          <td>10^6/T^2</td>
          <td>1000lnβ (‰)</td>
        </tr>
        <tr v-for="Inneritem in item.value">
          <td>{{ Inneritem.temperature.toFixed(2) }}</td>
          <td>{{ Inneritem.row.toFixed(2) }}</td>
          <td>{{ Inneritem.column.toFixed(4) }}</td>
        </tr>
      </li>
      
    </ul>
  </table>
</template>

<script setup lang="ts">
import { useCalculateStore } from "../stores/calculate";
import { storeToRefs } from "pinia";

const store = useCalculateStore();
const { calculation_results } = storeToRefs(store);
</script>

<style scoped>
table {
  border-collapse: collapse;
  margin: 20px auto;
}
th{
  border: 1px solid black;
  background-color: #ccc;
  text-align: center;
  width: 700px;
}
td{
  border: 1px solid black;
  padding: 10px 5px;
  text-align: center;
}
.info{
  background-color: #ddd;
}
.info td{
  padding: 0;
}

h3{
  text-align: center;
  margin: 15px auto;
}
</style>
