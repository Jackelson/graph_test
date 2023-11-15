<template>
  <div class="info-warper">
    <div class="item" v-for="n in data" :key="n.id">
      <div class="label">{{ n.label }} :</div>
      <div class="content">{{ n.value }}</div>
    </div>
    <div class="down-file">
      <a-button @click="exportData"> 导出节点数据 </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from "vue";
import { message } from "ant-design-vue";
const props = defineProps(["nodeInfo"]);
const data = computed(() => {
  let newArray = [];
  const keys = Object.keys(props.nodeInfo);
  if (keys.length > 0) {
    keys.forEach((key, index) => {
      if (index > 10 || key == "id") {
        return;
      }
      newArray.push({
        id: new Date(),
        label: key,
        value: props.nodeInfo[key],
      });
    });
  }
  return newArray;
});

const exportData = () => {
  const jsonString = JSON.stringify(props.nodeInfo);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    props.nodeInfo["空间飞行器目录名称"] || "节点数据"
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); //下载完成移除元素
  window.URL.revokeObjectURL(url);
  message.success("导出成功");
};
</script>

<style lang="scss" scoped>
.info-warper {
  padding: 10px 15px;
  position: absolute;
  right: 20px;
  top: 10px;
  border: 1px solid #fff;
  width: 400px;
  height: 400px;
  background: rgba($color: #fff, $alpha: 0.2);
  backdrop-filter: 0.8;
}
.item {
  display: flex;
  justify-content: space-between;
  color: #fff;
}
.down-file {
  margin: 0 auto;
  margin-top: 30px;
}
</style>
