<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules"
                 class="login-form" label-position="left">

            <div class="title-container">
                <h3 class="title">Login Form</h3>
            </div>

            <el-form-item prop="username">
                <span class="svg-container">
                    <svg-icon icon-class="user"/>
                </span>
                <el-input
                        ref="username"
                        v-model="loginForm.username"
                        placeholder="Username"
                        name="username"
                        type="text"
                        tabindex="1"
                />
            </el-form-item>

            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password"/>
                </span>
                <el-input
                        :key="passwordType"
                        ref="password"
                        v-model="loginForm.password"
                        :type="passwordType"
                        placeholder="Password"
                        name="password"
                        tabindex="2"
                        @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
            </el-form-item>

            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

            <div class="tips">
                <span style="margin-right:20px;">username: admin</span>
                <span> password: any</span>
            </div>

        </el-form>
    </div>
</template>

<script>
    import {validUsername} from '@/util/validate'
    import {setToken} from '@/util/auth'
    import {mixin} from '@/util/mixin'
    export default {
        name: "Login",
        mixins:[mixin],
        data(){
            return{
                loginForm: {
                    username: 'cqdqadmin',
                    password: '1234567'
                },
                loginRules: {
                    username: [{ required: true, trigger: 'blur', validator: (rule, value, callback) => {
                        if (!validUsername(value)) {
                            console.log(value)
                            callback(new Error('Please enter the correct user name'))
                        } else {
                            callback()
                        }}}],
                    password: [{ required: true, trigger: 'blur', validator: (rule, value, callback) => {
                        if (value.length < 6) {
                            callback(new Error('The password can not be less than 6 digits'))
                        } else {
                            callback()
                        }}}]
                },
                loading: false,
                passwordType: 'password',
                redirect: undefined
            }
        },
        methods:{
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.password.focus()
                })
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        this.$http({
                            url:'/login',
                            data:this.loginForm,
                            method:'post'
                        }).then((response)=>{
                            this.loading = false
                            if(response.data && response.status===200){
                                //保存token和用户名，跳转
                                setToken(response.data.cookie)
                                this.$store.commit('user/setUserName',response.data.userName)
                                this.$router.push({name:'layout'})
                            }
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
    $bg=#2d3a4b
    $dark_gray=#889aa4
    $light_gray=#eee
    $cursor=#fff

    .login-container
        min-height 100%
        width 100%
        background-color $bg

        .login-form
            position relative
            width 520px
            max-width 100%
            padding 160px 35px 0
            margin 0 auto
            overflow hidden
        .tips
            font-size 14px
            color #fff
            margin-bottom 10px
            span
                &:first-of-type
                    margin-right 16px
        .svg-container
            padding 6px 5px 6px 15px
            color $dark_gray
            vertical-align middle
            width 30px
            display inline-block
        .title-container
            position relative
            .title
                font-size 26px
                color $light_gray
                margin 0 auto 40px auto
                text-align center
                font-weight bold
        .show-pwd
            position absolute
            right 10px
            top 7px
            font-size 16px
            color $dark_gray
            cursor pointer
            user-select none
        .el-input
            display inline-block
            height 47px
            width 85%
            input
                background transparent
                border 0
                -webkit-appearance none
                border-radius 0
                padding 12px 5px 12px 15px
                color $light_gray
                height 47px
                caret-color $cursor
                &:-webkit-autofill
                    box-shadow 0 0 0 1000px $bg inset !important
                    -webkit-text-fill-color $cursor !important
        .el-form-item
            border 1px solid rgba(255, 255, 255, 0.1)
            background rgba(0, 0, 0, 0.1)
            border-radius 5px
            color #454545


</style>