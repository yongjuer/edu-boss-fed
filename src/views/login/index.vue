<template>
  <div class="login">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request'
import qs from 'qs'
export default {
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为 6 到 18 位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      // console.log('点击提交')
      // this.$refs.form.validate(valid => {})
      try {
        // 1.设置校验
        await this.$refs.form.validate()
        // console.log('通过了校验')
        // 2.发送请求
        const { data } = await request({
          url: '/front/user/login',
          // headers: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          data: qs.stringify(this.form)
        })
        // console.log(data)
        // 3.响应处理
        if (data.state === 1) {
          this.$router.push({
            name: 'home'
          })
          this.$message.success('登录成功')
        } else {
          this.$message.error('登录失败')
        }
      } catch (error) {
        // 设置校验失败后的功能（也就是进行提示）
        console.log('没有通过校验')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    background-color: #fff;
    padding: 20px;
    width: 300px;
    border-radius: 10px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
