<template>
  <div class="main">
    <el-form
      label-position="right"
      label-width="110px"
      :model="apiForm"
      :rules="apiFormRules"
      ref="apiForm"
    >
      <el-form-item label="method">
        <el-radio-group v-model="apiForm.method" size="small">
          <el-radio-button label="post">POST</el-radio-button>
          <el-radio-button label="get">GET</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="url" prop="url">
        <el-input v-model="apiForm.url"></el-input>
      </el-form-item>
      <el-form-item label="localUrl" prop="localUrl">
        <el-input v-model="apiForm.localUrl"></el-input>
      </el-form-item>
      <el-form-item label="mockUrl" prop="mockUrl">
        <el-input v-model="apiForm.mockUrl"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="row">
          <div class="col data-json-text-param">
            <div>接口入参 JSON</div>
            <el-input
              :class="{
                'valid-border': apiForm.apiParam && paramJsonValid,
                'unvalid-border': apiForm.apiParam && !paramJsonValid,
              }"
              type="textarea"
              :rows="10"
              resize="none"
              placeholder="请输入内容"
              v-model="apiForm.apiParam">
            </el-input>
          </div>
          <div class="col data-json-text-result">
            <div>接口结果 JSON</div>
            <el-input
              :class="{
                'valid-border': apiForm.apiResult && resultJsonValid,
                'unvalid-border': apiForm.apiResult && !resultJsonValid,
              }"
              type="textarea"
              :rows="10"
              resize="none"
              placeholder="请输入内容"
              v-model="apiForm.apiResult">
            </el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文件输出路径">
        <div class="row">
          <el-button @click="selectSearchFolder" onfocus="blur()">选择</el-button>
          <div class="flex-1 output-folder-path">{{apiForm.outputPath}}</div>
        </div>
      </el-form-item>
      <el-form-item label="文件名">
        <el-radio v-model="apiForm.fileNameType" label="1">
          <div class="file-name-text">{{fileNameByUrl}}</div>
        </el-radio>
        <el-radio v-model="apiForm.fileNameType" label="2">
          <el-input
            class="file-name-text"
            placeholder="自定义接口文件名"
            v-model="apiForm.fileName"
            :disabled="apiForm.fileNameType === '1'"
          ></el-input>
        </el-radio>
        <el-button class="action-button" type="primary" @click="run">生成接口文件</el-button>
        <el-button class="action-button" @click="resetForm">清空表单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'JosnInput',
  data() {
    return {

    };
  },
  computed: {

  },
  methods: {

  },
});
</script>

<style scoped lang="less">

</style>
