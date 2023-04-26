<template>
  <div class="image-viewer">
    <el-image-viewer
      :initial-index="previewImgIndex"
      hide-on-click-modal
      :url-list="imageList"
      :on-close="closeImgViewer"
      v-if="previewImgIndex != null"
    >
    </el-image-viewer>
  </div>
</template>

<script>
export default {
  props: {
    imageList: {
      type: Array,
    },
  },
  components: {
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer"),
  },
  data() {
    return {
      previewImgIndex: null,
    };
  },
  methods: {
    show(index) {
      this.stopScroll();
      this.previewImgIndex = index;
    },
    closeImgViewer() {
      this.startScroll();
      this.previewImgIndex = null;
    },
    stopScroll() {
      document.body.style.overflow = "hidden";
    },
    startScroll() {
      document.body.style.overflow = "auto";
    },
  },
  created() {},
};
</script>

<style lang="scss">
.el-image-viewer__wrapper {
  .el-image-viewer__mask {
    opacity: 0.7;
  }
  .el-image-viewer__img {
    max-width: 80% !important;
  }
}
</style>