// Arquivo de configuração para uploads

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, __dirname + '/../public/images'), //destino de onde vai ser salvo
    filename: (req, file, callback) => callback(null, file.fieldname + '-' + Date.now() + '.jpg' ) // nome do arquivo como sera salvo
});

const upload = multer({ storage });

module.exports = upload;