import fetcho from "./fetcho.js";


const api = fetcho.create({
    baseURL: 'https://jsonplaceholder.typicode.com/',
    timeout: 1000,
    headers: {'Content-Type': 'application/json', 'x-api-key': 'key'}
})



async function main() {
    const response = await api.get("/todos", {
        headers: {
            'Content-Type': 'application/xml', 
            'x-api-key': 'sajdkfhl',
            'x-idempotency-key' : "jaskdfhalskj"
        }
    })
    const data = await response.json()
    console.log(data)
}

main()