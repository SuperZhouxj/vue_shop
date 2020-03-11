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
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
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
      activeName: 'many'
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
    async handleChange() {
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
    },
    // 标签页单击事件
    handleClick() {}
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
</style>
