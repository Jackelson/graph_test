<template>
  <div>
    <div id="graph"></div>
    <div
      class="export"
      @click="exportData"
      :style="{
        top: selectedNode.length > 0 ? '70px' : '-50px',
      }"
    >
      导出节点数据
    </div>
    <nodeInfo
      v-if="showToolTip"
      :data="data"
      :nodeInfo="currentNode"
    ></nodeInfo>
    <Menu
      v-show="showMenu"
      :node="currentNode"
      :style="menuPosition"
      @nextNode="nextNode"
      @resetData="resetData"
      @getNodeDetail="getNodeDetail"
    ></Menu>
    <div class="page">
      <a-config-provider :locale="zhCN">
        <a-pagination
          v-model:current="size"
          :total="totalPage"
          :showSizeChanger="false"
          :showQuickJumper="true"
          @change="changePage"
        />
      </a-config-provider>
    </div>
  </div>
</template>

<script setup>
import zhCN from "ant-design-vue/es/locale/zh_CN";
import ForceGraph3D from "3d-force-graph";
import resData from "../data/res.json";
import { onMounted, ref, reactive } from "vue";
import Menu from "../components/menu.vue";
import nodeInfo from "../components/nodeInfo.vue";
import { getGraphData, exportGraph } from "../api/graph.js";
import { message } from "ant-design-vue";
import SpriteText from "three-spritetext";
//弹框展示
const showToolTip = ref(false);
let showMenu = ref(false);
let menuPosition = reactive({
  left: 0,
  top: 0,
});

let tipPosition = reactive({
  left: 0,
  top: 0,
  text: "",
});
// 翻页

const size = ref(0); // 当前页
const totalPage = ref(0); // 总页数
const changePage = (page) => {
  // 改变分页
  size.value = page;
  selectedNode.value = [];
  getData();
};

let selectedNode = ref([]);
// 卫星数据
const data = ref({
  nodes: [],
  links: [],
});
// 当前点击节点的信息
const currentNode = ref({});
// 获取数据
const getData = async () => {
  const res = await getGraphData({ size: size.value }).catch((err) => {
    console.log(err);
  });
  if (res.recode == 200) {
    data.nodes = res.data.node.map((node) => {
      const parseNode = JSON.parse(node);
      return {
        color: judgeLabel(parseNode.label),
        ...parseNode,
        collapsed: false,
        nodeRelSize: 8,
      };
    });
    data.links = [];
    totalPage.value = Number(res.data.total) / 100;
    if (size.value == 0) {
      size.value = 1;
      return;
    }
    myGraph.graphData(data);
  }
};

