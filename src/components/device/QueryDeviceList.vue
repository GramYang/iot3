<template>
    <el-form ref="device" :model="deviceListKey" :rules="queryListRules" label-width="80px">
        <el-form-item label="产品ID" prop="productId">
            <el-input v-model="deviceListKey.productId"></el-input>
        </el-form-item>
        <el-form-item label="搜索值">
            <el-input v-model="deviceListKey.searchValue" placeholder="设备名称、id等"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button :loading="loading" type="primary" @click="onSubmit">查询列表</el-button>
            <el-button @click="onReset('device')">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mixin} from '@/util/mixin'
    export default {
        name: "QueryDeviceList",
        mixins:[mixin],
        data(){
            return{
                deviceListKey:{
                    productId:'10079997',
                    searchValue:'',
                    page:'0'
                },
                loading:false,
                queryListRules:{
                    productId:[{required:true,trigger:'blur',message:'产品id必填'}],
                }
            }
        },
        methods:{
            onSubmit(){
                this.$refs.device.validate(valid=>{
                    if(valid){
                        this.$router.push({name:'device_list',query:this.deviceListKey})
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