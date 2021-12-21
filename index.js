
import express from "express"
import TodoModel from  "./TodoSchema/todoSchema.js"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"





const app = express()
const port = 8000
dotenv.config()
const url=process.env.DB_URL
app.use(express.json())
app.use(cors())

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    // if database is connected successfully
    console.log("database connected successfully........................................")
}).catch((error)=>{
    // if an error occurs
    console.log(error)
})

// home route
app.get("/",(req,res)=>{
    res.send("Welcome to KAPTAYNE Todo API")
})
// get all Todos
app.get("/todos",async(req,res)=>{
    const todo =await TodoModel.find({});

    if(todo){
        return res.status(200).json({
            message:"fetch all todos from database",
            data:todo
        })
    }else{
        return res.status(400).json({
            message:"failed to fetch todos from database"
        })
    }
})
// Create a new Todo into our database
app.post("/create",async(req,res)=>{
    const{title,description,isCompleted}=req.body
   
    const createTodo=await TodoModel.create({
        title,
        description,
        isCompleted
    })
    if(createTodo){
        return res.status(201).json({
            message:"Todo created successfully",
            data:createTodo
        })
    }else{
        return res.status(204).json({
            message:"failed to create a new Todo"
        })
    }
})
// Update
app.patch("/todos/:id",async(req,res)=>{
    const {id}=req.params;
    const{isCompleted}=req.body
    const updateTodo= await TodoModel.updateOne({isCompleted:isCompleted}).where({_id:id})
    if (updateTodo) {
        return res.status(200).json({
            message: "Todo updated successfully",
            data: updateTodo
        })
    } else {
        return res.status(400).json({
            message: "failed to update todo"
        })
    }

})
// delete
app.delete("/todo/:id",async(req,res)=>{
    const {id}=req.params;
    const deleteTodo=await TodoModel.findByIdAndDelete({_id:id})
    if(deleteTodo){
        return res.status(200).json({
            message:"Todo deleted successfully",
            data: deleteTodo
        })
    }else{
        return res.status(400).json({
            message:"failed to delete todo"
        })
    }
})



app.listen(port, () => {
    console.log(`TODO server running at ${port}`)
})



