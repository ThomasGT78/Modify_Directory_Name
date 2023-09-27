/*
ServeurHTTP1.js
Exécution du script à la console : 
cd C:\Dev_Projets\Mini_Projets\Modify_File_Name
node Controller_Modify_File_Name
=> A taper dans la barre d’URL de votre navigateur: http://localhost:8081/
*/

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

const hostname = '127.0.0.1';
const port = 8082;


// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')


/**
 * Root GET /
 * 
 */
app.get('/', function (req, res) {
    var title = "Modify_File_Name";
    
    let file_path = req.query.file_path;	// Stock the path of the folder
    let contains_text = req.query.contains_text;	// Stock the text that must be contained in file names
    let text_to_remove = req.query.text_to_remove;	// Stock the text to replace
    let modify_with = req.query.modify_with;	// Stock the replacement text
    
    if (!contains_text){ // Check if the file name contains the text to replace
        // empty => use text_to_remove value
        contains_text = text_to_remove;
    }
    
    if (file_path){
        // Read the files existing in the folder choosen
        fs.readdir(file_path, (err, files) => {
            // Iterate through the file list from the folder
            files.forEach(name => {
                // Select the files including the text to remove
                if (name.includes(contains_text) && name.includes(text_to_remove)){
                    // recreate the full path of each file
                    let current_path = file_path + "\\" + name // « \\ » is to write only « \ » but you need to escape the character
                    
                    new_name = name.replace(text_to_remove, modify_with)
                    let new_path = file_path + "\\" + new_name
                    fs.rename(current_path, new_path, function(err) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(name + ": Successfully renamed as => " + new_name);
                        }
                    }) // fs.rename
                } // end if
            }) // END files.forEach

        }) // fs.readdir
    } // end if file_path
    

    res.setHeader('Content-Type', 'text/html; charset=utf-8'); // Set content type header
    res.render('Modify_File_Name.ejs', {title: title}); // Render the view
});



/*****************************************************************************************************
********                        Page d'erreur si problème de connexion                        ********
*****************************************************************************************************/
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(404).send('Page introuvable !');
});

/*****************************************************************************************************
********                            Connexion au port du serveur                               ********
*****************************************************************************************************/
app.listen(port);
console.log("Le serveur tourne sur http://localhost:8082");