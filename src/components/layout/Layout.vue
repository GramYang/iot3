<template>
    <el-container>
        <el-aside>
            <SideBar/>
        </el-aside>
        <el-container>
            <el-header>
                <CommonHeader/>
            </el-header>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import SideBar from "@/components/layout/SideBar"
    import CommonHeader from "@/components/layout/CommonHeader"
    export default {
        name: "Layout",
        components:{SideBar,CommonHeader},
    }
</script>

<style scoped lang="stylus">

</style>