<template>
  <VueApexCharts type="line" height="400" :options="options" :series="data.datasets"/>
</template>

<script setup lang="ts">
import type {Props} from "./types/types";
import VueApexCharts from "vue3-apexcharts";
import {toRef} from "vue";

const props = defineProps<Props>();
const data = toRef(() => props.data)

const options = computed(() => {
      return {
        chart: {
          type: "line",
          toolbar: {
            tools: {
              download: true,
              selection: true,
              zoom: false,
              zoomin: true,
              zoomout: true,
              pan: false,
              reset: true
            }
          },
        },
        stroke: {
          width: 2,
        },
        xaxis: {
          tickAmount: 30,
          categories: data.value.labels,
          labels: {
            offsetY: 5,
          },
        },
        colors: ["#3B82F6"],
      }
    }
)
</script>
