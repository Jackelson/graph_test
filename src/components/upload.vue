<template>
  <a-modal
    v-model:open="open"
    title="数据导入"
    okText="保存"
    cancelText="取消"
    @ok="handleUpload"
  >
    <a-upload-dragger
      v-model:fileList="fileList"
      name="file"
      :before-upload="beforeUpload"
      action="/graph/import"
      @change="handleChange"
      @drop="handleDrop"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined></inbox-outlined>
      </p>
      <p class="ant-upload-text">点击选择文件或将文件拖入此区域</p>
      <p class="ant-upload-hint">仅支持上传json格式文件</p>
    </a-upload-dragger>
  </a-modal>
</template>
<script setup>
import { ref, defineEmits, defineExpose } from "vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { importGraph } from "../api/graph";
const fileList = ref([]);
const beforeUpload = () => {
  return false;
};
const open = ref(false);
const uploading = ref(false);
defineExpose({ open });
const emit = defineEmits(["uploadFile"]);
const handleChange = (info) => {
  const status = info.file.status;
  if (status !== "uploading") {
    console.log(info.file, info.fileList);
  }
  if (status === "done") {
    message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === "error") {
    message.error(`${info.file.name} file upload failed.`);
  }
};
const handleUpload = async () => {
  const formData = new FormData();
  uploading.value = true;
  // You can use any AJAX library you like
  fileList.value.forEach((file) => {
    formData.append("file", file.originFileObj);
  });
  const res = await importGraph(formData);
  open.value = false;
  emit("uploadFile", res.data);
  fileList.value = [];
  uploading.value = false;
  return res;
};
function handleDrop(e) {
  console.log(e);
}
</script>
