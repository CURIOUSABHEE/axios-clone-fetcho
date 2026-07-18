import fetcho from "./fetcho.js";


const api = fetcho.create({
    baseURL: 'https://jsonplaceholder.typicode.com/',
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
})



async function main() {
    const response = await api.get("/todos")
    const data = await response.json()
    // console.log("_____Response____")
    // console.log(response)
    // console.log("_____Final___Response____")
    console.log(data)
}

main()