<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateDialog">添加商品</el-button>
        </el-col>
      </el-row>
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        border
        :show-row-hover="false"
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 是否有效-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: green"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作-->
        <template slot="option" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteDialog(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页栏-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="ParentCateList"
            :props="cascaderprops"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="40%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="90px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取商品数据列表
      cateList: [],
      // 获取商品列表查询添加
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品列表总页数
      total: 0,
      // table列定义
      columns: [
        {
          label: '商品名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将该列定义为模板列
          type: 'template',
          // 定义模板列名称
          template: 'isok'
        },
        {
          label: '排序',
          // 将该列定义为模板列
          type: 'template',
          // 定义模板列名称
          template: 'order'
        },
        {
          label: '操作',
          // 将该列定义为模板列
          type: 'template',
          // 定义模板列名称
          template: 'option'
        }
      ],
      // 控制添加商品对话框显示隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        // 分类父 ID 如果要添加1级分类，则父分类Id应该设置为  `0`
        cat_pid: 0,
        // 分类层级，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },
      // 添加表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      ParentCateList: [],
      // 选择的父节点Id
      selectedKeys: [],
      // 级联选择器配置选项
      cascaderprops: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 控制编辑分类对话框显示隐藏
      editCateDialogVisible: false,
      editCateForm: {},
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      // console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
      // this.$message.success('获取商品列表成功')
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 监听添加商品事件
    addCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      // console.log(res.data)
      this.ParentCateList = res.data
    },
    // 级联选择项发生变化时触发
    handleChange() {
      // console.log(this.selectedKeys)
      // 如果selectedKeys的长度大于0 ，则选择了父类分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
        // return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
      // console.log(this.addCateForm)
    },
    // 监听 确定按钮 事件
    addCateConfirm() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加分类的网络请求
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加分类对话框关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 监听编辑分类对话框关闭事件
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 监听编辑按钮事件
    async editDialog(catId) {
      const { data: res } = await this.$http.get(`categories/${catId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      this.$message.success('获取分类成功')
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    // 监听修改分类对话框确定按钮事件
    async editDialogConfirm() {
      const { data: res } = await this.$http.put(
        `categories/${this.editCateForm.cat_id}`,
        {
          cat_name: this.editCateForm.cat_name
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新分类失败')
      }
      this.editCateDialogVisible = false
      this.getCateList()
      this.$message.success('更新分类成功')
    },
    // 监听删除按钮事件
    async deleteDialog(catId) {
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
      const { data: res } = await this.$http.delete(`categories/${catId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.getCateList()
      this.$message.success('删除分类成功')
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.tree-table {
  margin-top: 15px;
}
</style>
