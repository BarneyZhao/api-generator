<template>
  <div class="home">
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
            <span class="span-margin">代码缩进格式</span>
            <el-radio-group v-model="apiForm.codeIndent" size="small">
              <el-radio-button :label="4">4</el-radio-button>
              <el-radio-button :label="2">2</el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="文件名">
          <div class="row align-items-center">
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
            <div class="flex-1"></div>
            <el-button class="action-button" type="primary" @click="run">生成接口文件</el-button>
            <el-button class="action-button" @click="resetForm">清空表单</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getFileNameByUrl, isJSON } from '../utils/strUtil';
import * as biz from '../biz/homeBiz';

export default Vue.extend({
  name: 'home',
  data() {
    return {
      apiFormRules: {
        url: [
          { required: true, message: '请输入url', trigger: 'blur' },
        ],
      },
      apiForm: {
        method: 'post',
        codeIndent: 4,
        url: '',
        localUrl: '',
        mockUrl: '',
        apiParam: '',
        apiResult: '',
        outputPath: '',
        fileNameType: '1',
        fileName: '',
      },
    };
  },
  computed: {
    fileNameByUrl(): string {
      return this.apiForm.url && getFileNameByUrl(this.apiForm.url);
    },
    paramJsonValid(): boolean {
      return !!this.apiForm.apiParam && isJSON(this.apiForm.apiParam);
    },
    resultJsonValid(): boolean {
      return !!this.apiForm.apiResult && isJSON(this.apiForm.apiResult);
    },
  },
  methods: {
    run() {
      const that = this;
      (this.$refs.apiForm as any).validate(async (valid: boolean) => {
        if (valid) {
          if (!that.apiForm.outputPath) {
            that.$notify.warning('请选择文件生成路径');
          } else if (!that.apiForm.apiResult) {
            that.$notify.error('接口结果 JSON 不能为空');
          } else {
            const apiFileName = that.apiForm.fileNameType === '1' ? that.fileNameByUrl : that.apiForm.fileName;
            const apiFilePath = `${that.apiForm.outputPath}/${apiFileName}.ts`;
            const flag = await biz.checkFile(apiFilePath).then((isFileExist) => {
              if (isFileExist) {
                return that.$confirm(`文件 ${apiFileName}.ts 已存在, 重新生成将覆盖原文件, 是否继续?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                }).then(() => true).catch(() => false);
              }
              return true;
            });
            if (flag) {
              biz.generateApiFile({
                apiFileName, apiFilePath, ...that.apiForm,
              }).then((data: any) => {
                if (!data.err) that.$notify.success(`文件 ${apiFileName}.ts 生成成功！`);
                else that.$notify.error(data.err.message || data.err);
              }).catch((err) => {
                that.$notify.error(err.message || err);
              });
            }
          }
        }
      });
    },
    resetForm() {
      (this.$refs.apiForm as any).resetFields();
      this.apiForm.apiParam = '';
      this.apiForm.apiResult = '';
    },
    selectSearchFolder() {
      biz.selectFolder().then((data: any) => {
        ([this.apiForm.outputPath] = data);
      });
    },
  },
});
</script>

<style scoped>
.valid-border >>> .el-textarea__inner {
  border-color: #67C23A;
}
.unvalid-border >>> .el-textarea__inner {
  border-color: #F56C6C;
}
</style>
<style scoped lang="less">
.home {
  padding: 2rem;
}
.main {
  padding-right: 45px;
}
.span-margin {
  margin: 0 20px 0 70px;
}
.data-json-text {
  &-param {
    padding-right: 10px;
  }
  &-result {
    padding-left: 10px;
  }
}
.output-folder-path {
  margin-left: 20px;
}
.file-name-text {
  display: inline-block;
  min-width: 300px;
}
.action-button {
  margin-left: 20px;
}
</style>
