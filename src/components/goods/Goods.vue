<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="价格" prop="goods_price"></el-table-column>
        <el-table-column label="数量" prop="goods_number"></el-table-column>
        <el-table-column label="重量" prop="goods_weight"></el-table-column>
        <el-table-column label="商品状态" prop="goods_state"></el-table-column>
        <el-table-column label="添加时间" prop="add_time"></el-table-column>
        <el-table-column label="更新时间" prop="upd_time"></el-table-column>
        <el-table-column label="热销品数量" prop="hot_mumber"></el-table-column>
        <el-table-column label="是否是热销品" prop="is_promote"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="editDialogById(scope.row.goods_id)"
            >编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-search" @click="deleteRoleById">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
    },
    // 监听商品编辑按钮事件
    editDialogById(id) {},
    // 删除商品事件
    deleteRoleById() {}
  }
}
</script>

<style lang="less" scoped>
</style>
