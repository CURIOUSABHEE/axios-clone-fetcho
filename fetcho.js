class Fetcho{
    config = {
        headers : {
            'Content-Type': 'application/json'
        }
    }
    constructor(config){
        this.config = this.mergedConfig(config);
        // console.log(this.config)
    }

    async get(url, config){
        // console.log("config: ", this.config, config)
        const finalConf = this.mergedConfig(config)
        console.log(finalConf)
        const response = fetch(`https://jsonplaceholder.typicode.com${url}/1`, finalConf)
        return response
    }

    mergedConfig(config){
        return {
            ...this.config,
            ...config,
            headers: {
                ...(this.config.headers || {}),
                ...(config.headers || {}),
            }
        }
    }
}


function create(config){
    return new Fetcho(config)
}


export default {
    create,
}