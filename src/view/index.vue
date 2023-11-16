<template>
  <div>
    <div id="graph"></div>
    <nodeInfo v-if="showToolTip" :nodeInfo="currentNode"></nodeInfo>
    <Menu
      v-show="showMenu"
      :id="currentNode.id"
      :style="menuPosition"
      @nextNode="nextNode"
    ></Menu>
  </div>
</template>

<script setup lang="ts">
import ForceGraph3D from "3d-force-graph";
import resData from "../data/res.json";
import { onMounted, ref, reactive } from "vue";
import Menu from "../components/menu.vue";
import nodeInfo from "../components/nodeInfo.vue";
import { getGraphData } from "../api/graph.js";
//弹框展示
const showToolTip = ref(false);
let showMenu = ref(false);
let menuPosition = reactive({
  left: 0,
  top: 0,
});

// 卫星数据
const data = ref({
  nodes: [],
  links: [],
});
// 当前点击节点的信息
const currentNode = ref({});
// 当前页
const size = ref(0);
// 总页数
const totalPage = ref(0);
// 获取数据
const getData = async () => {
  const res = await getGraphData({ size: size.value }).catch((err) => {
    console.log(err);
  });
  if (res.recode == 200) {
    data.value.nodes = res.data.nodes.map((node) => {
      const parseNode = JSON.parse(node);
      return {
        color: judgeLabel(parseNode.label),
        ...parseNode,
      };
    });
    totalPage.value = Number(res.data.total) / 100;
  }
};

const judgeLabel = (labels = []) => {
  console.log(labels);
  const label = labels[0];
  switch (label) {
    case "TEST":
      return "green";
    case "卫星":
      return "red";
    case "轨道":
      return "blue";
    case "近接事件":
      return "yellow";
    default:
      return "#fff";
      break;
  }
};

// 获取下一节点
const nextNode = (nextData) => {
  showMenu.value = false;
  data.value.nodes = [
    ...data.value.nodes,
    ...nextData.nodes.map((node) => {
      const parseNode = JSON.parse(node);
      return {
        color: judgeLabel(parseNode.label),
        ...parseNode,
      };
    }),
  ];
  data.value.links = [
    ...data.value.links,
    ...nextData.relation.map((link) => JSON.parse(link)),
  ];
  console.log(data.value);
  myGraph.graphData(data.value);
};
let myGraph = ForceGraph3D();
onMounted(async () => {
  await getData();
  const graphElement = document.getElementById("graph");
  myGraph(graphElement)
    .graphData(data.value)
    // 右击节点事件
    .onNodeRightClick(function (node, event) {
      currentNode.value = node;
      menuPosition.left = event.offsetX + "px";
      menuPosition.top = event.offsetY + "px";
      showMenu.value = true;
    })
    // 左击节点事件
    .onNodeClick(function (node) {
      currentNode.value = node;
      showToolTip.value = true;
      console.log(node, event);
    })
    // 背景点击事件
    .onBackgroundClick(function () {
      showToolTip.value = false;
      showMenu.value = false;
    });
});
</script>

<style lang="scss" scoped></style>
