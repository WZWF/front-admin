<template>
  <VueEcharts
    :option="option"
    :style="{ width: width, height: height }"
  ></VueEcharts>
</template>

<script>
export default {
  name: "ratingGraph",
  props: {
    option: {
      type: Object,
    },
    width: {
      type: String,
      default: "80%",
    },
    height: {
      type: String,
      default: "500px",
    },
  },
};
</script>