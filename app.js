const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer')
const dotenv = require('dotenv')
const axios = require('axios')
var cors = require('cors')

app.use(cors())

dotenv.config()
// Motor de plantilla
const hbs = require('hbs');

app.set('view engine', 'hbs');
app.set("views", __dirname + "/views");
hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.use(express.static(path.join(__dirname, "public")));

const storage=multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,path.join(__dirname,'/public/upload'));
    },
    filename:function(req,file,cb){
        cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }
    else{
        cb('Solo se puede subir imagenes a este servidor', false)
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter});

app.get("/inicio", (req, res) => {
    res.render("index", {
      layout: "layouts/main",
      title: "Inicio",
      message: "Bienvenidos a nuestra aplicación",
    });
})
  
app.get("/upload", (req, res)=>{
    res.render("upload-form", {
        layout: "layouts/main",
        title: "Carga de archivos",
        message: "Formulario de carga de archivos.",
    });
})

// Ruta para manejar la carga de archivos (POST)
app.post("/upload", upload.single("file"), (req, res) => {
    res.render("upload-success", {
        layout: "layouts/main",
        title: "Carga Exitosa",
      message: "Archivo cargado exitosamente",
      filename: req.file.filename,
    });
});

// app.get('movies/popular', async(req, res)=>{
//     try {
//         const response = await  axios.get('https://api.themoviedb.org/3/movie/popular',{
//             params:{
//                 api_key:process.env.asdas
//             }
//         })
//         const movies = reponse.data.result;
//         res.render('movies', {movies})
//     } catch (error) {
        
//     }
// })

app.get("/game_api", async (req, res)=>{
    try {
        const response = await axios.get('https://thronesapi.com/api/v2/Characters')
        const characters = response.data
        res.render('character', {
            layout: "layouts/main",
            characters
        })
    } catch (error) {
        console.error('Error en la api', error)
    }
})

app.get("/game_person/:id", async (req, res)=>{
    let id = req.params.id;
    console.log(id);
    try {
        const response = await axios.get(`https://thronesapi.com/api/v2/Characters/${id}`)
        const person = response.data
        console.log(person)
        res.render('person', {
            layout: "layouts/main",
            person
        })
    } catch (error) {
        console.error('Error en la api', error)
    }
})

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).render("error404", { title: "Página no encontrada" });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log('init')
})
