<template>
  <div class="Notification" v-if="isshow">
    <h4>
      <span>注意：</span>
      本版本仅供测试，请勿在生产环境中使用！
      常见使用请移步
      <a href="#">文档</a>
      ，发现问题请联系
      <a href="mailto:347258143@qq.com">创作者</a>。
      <span class="close" @click="removeComponent">✗</span>
    </h4>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
// inject('removeComponent');
const isshow = ref(true);
const removeComponent = ()=>{
 isshow.value = false;
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.Notification {
  width: 100%;
  height: 30px;
  background-color: rgba(92, 125, 155, 0.912);
}
h4 {
  color: white;
  text-align: center;
  line-height: 30px;
  font-weight: 400;
  font-size: 15px;
}
span{
  color: rgb(245, 65, 65);
  font-weight: bolder;
}
a{
  color: rgb(51, 219, 211);
  cursor: pointer;
  margin: 0;
  padding: 0;
}
a:hover{
  color: aquamarine;
}
.close{
  float: right;
  margin-right: 15px;
  color:aliceblue;
  opacity: 0;
  width: 40px;
}
.close:hover{
  color: white;
  font-weight: bolder;
  font-size: 20px;
  transform: rotateZ(180deg);
}
h4:hover .close{
  opacity: 1;
  float: right;
  cursor: pointer;
  transition: all .35s ease;
}
</style>
