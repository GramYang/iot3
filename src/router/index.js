import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import getPageTitle from '@/util/utils'
import
{getToken} from '@/util/auth'

NProgress.configure({showSpinner:false})
Vue.use(VueRouter)

const router=new VueRouter({
    // mode:'history',
    base:__dirname,//对应dist目录
    routes:[
        {
            path:'/login',
            name:'login',
            component: ()=>import('@/components/Login'),
            hidden:true
        },
        {
            path:'/layout',
            name:'layout',
            redirect:'/layout/home',
            component: ()=>import('@/components/layout/Layout'),
            meta:{title:'后台管理系统'},
            children:[
                {
                    path:'home',
                    name:'home',
                    meta:{title:'首页'},
                    component:()=>import('@/components/layout/Home')
                },
                {
                    path:'service',
                    name:'service',
                    meta:{title:'服务大厅'},
                    component: ()=>import('@/components/ServiceHall')
                },
                {
                    path:'service/device/create',
                    name:'create_device',
                    meta:{title:'新建设备'},
                    component:()=>import('@/components/device/CreateDevice')
                },
                {
                    path:'service/device/searchLocalDevice',
                    name:'search_local_device',
                    meta:{title:'搜索本地设备'},
                    component: ()=>import('@/components/device/SearchLocalDevice')
                },
                {
                    path:'service/device/localDeviceList',
                    name:'local_device_list',
                    meta:{title:'本地设备列表'},
                    component: ()=>import('@/components/device/LocalDeviceList')
                },
                {
                    path:'service/device/delete',
                    name:'delete_device',
                    meta:{title:'删除设备'},
                    component:()=>import('@/components/device/DeleteDevice')
                },
                {
                    path:'service/device/update',
                    name:'update_device',
                    meta:{title: '更新设备'},
                    component:()=>import('@/components/device/UpdateDevice')
                },
                {
                    path:'service/device/query',
                    name:'query_device',
                    meta:{title: '查询设备'},
                    component:()=>import('@/components/device/QueryDevice')
                },
                {
                    path:'service/device/queryList',
                    name:'query_device_list',
                    meta:{title:'查询设备列表'},
                    component: ()=>import('@/components/device/QueryDeviceList')
                },
                {
                    path:'service/device/deviceList',
                    name:'device_list',
                    meta:{title:'设备列表'},
                    component: ()=>import('@/components/device/DeviceList')
                },
                {
                    path:'management',
                    name:'management',
                    meta:{title:'管理'},
                    component:()=>import('@/components/Management')
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