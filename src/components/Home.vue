<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="subItem.id" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    // 左侧菜单数据
    return {
      menulist: []
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    loginout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373b41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 22px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>
