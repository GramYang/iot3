const path=require('path')
function resolve(dir){
    return path.join(__dirname,dir)
}
//包压缩
const CompressionWebpackPlugin=require('compression-webpack-plugin')
const productionGzipExtensions=/\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
//依赖替换cdn，都是免费的！！找了半天！
const cdn={
    externals:{
        vue:'Vue',
        vuex:'Vuex',
        'vue-router':'VueRouter',
        'axios':'axios',
        'xlsx':'XLSX',
    },
    build:{
        css:[
            'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
        ],
        js:[
            'https://cdn.jsdelivr.net/npm/vue@2.6.11',
            'https://unpkg.com/vuex@3.6.0',
            'https://unpkg.com/vue-router@3.4.9/dist/vue-router.js',
            'https://unpkg.com/axios@0.21.0/dist/axios.min.js',
            'https://unpkg.com/xlsx@0.16.9/dist/xlsx.min.js',
        ]
    }
}

module.exports={
    devServer:{
        port:8085,
    },
    publicPath:'./',
    productionSourceMap:false,
    chainWebpack(config){
        //配置cdn
        config.plugin('html').tap(args => {
            console.log('config',config)
            console.log('args',args)
            args[0].cdn= cdn.build
            return args
        })
        //加载svg
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    },
    configureWebpack:config=>{
        //依赖替换cdn
        Object.assign(config,{externals:cdn.externals})
        //gzip压缩传输
        const plugins=[]
        plugins.push(new CompressionWebpackPlugin({
            filename:'[path].gz[query]',
            algorithm:'gzip',
            test:productionGzipExtensions,
            threshold:10240,
            minRatio: 0.8,
        }))
        config.plugins=[...config.plugins,...plugins]
    },
}