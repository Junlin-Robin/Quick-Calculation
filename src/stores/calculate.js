import { defineStore } from 'pinia'

export const useCalculateStore = defineStore('CalculateStore', {
  state: () => {
    return {
      calculation_results:localStorage.getItem('calculation_results')?JSON.parse(localStorage.getItem("calculation_results")):[],
    }
  },
  actions: {
    init(){
      this.calculation_results = JSON.parse(localStorage.getItem('calculation_results'))||[];
    },
    update(newValue) {
      this.calculation_results = newValue;
    },
  },
})