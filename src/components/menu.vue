<template>
  <div class="menu-wrap">
    <div class="button" @click="getNext">下一级节点</div>
    <div class="solid"></div>
    <div class="button" @click="importData">导入数据</div>
    <div class="solid"></div>
    <div class="button" @click="getNodeDetail">节点详情</div>
    <upload ref="uploadRef" @uploadFile="uploadFile"></upload>
  </div>
</template>

<script setup>
import { getNextNode } from "../api/graph.js";
import { defineProps, defineEmits, ref } from "vue";
import upload from "./upload.vue";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});
const uploadRef = ref(null);
const emit = defineEmits(["nextNode", "getNodeDetail"]);
// 获取下一个节点
const getNext = async () => {
  const res = await getNextNode(props.node.id);
  emit("nextNode", res.data);
};
// 导入数据
const importData = () => {
  uploadRef.value.open = true;
};
const uploadFile = (data) => {
  emit("resetData", data);
  uploadRef.value.open = false;
};
// 获取节点详情
const getNodeDetail = () => {
  emit("getNodeDetail");
};
</script>

<style lang="scss" scoped>
.menu-wrap {
  height: 150px;
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
