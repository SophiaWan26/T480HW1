import axios, { AxiosError } from "axios";

let port = 3000;
let host = "localhost";
let protocol = "http";
let baseUrl = `${protocol}://${host}:${port}`;

test("/error", async () => {
    try {
        await axios.get(`${baseUrl}/error`);
    } catch (error) {
        let errorObj = error as AxiosError;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(404);
        expect(response.data).toEqual({ error: "url not found" });
    }
});
test("GET /foo?bar returns message", async () => {
    let bar = "xyzzy";
    let { data } = await axios.get(`${baseUrl}/foo?bar=${bar}`);
    expect(data).toEqual({ message: `You sent: ${bar} in the query` });
});

test("GET /foo returns error", async () => {
    try {
        await axios.get(`${baseUrl}/foo`);
    } catch (error) {
        let errorObj = error as AxiosError;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(400);
        expect(response.data).toEqual({ error: "bar is required" });
    }
});

test("POST /bar works good", async () => {
    let bar = "xyzzy";
    let result = await axios.post(`${baseUrl}/foo`, { bar });
    expect(result.data).toEqual({ message: `You sent: ${bar} in the body` });
});

test("GET /books list", async ()=>{
  let result = await axios.get(`${baseUrl}/books`)
  expect(result.data.length).toEqual(2)

})
test("GET /authors list", async ()=>{
  let result = await axios.get(`${baseUrl}/authors`)
  expect(result.data.length).toEqual(1)

})

test("GET /book returns error", async () => {
    try {
        await axios.get(`${baseUrl}/book`);
    } catch (error) {
        let errorObj = error as AxiosError;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(400);
        expect(response.data).toEqual({ error: "id is required" });
    }
});
test("GET /author returns error", async () => {
    try {
        await axios.get(`${baseUrl}/author`);
    } catch (error) {
        let errorObj = error as AxiosError;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(400);
        expect(response.data).toEqual({ error: "id is required" });
    }
});
test("post /author update returns error", async () => {
    try {
        await axios.post(`${baseUrl}/updateAuthor`);
    } catch (error) {
        let errorObj = error as AxiosError;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(400);
        expect(response.data).toEqual({"error": "body data is required"});
    }
});
test("post /author insert returns error", async () => {
    try {
        await axios.post(`${baseUrl}/author`);
    } catch (error) {
        let errorObj = error as AxiosError;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(400);
        expect(response.data).toEqual({"error": "body data is required"});
    }
});
test("post /book update returns error", async () => {
    try {
        await axios.post(`${baseUrl}/updateBook`);
    } catch (error) {
        let errorObj = error as AxiosError;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(400);
        expect(response.data).toEqual({"error": "body data is required"});
    }
});
test("post /book insert returns error", async () => {
    try {
        await axios.post(`${baseUrl}/book`);
    } catch (error) {
        let errorObj = error as AxiosError;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(400);
        expect(response.data).toEqual({"error": "body data is required"});
    }
});
test("POST /book author not exist", async ()=>{
   const body ={
    "id":4,
    "author_id":"3",
    "title":"My Fairest Lady",
    "pub_year":"2000",
    "genre":"romance"
  }
    try {
  await axios.post(`${baseUrl}/book`,body)
    } catch (error) {
        // casting needed b/c typescript gives errors "unknown" type
        let errorObj = error as AxiosError;
        // if server never responds, error.response will be undefined
        // throw the error so typescript can perform type narrowing
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let {response} = errorObj
        console.log(response.data)
        expect(response.status).toEqual(400)
        expect(response.data).toEqual({"error": "the author id not exist"})
        }
})

test("POST /book work ok ", async ()=>{
   const body ={
    "id":"10",
    "author_id":1,
    "title":"My Fairest Lady",
    "pub_year":"2000",
    "genre":"romance"
  }
  console.log(body)
  let result = await axios.post(`${baseUrl}/book`,body)
  expect(result.data).toEqual({"id":"10","message": "insert id"})

})
test("POST / error book  id  exist", async ()=>{
   const body ={
    "id":"10",
    "author_id":1,
    "title":"My Fairest Lady",
    "pub_year":"2000",
    "genre":"romance"
  }
    try {
   await axios.post(`${baseUrl}/book`,body)
    } catch (error) {
        // casting needed b/c typescript gives errors "unknown" type
        let errorObj = error as AxiosError;
        // if server never responds, error.response will be undefined
        // throw the error so typescript can perform type narrowing
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let {response} = errorObj
        console.log(response.data)
        expect(response.status).toEqual(400)
        expect(response.data).toEqual({"error": "the book id is exist"})
        }

})


test("POST / error author insert work bad author exist", async ()=>{
   const body ={
        "id": "1",
        "name": "Figginsworth III",
        "bio": "A traveling gentleman."
  }
    try {
   await axios.post(`${baseUrl}/author`,body)
    } catch (error) {
        // casting needed b/c typescript gives errors "unknown" type
        let errorObj = error as AxiosError;
        // if server never responds, error.response will be undefined
        // throw the error so typescript can perform type narrowing
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let {response} = errorObj
        console.log(response.data)
        expect(response.status).toEqual(400)
        expect(response.data).toEqual({"error": "the author id is exist"})
        }

})

