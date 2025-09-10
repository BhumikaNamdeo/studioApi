const express=require("express");
 const fs = require('fs');
 const cors=require("cors")

const app=express()

app.use(cors())
app.use(express.json())



app.post('/create',(req,res)=>{
     const{filename,filedata}=req.body
     const filepath ="./uploads/"+ filename

    fs.writeFile(filepath,filedata,(err)=>{
        if(err){
            console.log(err)
            res.send('Error occured')
        }else{
            res.send('file created successfully')
        }
    } )
    
      
}
)

 app.get('/read/:filename',(req,res)=>{
  const filename = req.params.filename
  const filepath='./uploads/'+ filename
  fs.readFile(filepath,{encoding:"utf-8"},(err,data)=>{
    if(err){
        res.send('Error occured')
    }else{
        res.send(data)
    }
  })
 })

// /*/update/filename=>filedata update */


app.patch('/update/:filename',(req,res)=>{
    const filedata = req.body.filedata
    const filename = req.params.filename
    const filepath ='./uploads/'+filename

    fs.writeFile(filepath,filedata,(err)=>{
        if(err){
            res.send("Error occured")
        }else{
            res.send("file updated succesfully")
        }
    })
})
 
// /*/delete/filename=>delete file
app.delete('/delete/:filename',(req,res)=>{
   const filename = req.params.filename
   const filepath = './uploads/' + filename
   fs.unlink(filepath,(err)=>{
    if(err){
        res.send("Error ocuured")
    }
    else{
        res.send("file deleted successfully")}
   })
})

// /*/get all=> all in the uploads folder*/

app.get ('/get-all',(req,res)=>{
  fs.readdir('./uploads',(err,files)=>{
    if(err){
        res.send ("directory not readable")
    }else{
        res.send(files)
    }
  })
})

app.listen(3000,()=>{
    console.log('server is start on port ')
})
