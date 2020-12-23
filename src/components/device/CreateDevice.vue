<template>
    <div>
        <el-row>
            <el-button class="template-button" type="info" icon="el-icon-message" @click="downloadTemplate">下载模板</el-button>
            <el-upload
                :action="uploadUri"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :file-list="fileList"
                name="114514"
                :accept="fileType">
                <el-button class="template-button" size="small" type="primary">模板批量创建</el-button>
                <div slot="tip" class="template-text">只能上传xlsx文件，大小不超过500kb</div>
            </el-upload>
        </el-row>
        <el-form ref="device" :model="device" :rules="createRules" label-width="80px">
            <el-form-item label="设备名称" prop="deviceName">
                <el-input v-model="device.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="设备编号" prop="deviceSn">
                <el-input v-model="device.deviceSn" placeholder="MQTT,T_Link,TCP,HTTP,JT/T808，南向云协议必填"></el-input>
            </el-form-item>
            <el-form-item label="imei编号">
                <el-input v-model="device.imei" placeholder="LWM2M,NB网关协议必填"></el-input>
            </el-form-item>
            <el-form-item label="操作者" prop="operator">
                <el-input v-model="device.operator"></el-input>
            </el-form-item>
            <el-form-item label="订阅策略">
                <el-select v-model="device.other.autoObserver" placeholder="LWM2M协议必填">
                    <el-option label="自动订阅" value="'0'"></el-option>
                    <el-option label="取消自动订阅" value="'1'"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="imsi">
                <el-input v-model="device.other.imsi" placeholder="LWM2M协议必填，15位数字"></el-input>
            </el-form-item>
            <el-form-item label="psk值">
                <el-input v-model="device.other.pskValue" placeholder="LWM2M协议必填，15位字符串"></el-input>
            </el-form-item>
            <el-form-item label="产品ID" prop="productId">
                <el-input v-model="device.productId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" @click="onSubmit">创建</el-button>
                <el-button @click="onReset('device')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
    import XLSX from 'xlsx'
    import {mixin} from '@/util/mixin'
    import {baseUrl} from '@/util/http'

    export default {
        name: "CreateDevice",
        mixins:[mixin],
        data(){
            return{
                device:{
                    deviceName:'',
                    deviceSn:'',
                    imei:'',
                    operator:'',
                    other:{
                        autoObserver:0,
                        imsi:'',
                        pskValue:''
                    },
                    productId:''
                },
                loading:false,
                createRules:{
                    deviceName:[{required:true,trigger: 'blur',message:'设备名称必填'}],
                    operator:[{required:true,trigger: 'blur',message:'操作者必填'}],
                    productId:[{required:true,trigger: 'blur',message:'产品ID必填'}]
                },
                uploadUri:baseUrl+'/operations/device/templateUpload',
                fileList:[],
                fileType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }
        },
        methods:{
            onSubmit(){
                this.$refs.device.validate(valid => {
                    if(valid){
                        this.loading=true
                        this.$http({
                            url:'/operations/device/create',
                            data:this.device,
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
            },
            downloadTemplate(){
                this.$http({
                    url:'/operations/device/templateDownload',
                    method:'get',
                    responseType:'blob'
                }).then(response=>{
                    if(response.data && response.status===200){
                        this.handleDownload(response.data)
                    }
                })
            },
            handleDownload(result){
                let fileName='ctwing.xlsx'
                let blob=new Blob([result],{type: 'application/.nmsl'})
                let link=document.createElement('a')
                if('download' in link){
                    link.download=fileName
                    link.style.display='none'
                    link.href=URL.createObjectURL(blob)
                    document.body.appendChild(link)
                    link.click()
                    URL.revokeObjectURL(link.href)
                    document.body.removeChild(link)
                }else{
                    navigator.msSaveBlob(blob,fileName)
                }
            },
            // eslint-disable-next-line no-unused-vars
            uploadSuccess(response,file,fileList){
                this.$alert('文件上传成功:','上传结果',{
                    confirmButtonText:'ok',
                })
            },
            // eslint-disable-next-line no-unused-vars
            uploadError(err,file,fileList){
                this.$alert('文件上传失败: '+err.toString(),'上传结果',{
                    confirmButtonText:'ok',
                })
            },
            beforeUpload(file){
                //检验文件类型
                if(file.type!==this.fileType){
                    this.$message('必须上传xlsx文件！')
                    return false
                }
                let reader=new FileReader()
                reader.onload=(e)=>{
                    let bstr=e.target.result
                    let wb=XLSX.read(bstr,{type:'binary'})
                    let wsName=wb.SheetNames[0]
                    let ws=wb.Sheets[wsName]
                    let maxtrix=XLSX.utils.sheet_to_json(ws,{header:1})
                    this.$http({
                        url:'/operations/device/templateParse',
                        method:'post',
                        data:this.maxtrixToArray(maxtrix),
                    }).then(response=>{
                        //只要返回的不是200，那就是文件解析错误，停止上传
                        if(response){
                            if(response.status!==200){
                                return false
                            }
                            this.$alert('上传成功: '+response.data.message,'上传结果',{
                                confirmButtonText:'ok',
                            })
                        }
                    })
                }
                reader.readAsBinaryString(file)
            },
            //将xlsx中读取到的矩阵转换为新建设备的对象数组
            maxtrixToArray(m){
                let result=[]
                for(let i=2;i<m[0].length;i++){
                    let o={}
                    for(let j=0;j<m.length;j++){
                        switch(j){
                            case 0:
                                o.col=m[j][i]
                                break
                            case 1:
                                o.deviceName=m[j][i]
                                break
                            case 2:
                                o.deviceSn=m[j][i]
                                break
                            case 3:
                                o.imei=m[j][i]
                                break
                            case 4:
                                o.operator=m[j][i]
                                break
                            case 5:
                                o.autoObserver=m[j][i]
                                break
                            case 6:
                                o.imsi=m[j][i]
                                break
                            case 7:
                                o.pskValue=m[j][i]
                                break
                            case 8:
                                o.productId=m[j][i]
                                break
                        }
                    }
                    result.push(o)
                }
                return result
            }
        }
    }
</script>

<style scoped lang="stylus">
    .template-button
        margin 5px
    .template-text
        font-size xx-small
</style>