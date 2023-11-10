<template>
  <div>
    <div id="graph"></div>
    <div class="toolTip"></div>
  </div>
</template>

<script setup>
import ForceGraph3D from "3d-force-graph";
import data from "../data/blocks.json";
import { onMounted } from "vue";
onMounted(() => {
  let myGraph = ForceGraph3D();
  const graphElement = document.getElementById("graph");
  myGraph(graphElement)
    .graphData(data)
    .onNodeClick(function (node) {
      console.log(node, event);
    });
});
</script>

<style lang="scss" scoped></style>
