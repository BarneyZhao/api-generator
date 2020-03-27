<template>
  <div class="FolderSelector">
    <el-breadcrumb>
      <el-breadcrumb-item
        v-for="(path, index) in breadcrumbList"
        :key="index"
      >
        <a v-if="index !== breadcrumbList.length - 1"
          @click="breadcrumbClick(index)"
        >{{path}}</a>
        <span v-else>{{path}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="list-window">
      <el-table
        :show-header="false"
        :data="pathList"
        @row-click="handleRowClick"
        style="width: 100%"
      >
        <el-table-column class-name="path-row">
          <template v-slot="{row}">
            <i v-if="row.isDirectory" class="el-icon-folder"></i>
            <i v-else class="el-icon-document"></i>
            <span class="file-name">{{row.name}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog-buttons">
      <el-button @click="buttonsClick(false)">取 消</el-button>
      <el-button type="primary" @click="buttonsClick(true)">确 定</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as biz from '../biz/homeBiz';

export default Vue.extend({
  name: 'FolderSelector',
  data() {
    return {
      breadcrumbList: [] as string[],
      pathList: [] as any[],
    };
  },
  mounted() {
    this.getFilePos();
  },
  methods: {
    getFilePos(path?: string) {
      biz.getTheFilePos(path).then((data: any) => {
        this.breadcrumbList = data.currentPath.split('/');
        this.pathList = data.listInPath;
      });
    },
    breadcrumbClick(index: number) {
      const newPath = this.breadcrumbList.slice(0, index + 1).join('/');
      this.getFilePos(newPath);
    },
    handleRowClick(row: any) {
      if (row.isDirectory) {
        this.getFilePos(row.path);
      }
    },
    buttonsClick(isConfirm: boolean) {
      let path = '';
      if (isConfirm) {
        path = this.breadcrumbList.join('/');
      }
      this.$emit('dialogCheck', path);
    },
  },
});
</script>

<style scoped lang="less">
.list-window {
  height: 400px;
  border: 1px solid rgba(0,0,0,.2);
  border-radius: 5px;
  overflow-y: auto;
  margin-top: 10px;
  i {
    font-size: 18px;
  }
  .file-name {
    margin-left: 10px;
  }
}
.dialog-buttons {
  margin-top: 10px;
  text-align: right;
}
</style>
<style scoped>
.list-window >>> .path-row {
  cursor: pointer;
}
</style>
