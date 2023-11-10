import request from "./request";

export function getGraphData(params) {
  return request({
    url: "",
    type: "get",
    params,
  });
}
