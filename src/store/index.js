import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const app={
    namespaced:true,
    state:{
        isCollapse:false
    },
    mutations:{
        collapseMenu(state){
            state.isCollapse=!state.isCollapse
        }
    }
}

const user={
    namespaced: true,
    state:{
        name:'',
    },
    mutations:{
        setUserName:(state,name)=>{
            state.name=name
        }
    }
}

export default new Vuex.Store({
    modules:{app,user},
    getters:{
        name:state=>state.user.name,
        isCollapse:state=>state.app.isCollapse
    }
})