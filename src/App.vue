<script setup lang="ts">
import index from "./view/index.vue";
</script>

<template>
  <div>
    <h2 class="title">航天器威胁感知领域知识图谱</h2>
    <index />
  </div>
</template>

<style lang="scss">
.title {
  text-align: center;
  color: white;
  position: absolute;
  top: 0;
  z-index: 998;
  left: 50%;
  transform: translate(-50%);
}
:where(.css-dev-only-do-not-override-1qb1s0s).ant-modal .ant-modal-content {
  border: 1px solid #fff;
  background: rgba($color: #fff, $alpha: 0.6) !important;
  backdrop-filter: 0.8 !important;
}
:where(.css-dev-only-do-not-override-1qb1s0s).ant-modal .ant-modal-header {
  background: transparent;
  .ant-modal-title {
    color: #fff;
  }
}
.ant-btn-primary {
  background: rgba(rgba(0, 0, 0, 0.3), $alpha: 0.5) !important;
}
:where(.css-dev-only-do-not-override-1qb1s0s).ant-modal .ant-modal-close {
  color: #fff !important;
}
</style>
