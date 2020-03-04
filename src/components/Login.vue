<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登陆头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 登陆表格 通过 :rules 属性传入约定的表格验证规则 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        :model="loginForm"
        :rules="loginFormRules"
        class="form_login"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登陆名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置按钮，重置表单数据
    resetForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    // 登陆按钮
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登陆失败！')
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
        console.log(res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  width: 100%;
  background-color: #2b4b6b;
}
.login_box {
  height: 300px;
  width: 450px;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar_box {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  padding: 10px;
  border: 1px solid #eee;
  position: absolute;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.form_login {
  bottom: 0;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  position: absolute;
}
.btn {
  float: right;
}
</style>