const judgeLabel = (labels = []) => {
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
/**
 * 节点选中逻辑，选中之后，判断该节点是否展开展开去查找边，
 *
 */
// 获取下一节点
const nextNode = (nextData) => {
  // 判断当前选中的节点是否已经展开过
  if (currentNode.value.collapsed) {
    showMenu.value = false;
    return;
  }
  // 把获取到数据进行处理
  const links = nextData.relation.map((link) => JSON.parse(link));
  const nextNodes = nextData.node.map((node) => {
    const parseNode = JSON.parse(node);
    return {
      color: judgeLabel(parseNode.label),
      ...parseNode,
      collapsed: false,
    };
  });
  // 拿到下一节点之后，将节点放在父节点上
  data.nodes.forEach((node) => {
    if (node.id == currentNode.value.id) {
      node.collapsed = true;
      currentNode.value.collapsed = true;
      node.childLinks = links;
      node.children = nextNodes;
    }
  });
  // 关闭按钮
  showMenu.value = false;
  // 将下一个节点的数据，放在总数据中渲染图
  data.nodes = [
    ...data.nodes.map((n) => {
      if (n.id === currentNode.id) {
        n.collapsed = true;
      }
      return n;
    }),
    ...nextNodes,
  ];
  data.links = [...data.links, ...links];
  myGraph.graphData(data);
};
// 导入后重置
const resetData = (d) => {
  showMenu.value = false;
  console.log(d, "上传后的数据", data);
  data.nodes = [
    ...data.nodes,
    ...d.node.map((item) => {
      let parseNode = JSON.parse(item);
      return {
        color: "rgba(233,120,231,1)",
        ...parseNode,
        collapsed: true,
      };
    }),
  ];
  data.links = [
    ...d.relation.map((item) => ({
      linkColor: "red",
      linkWidth: 30,
      linkOpacity: 1,
      ...JSON.parse(item),
    })),
    ...data.links,
  ];
  myGraph.graphData(data);
  // const n = data.nodes.filter((item) => item.id == JSON.parse(d.node[0]).id)[0];
  // force(n);
};
// 聚焦导入节点
const force = (node) => {
  const distance = 200;
  const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
  const newPos =
    node.x || node.y || node.z
      ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
      : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)
  myGraph.cameraPosition(
    newPos, // new position
    node, // lookAt ({ x, y, z })
    3000 // ms transition duration
  );
};
// 图数据事件
let myGraph = ForceGraph3D();
onMounted(async () => {
  await getData();
  const graphElement = document.getElementById("graph");
  myGraph(graphElement)
    .graphData(data)
    // 右击节点事件
    .onNodeRightClick(function (node, event) {
      if (node.color == "red") {
        currentNode.value = node;
      }
      menuPosition.left = event.offsetX + "px";
      menuPosition.top = event.offsetY + "px";
      showMenu.value = true;
    })
    // 左击节点事件
    .onNodeClick(function (node) {
      console.log(node);

      //  左击鼠标
      if (selectedNode.value.some((item) => item.id == node.id)) {
        data.nodes.forEach((item) => {
          if (item.id == node.id) {
            item.color = "#fff";
          }
        });
        selectedNode.value = selectedNode.value.filter(
          (item) => item.id != node.id
        );
      } else {
        data.nodes.forEach((item) => {
          if (item.id == node.id) {
            item.color = "red";
          }
        });
        selectedNode.value.push(node);
      }
      myGraph.graphData(data);
    })
    .nodeThreeObjectExtend(true)
    .nodeThreeObject((node) => {
      let sprite = new SpriteText(node["卫星名称"] || node["事件编号"]);
      sprite.material.depthWrite = false; // make sprite background transparent
      sprite.textHeight = 5;
      sprite.color = "#ccc";
      return sprite;
    })
    // 背景点击事件
    .onBackgroundClick(function () {
      showToolTip.value = false;
      showMenu.value = false;
    })
    .onBackgroundRightClick(function (e) {
      currentNode.value = {};
      menuPosition.left = e.offsetX + "px";
      menuPosition.top = e.offsetY + "px";
      showMenu.value = true;
    })
    .enablePointerInteraction(true)
    .enableNodeDrag(false)
    .onNodeDrag(() => {
      console.log("拖动了");
    });
});
// 展示节点详情
const getNodeDetail = () => {
  showMenu.value = false;
  showToolTip.value = true;
};
// 导出节点数据
const exportData = async () => {
  let links = [];
  let nodes = [];
  selectedNode.value.map((item) => {
    if (item.collapsed) {
      links = [...item.childLinks.map((l) => l.id), ...links];
      nodes = [...item.children.map((n) => n.id), ...nodes];
    }
    nodes.push(item.id);
  });
  const res = await exportGraph({
    nodes: nodes.join(","),
    relations: links.join(","),
  });
  const jsonString = JSON.stringify(res);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "节点数据");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); //下载完成移除元素
  window.URL.revokeObjectURL(url);
  message.success("导出成功");
};
</script>

<style lang="scss" scoped>
.page {
  padding: 5px 10px;
  padding-right: 25px;
  left: 50%;
  transform: translate(-50%);
  background: #ccc;
  position: absolute;
  bottom: 20px;
}
.export {
  cursor: pointer;
  width: 200px;
  height: 50px;
  color: #fff;
  background: #ccc;
  position: absolute;
  z-index: 999;
  font-size: 20px;
  left: 50%;
  transform: translate(-50%);
  text-align: center;
  line-height: 50px;
  transition: all 0.5s linear;
}
</style>
