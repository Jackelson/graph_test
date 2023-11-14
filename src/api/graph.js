import request from "./request";

// 获取卫星
export function getGraphData(params) {
  return request({
    url: "/graph/getAll",
    type: "get",
    params,
  });
}
// 获取下一节点
export function getNextNode(id) {
  return request({
    url: "/graph/getNext/" + id,
    type: "get",
  });
}
