<template>
    <el-form ref="device" :model="deviceKey" :rules="deleteRules" label-width="120px">
        <el-form-item label="产品ID" prop="productId">
            <el-input v-model="deviceKey.productId"></el-input>
        </el-form-item>
        <el-form-item label="设备IDs（逗号间隔）" prop="deviceIds">
            <el-input v-model="deviceKey.deviceIds" placeholder="多个id用,分割，最多200个"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button :loading="loading" type="primary" @click="onSubmit">(多个)删除</el-button>
            <el-button @click="onReset('device')">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mixin} from '@/util/mixin'
    export default {
        name: "DeleteDevice",
        mixins:[mixin],
        data(){
            return{
                deviceKey:{
                    productId:'',
                    deviceIds:''
                },
                loading:false,
                deleteRules:{
                    productId:[{required:true,trigger:'blur',message:'必填'}],
                    deviceIds:[{required:true,trigger:'blur',message:'必填'}]
                }
            }
        },
        created(){
            this.deviceKey.productId=this.$route.params.d.productId
            this.deviceKey.deviceIds=this.$route.params.d.deviceIds
        },
        methods:{
            onSubmit(){
                this.$refs.device.validate(valid => {
                    if(valid){
                        this.loading=true
                        this.$http({
                            url:'/operations/device/delete',
                            params:this.deviceKey,
                            method:'get'
                        }).then((response)=>{
                            this.loading=false
                            if(response.status===200){
                                this.onMessage('请求成功: '+response.data.code+' '+response.data.message)
                            }else{
                                this.onMessage('请求失败: '+response.data.message)
                            }
                        })
                    }else{
                        return false
                    }
                })
            },
            onReset(formName){
                this.$refs[formName].resetFields()
            }
        }
    }
</script>

<style scoped>

</style>