import axios from 'axios'

axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = '你的接口地址';

// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) =>{
    // 在发送请求之前做某件事
    if(config.method === 'post'){
        config.data = JSON.stringify(config.data);
    }
    return config;
}, (error) =>{
    //todo..
    return Promise.reject(error);
});

// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    //对响应数据做些事
    if(!res.data){
        return Promise.reject(res);
    }
}, (error) =>{
    //todo...
    return Promise.reject(error);
});

// 返回一个Promise(发送post请求)
export function fetch(url, params){
    return new Promise((resolve, reject) =>{
        axios.post(url, params)
            .then(response =>{
                resolve(response.data);
            }, error =>{
                reject(error);
            })
            .catch(error =>{
                reject(error);
            })
    })
}