test("POST / author insert work ok", async ()=>{
   const body ={
        "id": "2",
        "name": "Figginsworth III",
        "bio": "A traveling gentleman."
  }
  let result = await axios.post(`${baseUrl}/author`,body)
  expect(result.data).toEqual("OK")

})

test("DELETE /  author delete work ok", async ()=>{
    let deleteid = 2;
  let result = await axios.delete(`${baseUrl}/author?id=${deleteid}`)
  expect(result.data).toEqual("OK")

})

test("DELETE/ERROR  author delete work bad", async ()=>{
    let deleteid = 100;
    try {
   await axios.delete(`${baseUrl}/author?id=${deleteid}`)
    } catch (error) {
        // casting needed b/c typescript gives errors "unknown" type
        let errorObj = error as AxiosError;
        // if server never responds, error.response will be undefined
        // throw the error so typescript can perform type narrowing
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let {response} = errorObj
        console.log(response.data)
        expect(response.status).toEqual(400)
        expect(response.data).toEqual({"error":"the delete id not exist"})
        }
})
test("DELETE/ERROR  author delete id required error", async ()=>{
    try {
   await axios.delete(`${baseUrl}/author`)
    } catch (error) {
        // casting needed b/c typescript gives errors "unknown" type
        let errorObj = error as AxiosError;
        // if server never responds, error.response will be undefined
        // throw the error so typescript can perform type narrowing
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let {response} = errorObj
        console.log(response.data)
        expect(response.status).toEqual(400)
        expect(response.data).toEqual({"error": "delete id is required"})
        }
})
test("DELETE/ERROR  book delete id required error", async ()=>{
    try {
   await axios.delete(`${baseUrl}/book`)
    } catch (error) {
        // casting needed b/c typescript gives errors "unknown" type
        let errorObj = error as AxiosError;
        // if server never responds, error.response will be undefined
        // throw the error so typescript can perform type narrowing
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let {response} = errorObj
        console.log(response.data)
        expect(response.status).toEqual(400)
        expect(response.data).toEqual({"error": "delete id is required"})
        }
})
test("DELETE /  book delete work ok", async ()=>{
    let deleteid = 10;
    try{
    await axios.delete(`${baseUrl}/book?id=${deleteid}`)
    } catch (error) {
        // casting needed b/c typescript gives errors "unknown" type
        let errorObj = error as AxiosError;
        // if server never responds, error.response will be undefined
        // throw the error so typescript can perform type narrowing
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let {response} = errorObj
        console.log(response.data)
        expect(response.status).toEqual(400)
        expect(response.data).toEqual({"error":"the book id not exist"})
        }

})




test("POST / updatebook author not exist", async ()=>{
   const body ={
    "id":4,
    "author_id":"500",
    "title":"My Fairest Lady",
    "pub_year":"2000",
    "genre":"romance"
  }
    try {
   await axios.post(`${baseUrl}/updateBook`,body)
    } catch (error) {
        // casting needed b/c typescript gives errors "unknown" type
        let errorObj = error as AxiosError;
        // if server never responds, error.response will be undefined
        // throw the error so typescript can perform type narrowing
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let {response} = errorObj
        console.log(response.data)
        expect(response.status).toEqual(400)
        expect(response.data).toEqual({"error": "the author id not exist"})
        }

})

test("POST /Updatebook work ok ", async ()=>{
   const body ={
    "id":"1",
    "author_id":1,
    "title":"My Fairest Lady",
    "pub_year":"2002",
    "genre":"romance"
  }
  console.log(body)
  let result = await axios.post(`${baseUrl}/updateBook`,body)
  expect(result.data).toEqual("OK")

})
test("POST / error Update book  id not   exist", async ()=>{
   const body ={
    "id":"300",
    "author_id":1,
    "title":"My Fairest Lady",
    "pub_year":"2000",
    "genre":"romance"
  }
    try {
   await axios.post(`${baseUrl}/updateBook`,body)
    } catch (error) {
        // casting needed b/c typescript gives errors "unknown" type
        let errorObj = error as AxiosError;
        // if server never responds, error.response will be undefined
        // throw the error so typescript can perform type narrowing
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let {response} = errorObj
        console.log(response.data)
        expect(response.status).toEqual(400)
        expect(response.data).toEqual({"error": "the book id not exist"})
        }


})


test("POST / error Updateauthor work bad author not exist", async ()=>{
   const body ={
        "id": "200",
        "name": "Figginsworth III",
        "bio": "A traveling gentleman."
  }
    try {
   await axios.post(`${baseUrl}/updateAuthor`,body)
    } catch (error) {
        // casting needed b/c typescript gives errors "unknown" type
        let errorObj = error as AxiosError;
        // if server never responds, error.response will be undefined
        // throw the error so typescript can perform type narrowing
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let {response} = errorObj
        console.log(response.data)
        expect(response.status).toEqual(400)
        expect(response.data).toEqual({"error": "the author id not exist"})
        }


})

test("POST / Update author work ok", async ()=>{
   const body ={
        "id": "1",
        "name": "Figginsworth IIIxxxxx",
        "bio": "A traveling gentleman."
  }
  let result = await axios.post(`${baseUrl}/updateAuthor`,body)
  expect(result.data).toEqual("OK")

})
