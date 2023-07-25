const express = require('express')                    // http request sambhale ke liye
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false}))
app.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017/blogDB');

const postSchema =  new mongoose.Schema({
    title : { type: String, required: [true,'Title is Required']},
    imageurl: {type: String, required: [true,'Image Url is Required'] },
    content: {type:String, minlength:[200,'Minimun 200 char is required']},
    postDate: {type:Date, default: Date.now},

});

const Post = mongoose.model('Post',postSchema);

app.get('/', (req, res) => {
  Post.find((err,data)=>{
    if(err)                              // sari post ko home pe get karne ke liye
    console.log(err)
    else
    res.render("Home",{posts:data});

  })
})

app.get('/viewpost/:postid', (req, res) =>{
  let pid=req.params.postid;                                      // view more karne ke liye
  Post.findById(pid,(err,data)=>{
    if(err)
    console.log(err)                                             // viewmore ki file me se nikal ne ke liye 
    else
    res.render("viewpost",{post:data});
  })
});

app.get('/editpost/:postid', (req, res) =>{
  let pid=req.params.postid;                                    
  Post.findById(pid,(err,data)=>{
    if(err)                                                         // edit karne ke liye post ko 
    console.log(err)                                             
    else
    res.render("editpost",{post:data,result:''});
  })
});

app.get('/about', (req, res) => {
    res.render("About");
  })

app.post('/delpost', (req, res) => {
    let pid=req.body.pid;
    Post.findByIdAndDelete(pid,(err)=>{ 
      if(!err)
      res.render("newpost",{result:''});
      console.log(err);

    })
  })

  app.get('/newpost', (req, res) => {                     // result starting me blank hai
    res.render("newpost",{result:''});
  })

  app.post('/new', (req, res) => {                        // form fill karne ki request
    console.log(req.body);

    const formdata = new Post({ title:req.body.title,imageurl:req.body.image,content:req.body.content});
    formdata.save((err)=>{
      if(!err)
      res.render("newpost",{result:'Record Saved'});
      else
      console.log('Error in code');
    });
    
  })

  app.post("/edit", (req,res)=>{

    let pid=req.body.pid;
    const formdata = ({ title:req.body.title,imageurl:req.body.image,content:req.body.content});

    Post.findByIdAndUpdate(pid,formdata,(err)=>{
    
      if(!err)
      {
        Post.findById(pid,(err,data)=>{
          if(!err)
          res.render("editpost",{post:data,result:'Record Updated'});

      })
    }
      else
      console.log('Error in code');
    })
  })

 app.listen(port,()=>{
     console.log(`Blog Site listening at http://localhost:${port}`)
 })

  
