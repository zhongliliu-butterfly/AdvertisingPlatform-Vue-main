<template>
  <div class="tdesign-demo-upload t-upload">
    <t-button variant="outline" @click="upload">
      <template #icon>
        <cloud-upload-icon />
      </template>
      选择文件
    </t-button>

    <br /><br />
    <t-upload ref="uploadRef" v-model="files"
      action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo" draggable theme="file-flow"
      :upload-button="true? { theme: 'primary', content: '上传' }:null  "
      :cancel-upload-button="true ? { theme: 'default', content: '取消上传' } : null"
      :auto-upload="false"
      @fail="handleFail" @success="handleSuccess" @progress="onProgress">
    </t-upload>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { MessagePlugin, UploadInstanceFunctions, UploadProps, ButtonProps } from 'tdesign-vue-next';
import { CloudUploadIcon } from 'tdesign-icons-vue-next';
const files = ref<UploadProps['value']>([]);
const uploadRef = ref<UploadInstanceFunctions>();
const progress = ref(0);
const handleSuccess: UploadProps['onSuccess'] = ({ file }) => {
  MessagePlugin.success(`文件 ${file.name} 上传成功`);
};
const handleFail: UploadProps['onFail'] = ({ file }) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
};
const onProgress: UploadProps['onProgress'] = ({ percent }) => {
  console.log('进度：', percent);
  progress.value = percent;
};
const upload: ButtonProps['onClick'] = () => {
  uploadRef.value.triggerUpload();
};
const downTemplate=()=>{
  window.open('https://amz-filestore.oss-cn-beijing.aliyuncs.com/%E7%BB%84%E7%BB%87%E6%9E%B6%E6%9E%84%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%E5%8F%8A%E7%A4%BA%E4%BE%8B.xlsx')
}
</script>
<style scoped>
 .add_line {
        color: #237FFA;
        font-weight: 400;
        margin-left: 10px;
        cursor: pointer;
        font-size: 16px;
    }
</style> 
