<template>
  <div class="menu-wrap">
    <div class="button" @click="getNext">下一级节点</div>
    <div class="solid"></div>
    <div class="button" @click="importData">导入数据</div>
    <a-modal
      wrapClassName="ssss"
      v-model:open="open"
      title="数据导入"
      okText="保存"
      cancelText="取消"
      @ok="handleOk"
    >
      <upload></upload>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { getNextNode } from "../api/graph.js";
import { defineProps, defineEmits, ref } from "vue";
import upload from "./upload.vue";
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const open = ref(false);
const emit = defineEmits(["nextNode"]);
// 获取下一个节点
const getNext = () => {
  // async
  // const res = await getNextNode(props.id);
  emit("nextNode", { id: "12312" });
};
// 导入数据
const importData = () => {
  open.value = true;
};
const handleOk = () => {
  open.value = false;
};
</script>

<style lang="scss" scoped>
.menu-wrap {
  height: 100px;
  width: 80px;
  border: 1px solid #fff;
  position: absolute;
  background: rgba($color: #fff, $alpha: 0.2);
  backdrop-filter: 0.8;
  .solid {
    width: 100%;
    height: 1px;
    background: #ccc;
  }
  .button {
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 12px;
    cursor: pointer;
    color: #fff;
  }
}
</style>
