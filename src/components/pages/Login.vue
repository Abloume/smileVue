<template>
    <div>
        <van-nav-bar title="用户登录" left-text="返回" left-arrow @click-left="goBack"></van-nav-bar>

        <div class="register-panel">
            <van-field v-model="username" label="用户名" icon="clear" placeholder="请输入用户名" :error-message="usernameErrorMsg" required @click-icon="username = ''"></van-field>
            <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" :error-message="passwordErrorMsg" required></van-field>
            <div class="register-button">
                <van-button type="primary" size="large" :loading="openLoading" @click="LoginAction">马上登录</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import url from '@/serviceAPI.config.js'
import { Toast } from 'vant'

export default {
    data() {
        return {
            username: '',
            password: '',
            openLoading: false,
            usernameErrorMsg: '',
            passwordErrorMsg: '',
        }
    },
    created() {
        if(localStorage.userInfo){
            Toast.success('您已经登录')
            this.$router.push('/')
        }
    },
    methods: {
        goBack() {
            this.$route.go(-1)
        },
        LoginAction() {
            this.checkForm() && this.axiosLoginrUser()
        },
        axiosLoginrUser() {
            this.openLoading = true
            axios({
                url: url.login,
                method: 'post',
                data: {
                    userName: this.username,
                    password: this.password
                }
            })
            .then(response => {
                console.log(response)
                if (response.data.code==200 && response.data.message) {
                    new Promise((resolve,reject)=>{
                        localStorage.userInfo = {userName:this.username}
                        setTimeout(()=>{
                            resolve()
                        },500)
                    }).then(()=>{
                        Toast.success('登录成功！')
                        this.$router.push('/')
                    }).catch(err=>{
                        Toast.fail('登录状态保存失败')
                        console.log(err)
                    })
                } else if (response.data.message!='用户名不存在') {
                    Toast.fail('密码错误。')
                    this.openLoading = false
                } else {
                    Toast.fail('用户名不存在。')
                    this.openLoading = false
                }
            })
            .catch(error => {
                Toast.fail('登录失败。')
                this.openLoading = false
            })
        },
        checkForm() {
            let isOk = true
            if (this.username.length < 5) {
                this.usernameErrorMsg = "用户名不能小于5位"
                isOk = false
            } else {
                this.usernameErrorMsg = ''
            }
            if (this.password.length < 6) {
                this.passwordErrorMsg = "密码不能少于6位"
                isOk = false
            } else {
                this.passwordErrorMsg = ''
            }
            return isOk
        } 
    }
}
</script>

<style scoped>
.register-panel {
    width: 96%;
    border-radius: 5px;
    margin: 20px auto;
    padding-bottom: 50px;
}
.register-button {
    padding-top: 10px;
}
</style>
