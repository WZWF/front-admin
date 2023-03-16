<template>
  <div>
    <ul>
      <li v-for="(category, index) in categories" :key="index">
        <router-link :to="'/category/' + category.id">{{ category.name }}</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        { id: 1, name: '电子产品' },
        { id: 2, name: '家居用品' },
        { id: 3, name: '服装饰品' },
      ],
    };
  },
};
</script>