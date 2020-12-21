<template>
    <el-form ref="device" :model="deviceKey" :rules="queryRules" label-width="120px">
        <el-form-item label="产品ID" prop="productId">
            <el-input v-model="deviceKey.productId"></el-input>
        </el-form-item>
        <el-form-item label="设备ID" prop="deviceId">
            <el-input v-model="deviceKey.deviceId"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button :loading="loading" type="primary" @click="onSubmit">单个查询</el-button>
            <el-button @click="onReset('device')">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mixin} from '@/util/mixin'
    export default {
        name: "QueryDevice",
        mixins:[mixin],
        data(){
            return{
                deviceKey:{
                    productId:'',
                    deviceId:''
                },
                loading:false,
                queryRules:{
                    productId:[{required:true,trigger:'blur',message:'产品id必填'}],
                    deviceId:[{required:true,trigger:'blur',message:'设备id必填'}]
                }
            }
        },
        methods:{
            onSubmit(){
                this.$refs.device.validate(valid=>{
                    if(valid){
                        this.loading=true
                        this.$http({
                            url:'/operations/device/query',
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