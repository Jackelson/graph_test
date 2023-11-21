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
// 导出
export function exportGraph(params) {
  return request({
    url: "/graph/export",
    method: "post",
    params,
  });
}
// 导入
export function importGraph(data) {
  return request({
    url: "/graph/import",
    method: "post",
    headers: {
      "Content-Type": "application/form-data",
    },
    data,
  });
}
