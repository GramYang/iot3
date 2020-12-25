import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import getPageTitle from '@/util/utils'
import {getToken} from '@/util/auth'
import Login from "@/components/Login"
import Layout from "@/components/layout/Layout"
import Home from "@/components/layout/Home"
import ServiceHall from "@/components/ServiceHall"
import CreateDevice from "@/components/device/CreateDevice"
import DeleteDevice from "@/components/device/DeleteDevice";
import UpdateDevice from "@/components/device/UpdateDevice";
import QueryDevice from "@/components/device/QueryDevice";
import Management from "@/components/Management";
import QueryDeviceList from "@/components/device/QueryDeviceList";
import DeviceList from "@/components/device/DeviceList";
import LocalDeviceList from "@/components/device/LocalDeviceList";
import SearchLocalDevice from "@/components/device/SearchLocalDevice";

NProgress.configure({showSpinner:false})
Vue.use(Router)

const router=new Router({
    // mode:'history',
    base:__dirname,
    routes:[
        {
            path:'/login',
            name:'login',
            component: Login,
            hidden:true
        },
        {
            path:'/layout',
            name:'layout',
            redirect:'/layout/home',
            component: Layout,
            meta:{title:'后台管理系统'},
            children:[
                {
                    path:'home',
                    name:'home',
                    meta:{title:'首页'},
                    component:Home
                },
                {
                    path:'service',
                    name:'service',
                    meta:{title:'服务大厅'},
                    component: ServiceHall
                },
                {
                    path:'service/device/create',
                    name:'create_device',
                    meta:{title:'新建设备'},
                    component:CreateDevice
                },
                {
                    path:'service/device/searchLocalDevice',
                    name:'search_local_device',
                    meta:{title:'搜索本地设备'},
                    component: SearchLocalDevice
                },
                {
                    path:'service/device/localDeviceList',
                    name:'local_device_list',
                    meta:{title:'本地设备列表'},
                    component: LocalDeviceList
                },
                {
                    path:'service/device/delete',
                    name:'delete_device',
                    meta:{title:'删除设备'},
                    component:DeleteDevice
                },
                {
                    path:'service/device/update',
                    name:'update_device',
                    meta:{title: '更新设备'},
                    component:UpdateDevice
                },
                {
                    path:'service/device/query',
                    name:'query_device',
                    meta:{title: '查询设备'},
                    component:QueryDevice
                },
                {
                    path:'service/device/queryList',
                    name:'query_device_list',
                    meta:{title:'查询设备列表'},
                    component: QueryDeviceList
                },
                {
                    path:'service/device/deviceList',
                    name:'device_list',
                    meta:{title:'设备列表'},
                    component: DeviceList
                },
                {
                    path:'management',
                    name:'management',
                    meta:{title:'管理'},
                    component:Management
                }
            ]
        }
    ]
})

router.beforeEach((to,from,next)=>{
    NProgress.start()
    document.title=getPageTitle(to.meta.title)
    let token=getToken()
    if(!token && to.name!=='login'){
        next({name:'login'})
    }else if(!token && to.name==='login'){
        next()
    }else if(token && to.name==='login'){
        next({name:'layout'})
    }else if(token && to.path==='/'){
        next({name:'layout'})
    }else if(!token && to.path==='/'){
        next({name:'login'})
    }
    next()
    NProgress.done()
})

router.afterEach(()=>{
    NProgress.done()
})

export default router