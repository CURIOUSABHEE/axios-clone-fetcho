class Fetcho{
    config = {
        headers : {
            'Content-Type': 'application/json'
        }
    }
    constructor(config){
        this.config = config;
    }

    async get(url){
        const response = fetch(`https://jsonplaceholder.typicode.com${url}/1`)
        return response
    }
}


function create(config){
    return new Fetcho(config)
}


export default {
    create,
}