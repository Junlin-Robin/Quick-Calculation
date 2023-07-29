<template>
  <div class="head">
    <div class="logoContainer">
      <div class="logo">
        <h2>W</h2>
      </div>
      <h3>Quick Calculation</h3>
    </div>
    <div class="navbar">
      Waiting to coding!
    </div>
    <div class="logout">退出</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>

.head{
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 44px;
}

.logo{ 
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: skyblue;
  background-size: contain;
}
.navbar{
  display: flex;
}
h3,.logo{
  display: inline-block;
  margin-left: 10px;
  font-family: "Dosis", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  font-size: 26px;
}
h2{
  text-align: center;
  line-height: 40px;
  color: aliceblue;
}
.logout{
  border-radius: 16px;
  width: 50px;
  height: 32px;
  color: rgb(136, 136, 136);
  text-align: center;
  line-height: 32px;
  cursor: pointer;
  /* font-weight: bold; */
}
.logout:hover{
  color: #213547;
  transition: all .5s ease;
}
</style>
