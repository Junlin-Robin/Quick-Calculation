<script setup lang="ts">
import {shallowRef,ref} from 'vue'
import Notification from "./components/Notification.vue"
import Vheader from "./components/header.vue";
import Vfooter from "./components/footer.vue";
import OutInformation from "./components/OutInformation.vue";
import InputData from "./components/InputData.vue";
import Table from "./components/table.vue"

const showComponent = shallowRef(OutInformation)
const showComponetName = ref('数据')
const changeComponet = () => {
  if(showComponetName.value === '数据'){
    showComponent.value = Table;
    showComponetName.value = '图表'
  }else{
    showComponent.value = OutInformation;
    showComponetName.value = '数据'
  }
}
</script>

<template>
  <header>
    <Notification></Notification>
    <Vheader></Vheader>
  </header>
  <main>
    <button @click="changeComponet">{{ showComponetName }}</button>
    <div class="left">
      <InputData></InputData>
    </div>
    <div class="right">
      <component :is="showComponent"></component>
    </div>
  </main>
  <footer>
    <Vfooter></Vfooter>
  </footer>
</template>

<style scoped>
header {
  width: 100vw;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  border-bottom: 1px solid rgba(60, 60, 60, .12);
  box-shadow:0 0 20px rgba(0,0,0,0.2);
}

main {
  border-bottom: 1px solid rgba(60, 60, 60, .12);
  height: 95vh;
  display: flex;
  justify-content: center;
  background-color: #eeeeee;
  position: relative;
}
footer {
  height: 18px;
  background-color: rgb(246, 246, 246);
}
.left{
  flex: 0 0 450px;
  height: 100%;
  /* border-right: 2px dashed rgba(60, 60, 60, .3); */
  overflow: scroll;
  background-color: #fff;
}
.right{
  box-shadow: 0 0 8px rgba(18, 18, 18, 0.2);
  height: 90%;
  margin: auto 30px;
  flex: 1 0 700px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  overflow: scroll;
}
main button {
  width: 45px;
  height: 25px;
  font-size: 9px;
  position: absolute;
  top: 8px;
  right: 5px;
  z-index: 1;
  font-weight: 400;
  background-color: rgb(234, 97, 97);
}
main button:hover{
  background-color: black;
}
</style>
