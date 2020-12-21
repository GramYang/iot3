<template>
    <div>
        <el-table v-loading="loading" :data="deviceList" style="width:100%;" max-height="500">
            <el-table-column prop="deviceSn" label="设备编号" width="150"></el-table-column>
            <el-table-column prop="deviceId" label="设备id" width="150"></el-table-column>
            <el-table-column fixed="left" prop="deviceName" label="设备名称" width="150"></el-table-column>
            <el-table-column prop="deviceModel" label="设备型号" width="150"></el-table-column>
            <el-table-column prop="manufacturerId" label="制造商ID" width="150"></el-table-column>
            <el-table-column prop="tenantId" label="租户id" width="150"></el-table-column>
            <el-table-column prop="productId" label="产品id" width="150"></el-table-column>
            <el-table-column prop="imei" label="imei号" width="150"></el-table-column>
            <el-table-column prop="imsi" label="imsi号" width="150"></el-table-column>
            <el-table-column prop="firmwareVersion" label="固件版本" width="150"></el-table-column>
            <el-table-column prop="deviceVersion" label="设备版本" width="150"></el-table-column>
            <el-table-column prop="deviceStatus" label="设备状态" width="150" :filters="deviceStatusRules"
                             :filter-method="deviceStatusFilter" filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag :type="deviceStatusTag(scope)">{{scope.row.deviceStatus}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="autoObserver" label="是否订阅" width="150" :filters="observerRules"
                             :filter-method="observerFilter" filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag :type="observerTag(scope)">{{scope.row.autoObserver}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="150"></el-table-column>
            <el-table-column prop="createBy" label="创建者" width="150"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="150"></el-table-column>
            <el-table-column prop="updateBy" label="更新者" width="150"></el-table-column>
            <el-table-column prop="activeTime" label="激活时间" width="150"></el-table-column>
            <el-table-column prop="logoutTime" label="注销时间" width="150"></el-table-column>
            <el-table-column prop="netStatus" label="设备在线状态" width="150" :filters="netStatusRules"
                             :filter-method="netStatusFilter" filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag :type="netStatusTag(scope)">{{scope.row.netStatus}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="onlineAt" label="最后上线时间" width="150"></el-table-column>
            <el-table-column prop="offlineAt" label="最后下线时间" width="150"></el-table-column>
            <el-table-column prop="productProtocol" label="产品协议" width="150" :filters="protocolRules"
                             :filter-method="protocolFilter" filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag :type="protocolTag(scope)">{{scope.row.netStatus}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" @current-change="handlePageChange" :current-page.sync="pageNow"
                       :page-size="pageSize" layout="total,prev,pager,next,jumper" :total="total"></el-pagination>
    </div>
</template>

<script>
    import {mixin} from '@/util/mixin'
    export default {
        name: "LocalDeviceList",
        mixins:[mixin],
        data(){
            return{
                deviceList:[],
                //text和value分别对应过滤标签文字和表格文字，两个都不能换，但是其文字项在数组中的下标正好为返回值
                deviceStatusRules:[{text:'未注册',value:'未注册'},{text:'已注册',value:'已注册'},
                    {text:'已激活',value:'已激活'}, {text:'已注销',value:'已注销'}],
                observerRules:[{text:'订阅',value:'订阅'},{text:'不订阅',value:'不订阅'}],
                netStatusRules:[{text:'在线',value:'在线'},{text:'离线',value:'离线'}],
                protocolRules:[{text:'T-LINK',value:'T-LINK'},{text:'MQTT',value:'MQTT'},
                    {text:'LWM2M',value:'LWM2M'},{text:'TUP',value:'TUP'},{text:'HTTP',value:'HTTP'},
                    {text:'JT/T808',value:'JT/T808'},{text:'TCP',value:'TCP'},{text:'私有TCP',value:'私有TCP'},
                    {text:'私有UDP',value:'私有UDP'},{text:'网关MQTT',value:'网关MQTT'},{text:'南向云',value:'南向云'}],
                pageNow:0,
                pageSize:10,
                total:0,//后端暂时不返回total
                searchKey:{},
                loading:false,
            }
        },
        created(){
            this.searchKey=this.$route.query
            this.queryDeviceList()
        },
        methods:{
            //设备状态过滤
            deviceStatusFilter(value,row){
                this.deviceStatusRules.forEach((item,index)=>{
                    if(item.value===value){
                        return row.deviceStatus===index-1
                    }
                })
            },
            deviceStatusTag(scope){
                return this.tagType(scope.row.deviceStatus+1)
            },
            //订阅规则过滤
            observerFilter(value,row){
                this.observerRules.forEach((item,index)=>{
                    if(item.value===value){
                        return row.autoObserver===index
                    }
                })
            },
            observerTag(scope){
                return this.tagType(scope.row.autoObserver)
            },
            //设备网络状态过滤
            netStatusFilter(value,row){
                this.netStatusRules.forEach((item,index)=>{
                    if(item.value===value){
                        return row.netStatus===(index+1)
                    }
                })
            },
            netStatusTag(scope){
                return this.tagType(scope.row.netStatus)
            },
            //产品协议过滤
            protocolFilter(value,row){
                this.protocolRules.forEach((item,index)=>{
                    if(item.value===value){
                        return row.productProtocol===index+1
                    }
                })
            },
            protocolTag(scope){
                return this.tagType(scope.row.productProtocol)
            },
            tagType(value){
                switch (value) {
                    case 0:
                        return 'primary'
                    case 1:
                        return 'success'
                    case 2:
                        return 'info'
                    case 3:
                        return 'danger'
                    case 4:
                        return 'warning'
                    default:
                        return 'primary'
                }
            },
            handleUpdate(row){
                this.$router.push({name:'update_device',params:{d:row}})
            },
            handleDelete(row){
                this.$router.push({name:'delete_device',params:{d:row}})
            },
            handlePageChange(val){
                this.pageNow=val
                this.searchKey.page=val.toString()
                this.queryDeviceList()
            },
            queryDeviceList(){
                this.loading=true
                this.$http({
                    url:'/operations/device/queryLocalList',
                    params:this.searchKey,
                    method:'get'
                }).then((response)=>{
                    this.loading=false
                    if(response.data && response.status===200){
                        this.onMessage('请求成功')
                        this.deviceList=response.data.result
                        this.pageNow=parseInt(response.data.pageNum)
                    }else{
                        this.onMessage('请求失败: '+response.data.message)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
    .pagination
        display block
</style>