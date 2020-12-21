<template>
    <el-menu
        :collapse="isCollapse"
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <h3 v-show="isCollapse">iot</h3>
        <h3 v-show="!isCollapse">iot后台管理系统</h3>
        <div v-for="item in menu" :key="item.path">
            <el-menu-item v-if="!item.children" :index="item.path" @click="clickMenu(item)">
                <i :class="'el-icon-' + item.icon"></i>
                <span slot="title">{{ item.label }}</span>
            </el-menu-item>
            <el-submenu v-if="item.children" :index="item.label" >
                <template slot="title">
                    <i :class="'el-icon-' + item.icon"></i>
                    <span slot="title">{{ item.label }}</span>
                </template>
                <el-menu-item-group v-for="(subItem, subIndex) in item.children" :key="subIndex">
                    <el-menu-item :index="subItem.path" @click="clickMenu(subItem)">
                        <i :class="'el-icon-' + subItem.icon"></i>
                        <span slot="title">{{ subItem.label }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </div>
    </el-menu>
</template>

<script>
    export default {
        name:'SideBar',
        //计算属性
        computed: {
            //没有子菜单
            noChildren() {
                return this.menu.filter(item => !item.children)
            },
            //有子菜单 (这样设置会有一个问题 就是有子菜单的 永远会在没有子菜单的下面
            hasChildren() {
                return this.menu.filter(item => item.children)
            },
            isCollapse() {
                // 这里的数据就是从vuex取得
                return this.$store.getters.isCollapse
            }
        },
        data() {
            return {
                menu: [
                    {
                        path: '/',
                        name: 'home',
                        label: '首页',
                        icon: 's-home',
                    },
                    {
                        path: '/service',
                        name: 'service',
                        label: '服务',
                        icon: 'service',
                        children:[
                            {
                                path:'/service/device/create',
                                name:'create_device',
                                label:'创建设备',
                                icon:'mobile-phone',
                            },
                            {
                                path:'/service/device/queryList',
                                name:'query_device_list',
                                label:'查询设备列表',
                                icon:'grape',
                            }
                        ]
                    },
                    {
                        path: '/management',
                        name: 'management',
                        label: '管理',
                        icon: 'dish',
                        children: [
                            {
                                path:'/service/device/searchLocalDevice',
                                name:'search_local_device',
                                label:'搜索本地设备',
                                icon:'search'
                            }
                        ]
                    }
                ]

            }
        },
        methods: {
            //跳转路由 根据名称跳转
            clickMenu(item) {
                this.$router.push({name:item.name}).catch(err=>{err})
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .el-menu
        height 100%
        border none
        h3
            color #ffffff
            text-align center
            line-height 48px
    .el-menu-vertical-demo
        width 200px
        min-height 400px
</style>