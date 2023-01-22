import express, { Response } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let app = express();
app.use(express.json());

// create database "connection"
let db = await open({
    filename: "../database.db",
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");


// SQLITE EXAMPLES
// comment these out or they'll keep inserting every time you run your server
// if you get 'UNIQUE constraint failed' errors it's because
// this will keep inserting a row with the same primary key
// but the primary key should be unique


// insert example
await db.run(
    "INSERT INTO authors(id, name, bio) VALUES('1', 'Figginsworth III', 'A traveling gentleman.')"
);
await db.run(
    "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES ('1', '1', 'My Fairest Lady', '1866', 'romance')"
);

// insert example with parameterized queries
// important to use parameterized queries to prevent SQL injection
// when inserting untrusted data
let statement = await db.prepare(
    "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES (?, ?, ?, ?, ?)"
);
await statement.bind(["2", "1", "A Travelogue of Tales", "1867", "adventure"]);
await statement.run();

// select examples
let authors = await db.all("SELECT * FROM authors");
console.log("Authors", authors);
let books = await db.all("SELECT * FROM books");
console.log("Books", books);
let filteredBooks = await db.all("SELECT * FROM books WHERE pub_year = '1867'");

console.log("Some books", filteredBooks);

//
// EXPRESS EXAMPLES
//
// GET/POST/DELETE example
class Data{
   message: string
  id:number
  constructor(message:string,id :number){
    this.id= id
    this.message=message
  }
}
interface Foo {
    message: string;
}
interface Error {
    error: string;
}
interface Book{
    message: string;
}
interface Author{
  message : string;
}
type FooResponse = Response<Foo | Error>;
type BookResponse = Response<Book|Error>;
type AuthorResponse = Response<Author|Error>
// res's type limits what responses this request handler can send
// it must send either an object with a message or an error
app.get("/foo", (req, res: FooResponse) => {
    if (!req.query.bar) {
        return res.status(400).json({ error: "bar is required" });
    }
    return res.json({ message: `You sent: ${req.query.bar} in the query` });
});
app.post("/foo", (req, res: FooResponse) => {
    if (!req.body.bar) {
        return res.status(400).json({ error: "bar is required" });
    }
    return res.json({ message: `You sent: ${req.body.bar} in the body` });
});
app.delete("/foo", (req, res) => {
    // etc.
    res.sendStatus(200);
});

//
// ASYNC/AWAIT EXAMPLE
//

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// need async keyword on request handler to use await inside it
app.get("/bar", async (req, res: FooResponse) => {
    console.log("Waiting...");
    // await is equivalent to calling sleep.then(() => { ... })
    // and putting all the code after this in that func body ^
    await sleep(3000);
    // if we omitted the await, all of this code would execute
    // immediately without waiting for the sleep to finish
    console.log("Done!");
    return res.sendStatus(200);
});
// test it out! while server is running:
// curl http://localhost:3000/bar

// there is my self code server book and author
//get books list
app.get("/books",async (req,res:BookResponse)=>{
let books :Book= await db.all("SELECT * FROM books ");
  res.send(books)
});
// get author list
app.get("/authors",async (req,res:AuthorResponse)=>{
 let authors : Author = await db.all("SELECT * FROM authors")
  res.send(authors)
})
//get use book id query book info 
app.get("/book/:id", async (req,res:BookResponse)=>{
let book :Book= await db.all("SELECT * FROM books WHERE id =  ? ",req.params.id);
  res.send(book)
})

app.get("/author/:id", async (req,res:AuthorResponse)=>{
let  author:Author= await db.all("SELECT * FROM authors WHERE id =  ? ",req.params.id);
  res.send(author)
})
// insert book data 
app.post("/book",async (req, res:BookResponse )=>{
    const sql ="INSERT INTO books(id, author_id, title, pub_year, genre) VALUES (?,?,?,?,?)";
    const {id,author_id,title,pub_year,genre}=req.body 
    let flag :boolean=false
    let flagid:boolean=false
    let books = await db.all("SELECT * FROM books");
    let authors = await db.all("SELECT * FROM authors");
    for (let i = 0; i < authors.length; i++) {
        if (author_id==authors[i].id){
            flag=true
        }
    }
        console.log("id = >"+ id)
    for (let i = 0; i < books.length; i++) {
        console.log(books[i]["id"])
        if(id==books[i]["id"]){
            flagid=true
        }
    }
    if (flag && !flagid){
    db.run(sql,id,author_id,title,pub_year,genre)
        const data =new  Data("insert id",id)
        res.send(data)
    }
    if(!flag){
        res.send({"message":"the author id not exist"})
        return 0;
    }
    if (flagid){
        res.send({"message":"the book id is exist"})
    }
})
// insert author data
app.post("/author", async (req,res:AuthorResponse )=>{
    let authors = await db.all("SELECT * FROM authors");
  const sql = "INSERT INTO authors(id, name, bio) VALUES(?,?,?)"
  const {id,name,bio}=req.body
    let flag :boolean=false
    for (let i = 0; i < authors.length; i++) {
        if (id==authors[i].id){
            flag=true
        }
    }
    if(flag){
        res.send({"message":"the author id is exist"})
    }
    if (!flag){
        db.run(sql,id,name,bio)
        res.sendStatus(200)
    }
})
app.post("/updateBook",async (req, res:BookResponse)=>{
    let books = await db.all("SELECT * FROM books");
    let authors = await db.all("SELECT * FROM authors");
    const sql = "UPDATE books set  author_id = ? , title = ? , pub_year = ? , genre = ? where id = ? "
    const {id,author_id,title,pub_year,genre}=req.body
    let flag :boolean=false
    let flagid:boolean=false
    for (let i = 0; i < authors.length; i++) {
        if (author_id==authors[i].id){
            flag=true
        }
    }
    for (let i = 0; i < books.length; i++) {
        if(id==books[i].id){
            flagid=true
        }
    }
    if (flag && flagid){
        db.run(sql,author_id,title,pub_year,genre,id)
        res.sendStatus(200)
        return

    }
    if (!flag){
        res.send({"message":"the author id not exist"})
        return 
    }

    if (!flagid){
        res.send({"message":"the book id not exist"})
        return
    }
})
// update author data
app.post("/updateAuthor", async (req, res:AuthorResponse )=>{

    let books = await db.all("SELECT * FROM books");
    let authors = await db.all("SELECT * FROM authors");
  const sql = "UPADATE authors set name = ? , set bio = ? where id = ?";
  const {id,name,bio}=req.body
    let flag :boolean=false
    for (let i = 0; i < authors.length; i++) {
        if (id==authors[i].id){
            flag=true
        }
    }
    if (flag){
        db.run (sql,name,bio,id)
        res.sendStatus(200)
        res.send(id)
        return
    }
    else {
        res.send({"message":"the author id not exist"})
        return
    }
})

app.delete("/book/:id", async (req,res:BookResponse)=>{
    let books = await db.all("SELECT * FROM books");
  const sql = "DELETE FROM books WHERE id = ? "
    let flag:boolean=false
    for (let i = 0; i < books.length; i++) {
        if (books[i].id==req.params.id){
            flag=true
        }
    }
    if (flag){
        db.run(sql,req.params.id)
        res.sendStatus(200)
    }
    else {
        res.send({"message":"the book id not exist"})
    }
})

app.delete("/author/:id", async (req,res:AuthorResponse)=>{
    let authors = await db.all("SELECT * FROM authors");
    let flag :boolean=false
    for (let i = 0; i < authors.length; i++) {
        if (req.params.id==authors[i].id){
            flag=true
        }
    }
    if (flag){
        const sql = "DELETE FROM authors WHERE id = ?";
        db.run(sql,req.params.id)
        res.sendStatus(200)
    }
    else {
        res.send({"message":"the delete id not exist"})
    }

})


// run server
let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
