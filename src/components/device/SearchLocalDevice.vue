<template>
    <div>
        <el-form ref="device" :model="searchKey" label-width="80px">
            <el-form-item label="设备名称" prop="deviceName">
                <el-input v-model="searchKey.deviceName" placeholder="输入完整名称，置空查询全部"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button @click="onReset('device')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mixin} from '@/util/mixin'
    export default {
        name: "SearchLocalDevice",
        mixins:[mixin],
        data(){
            return{
                searchKey:{
                    deviceName:'',
                    page:'1',
                },
            }
        },
        methods:{
            onSubmit(){
                this.$refs.device.validate(valid=>{
                    if(valid){
                        this.$router.push({name:'local_device_list',query:this.searchKey})
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