<template>
    <el-form ref="device" :model="newDevice" :rules="updateRules" label-width="80px">
        <el-form-item label="设备名称" prop="deviceName">
            <el-input v-model="newDevice.deviceName"></el-input>
        </el-form-item>
        <el-form-item label="操作者" prop="operator">
            <el-input v-model="newDevice.operator"></el-input>
        </el-form-item>
        <el-form-item label="订阅策略">
            <el-select v-model="newDevice.other.autoObserver" placeholder="LWM2M协议必填">
                <el-option label="自动订阅" value="'0'"></el-option>
                <el-option label="取消自动订阅" value="'1'"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="imsi">
            <el-input v-model="newDevice.other.imsi" placeholder="LWM2M协议必填，15位数字"></el-input>
        </el-form-item>
        <el-form-item label="产品ID" prop="productId">
            <el-input v-model="newDevice.productId"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button :loading="loading" type="primary" @click="onSubmit">更新</el-button>
            <el-button @click="onReset('device')">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mixin} from '@/util/mixin'
    export default {
        name: "UpdateDevice",
        mixins:[mixin],
        data(){
            return{
                newDevice:{
                    deviceId:'',
                    deviceName:'',
                    operator:'',
                    other:{
                        autoObserver:'',
                        imsi:''
                    },
                    productId:''
                },
                loading:false,
                updateRules:{
                    deviceName:[{required:true,trigger:'blur',message:'设备名称必填'}],
                    operator:[{required:true,trigger:'blur',message:'操作者必填'}],
                    productId:[{required:true,trigger:'blur',message:'产品id必填'}]
                }
            }
        },
        created(){
            this.newDevice.deviceId=this.$route.params.d.deviceId
            this.newDevice.deviceName=this.$route.params.d.deviceName
            this.newDevice.operator=this.$route.params.d.operator
            this.newDevice.other.autoObserver=this.$route.params.d.autoObserver
            this.newDevice.other.imsi=this.$route.params.d.imsi
            this.newDevice.productId=this.$route.params.d.productId
        },
        methods:{
            onSubmit(){
                this.$refs.device.validate(valid=>{
                    if(valid){
                        this.loading=true
                        this.$http({
                            url:'/operations/device/update',
                            data:this.newDevice,
                            method:'post'
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