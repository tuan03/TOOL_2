async function test() {
    const mt = await fetch("http://localhost:3000/get-random")
    const data = await mt.json()
    console.log(data)
}   
test()