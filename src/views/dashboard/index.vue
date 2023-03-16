<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="horizontal-list">
    <div v-for="(item, index) in list" :key="index" class="list-item">
      {{ item }}
    </div>
  </div>
  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },data() {
    return {
      list: [
        '列表项1', 
        '列表项2', 
        '列表项3', 
        '列表项4', 
        '列表项5', 
        '列表项6','列表项1', '列表项2', '列表项3', '列表项4', '列表项5', '列表项6'],
    };
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.horizontal-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.list-item {
  width: 200px;
  height: 100px;
  background-color: #ccc;
  margin-bottom: 20px;
}
</style>
