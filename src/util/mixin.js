export const mixin={
    methods:{
        onMessage(msg){
            this.$alert(msg, '请求结果', {
                confirmButtonText: '确定',
            })
        }
    }
}