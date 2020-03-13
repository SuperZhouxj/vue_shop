<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="警告：只允许为三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="cate_classed">
        <el-col>
          <span>
            选择商品分类：
            <el-cascader
              v-model="selectedCateKeys"
              :options="CateList"
              :props="cascaderprops"
              @change="handleChange"
            ></el-cascader>
          </span>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <el-table :data="manyFormData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="closeTag(i, scope.row)"
                >{{item}}</el-tag>
                <!-- new tag按钮和文本框组件-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数列表"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <el-table :data="onlyFormData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="closeTag(i, scope.row)"
                >{{item}}</el-tag>
                <!-- new tag按钮和文本框组件-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性列表"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加属性对话框-->
    <el-dialog
      :title="activeName == 'many' ? '添加参数列表':'添加属性列表'"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="activeName == 'many' ? '参数列表':'属性列表'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改属性对话框-->
    <el-dialog
      :title="activeName == 'many' ? '修改参数列表':'添加属性列表'"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="activeName == 'many' ? '参数列表':'属性列表'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取的商品分类列表
      CateList: [],
      // 级联选择器双向绑定数据对象
      selectedCateKeys: [],
      // 级联选择器配置选项
      cascaderprops: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 被激活的页签名称
      activeName: 'many',
      manyFormData: [],
      onlyFormData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类失败')
      }
      // console.log(res.data)
      this.CateList = res.data
    },
    // 级联选择变化事件监听
    handleChange() {
      this.getParamsChange()
    },
    // 标签页点击事件监听
    handleClick() {
      this.getParamsChange()
    },
    // 获取参数的列表数据
    async getParamsChange() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyFormData = []
        this.onlyFormData = []
        return
      }
      // 选择三级分类，根据选中的分类Id和标签页名称，查询参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      console.log(res.data)
      // 将attr_vals转换为数组，便于遍历,三元运算为了解决attr_vals为空返回的数组为[""]
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 解决多行数据文本框和按钮一起变化问题
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyFormData = res.data
      } else {
        this.onlyFormData = res.data
      }
    },
    // 监听添加对话框事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听添加对话框确实按钮事件
    addDialogConfirm() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数列表失败')
        }
        this.$message.success('添加参数成功')
        this.getParamsChange()
        this.addDialogVisible = false
      })
    },
    // 监听修改对话框关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async editDialog(attrid) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrid}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogConfirm() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: res
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) {
          return this.$http.message('更新参数失败')
        }
        this.getParamsChange()
        this.editDialogVisible = false
      })
    },
    // 监听删除按钮事件
    async deleteParams(attrid) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => error)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attrid}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.getParamsChange()
      this.$message.success('删除参数成功')
    },
    // 文本框失去焦点或者按下enter键都会触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return ，则说明输入了内容，进行后续处理
      // console.log()
      // 对象中添加文本框内容
      row.attr_vals.push(row.inputValue.trim())
      // console.log(row.attr_vals)
      // 文本框置空
      row.inputValue = ''
      // 文本框隐藏 显示tag
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 对attr_vals进行操作，并保存到数据库中
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改标签失败')
      }
      this.$message.success('修改标签成功')
    },
    // 控制文本框显示
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      // $nextTick的作用：当页面上的元素被重新渲染之后，才调用回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 监听tag关闭事件
    closeTag(i, row) {
      // 删除指定索引的tag
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 如果选择的不是三级分类，则返回true，按钮不可用
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取选中的三级分类ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.cate_classed {
  margin: 15px 0;
}
.el-tag {
  margin-right: 15px;
}
.input-new-tag {
  width: 130px;
}
</style>
