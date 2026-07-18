class Fetcho{
    config = {
        timeout: 1000,
        headers : {
            'Content-Type': 'application/json'
        }
    }
    requestInterceptor = [];
    responseInterceptor = [];

    constructor(config){
        this.config = this.mergedConfig(config);
    }

    request(url, config){
        const finalConf = this.mergedConfig(config)
        let promise = Promise.resolve({
            url,
            config: finalConf
        })
        const chain = [
            ...this.requestInterceptor,
            {successFn: this.dispatchUrl.bind(this)},
            ...this.responseInterceptor
        ]

        for (const {successFn, failFn} of chain){
            promise = promise.then((res)=>{
                try {
                    return successFn(res);
                } catch(err){
                    if (failFn) return failFn(err);
                    return Promise.reject(err)
                }
            }, (err)=>{
                if (failFn) return failFn(err);
                return Promise.reject(err)
            })
        }
        return promise;
    }


    async dispatchUrl({url, config}){
        // const finalConf = this.mergedConfig(config)
        // console.log('final', finalConf)
        const timeout = config.timeout

        const abortController = new AbortController()
        let timeoutId;
        if(timeout){
            timeoutId = setTimeout(()=> abortController.abort(), timeout)
        }

        try{
            const response = await fetch(`${this.config.baseURL}${url}`, {...config, signal: abortController.signal})
            return response
        } finally{
            timeoutId && clearTimeout(timeoutId)
        }
    }

    async get(url, config){
        return this.request(url, {...config, method: 'GET'})
    }
    async post(url, data, config){
        return this.request(url, {
            ...config,
            method: "POST",
            body: JSON.stringify(data)
        });
    }

    mergedConfig(config){
        return {
            ...this.config,
            ...config,
            headers: {
                ...(this.config?.headers || {}),
                ...(config?.headers || {}),
            }
        }
    }

    addRequestInterceptor(successFn, failFn){
        this.requestInterceptor.push({successFn, failFn})
    }

    addResponseInterceptor(successFn, failFn){
        this.responseInterceptor.push({successFn, failFn})
    }
}


function create(config){
    return new Fetcho(config)
}


export default {
    create,
}