<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <h1 class="text-h4 font-weight-bold">BTC Price History</h1>
        <v-btn color="primary" @click="fetchData"> Refresh Data</v-btn>
      </v-card-title>

      <v-card>
        <v-card-text class="d-flex ga-3">
          <v-select
              v-model="selectedInterval"
              :items="timeIntervals"
              label="Select interval"
              outlined
              @update:model-value="fetchData"
          />
          <v-text-field
              v-if="selectedInterval === 'custom'"
              v-model="customStartDate"
              type="date"
              outlined
              @update:model-value="fetchData"
          />
          <v-text-field
              v-if="selectedInterval === 'custom'"
              v-model="customEndDate"
              type="date"
              outlined
              @update:model-value="fetchData"
          />
        </v-card-text>
        <div v-if="chartData">
          <ChartComponent :data="chartData"/>
        </div>

        <v-container class="d-flex justify-center">
          <v-btn @click="showTable">Show Values Table</v-btn>
        </v-container>
        <v-data-table
            v-if="prices.length && isShowTable"
            :headers="columns"
            :items="prices.toReversed()"
            class="mt-6"
        />
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type {Price} from "~/server/types/types";

const isShowTable = ref(false);
const prices = ref([]);
const chartData = ref(null);

const showTable = () => {
  isShowTable.value = !isShowTable.value
}

const timeIntervals = [
  {title: "24h", value: "day"},
  {title: "7d", value: "week"},
  {title: "1m", value: "month"},
  {title: "1y", value: "year"},
  {title: "Custom", value: "custom"},
];

const selectedInterval = ref("day");
const customStartDate = ref("");
const customEndDate = ref("");

const columns = [
  {key: "timestamp", title: "Date"},
  {key: "price", title: "Price (USD)"},
];

const fetchData = async () => {
  const params =
      selectedInterval.value === "custom"
          ? {
            start: customStartDate.value,
            end: customEndDate.value,
          }
          : {interval: selectedInterval.value};

  const {data} = await useFetch("/api/prices", {
    params,
  });

  prices.value = data.value?.prices;
  prepareChartData(data.value?.prices);
};

const prepareChartData = (prices: Price[]) => {
  let labels = prices?.map((item) => dayjs(item.timestamp).format('DD-MM-YYYY'))

  if (selectedInterval.value === 'day' || dayjs(customEndDate.value).diff(dayjs(customStartDate.value)) === 0) {
    labels = prices?.map((item) => dayjs(item.timestamp).format('HH:mm'))
  }

  chartData.value = {
    labels: labels,
    datasets: [
      {
        name: "BTC/USD",
        data: prices?.map((item) => item.price),
      },
    ],
  };
};

onMounted(fetchData);
</script>

<style scoped>
.mt-6 {
  margin-top: 24px;
}
</style>
