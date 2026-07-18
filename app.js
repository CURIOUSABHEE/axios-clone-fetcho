import fetcho from "./fetcho.js";


const api = fetcho.create({
    baseURL: 'https://jsonplaceholder.typicode.com/',
    timeout: 1000,
    headers: {'Content-Type': 'application/json', 'x-api-key': 'key'}
})

api.addRequestInterceptor((config)=>{
    // Performaing any task
    console.log("Interceptor config received: ", config)
    return config
}, (error)=>{
    // Error Message
    return Promise.reject(error)
})

api.addResponseInterceptor((response)=>{
    // Performaing any task
    console.log("Interceptor Response received: ", response)
    return response
}, (error)=>{
    // Error Message
    return Promise.reject(error)
})

async function main() {
    const response = await api.get("/todos")
    // console.log("Response: ", response)
    const data = await response.json()
    console.log(data)
}

main()