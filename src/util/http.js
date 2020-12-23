import axios from 'axios'
import md5 from 'js-md5'
import * as base64 from 'js-base64'
import {removeToken} from "@/util/auth";
import router from '@/router/index'
import {MessageBox} from "element-ui";
import {JSEncrypt} from 'encryptlong'

export const baseUrl='http://localhost:9000'

const publicKey ='MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3HMMf5Ic/3aMbl6U9HHq\n' +
    'brH04jciphH0sNzw7kjZQgaSSFK4kIxRU11Rz6iGiMHYcJitP0FdQzkCkVs3MpWY\n' +
    'JzFy+TYJ5d91BWT9b70ljseJCTEVkRSRkdVF0qK0bQJgGr+TP0EG9mcqBrbc5RQe\n' +
    'paQpJu4Zxc/Rvnp2YL2rlB4IrKJN3v+txlRFdH2eekEGif7vreQj7yhEA7zHtLBk\n' +
    'u8K/NdqsHlw4DZ/n9jcZbAjulSTnpMuI+Q+/KfUexB/fsWfcIbWDs0wU1ljW33Hb\n' +
    'RCS4mXVOVJzUrWLoGXrwDpbzDSTJ6pa3lGs2b8jLenQzLO3xeDO2lxAjznIKA7ec\n' +
    'pwIDAQAB'


const encrypt = new JSEncrypt()
encrypt.setPublicKey(publicKey)

function paramsencode(data){
    let b64=base64.encode(JSON.stringify(data))
    let m5=md5('cqdq_iot')
    return{b64,m5}
}

const http=axios.create({
    baseURL:baseUrl,
    timeout:1000*10,
    withCredentials:true,
    headers:{
        'Content-Type':"application/json:charset=utf-8"
    }
})

http.interceptors.request.use((config)=>{
    let res={}
    if(config.method==='post' && config.data){//post
        config.data={data:encrypt.encryptLong(JSON.stringify(config.data))}
    }else if(config.method==='get'&& config.params){//get
        res=paramsencode(config.params)
        config.params={params:res.b64}
        config.headers.signature=res.m5
    }
    return config
},(error)=>{
    Promise.reject(error)
})

http.interceptors.response.use((config)=>{
    return config
},(error)=>{
    if(error.response && error.response.status===401){
        removeToken()
        router.push('/login')
    }else{
        MessageBox.alert(error, '请求结果', {
            confirmButtonText: '确定',
        })
    }
    Promise.reject(error)
})

export default http