<?php
include("Connexion.php");
?>

<!Doctype html>
<html>
    <head>
       <meta charset = "UTF-8"/>
       <title>  Projet </title>
    </head>
    <body>
      <h1> GUESS THE CORRELATION </h1>
    <p>
         <label for="Pseudo"> S'il vous plaît, entrer un pseudo entre 2 et 20 caractère: </label>
                  <input type="text" id="Pseudo" name="Pseudo" value=""><br>
    <h3> Votre meilleur score </h3>
      <?php     
        $Pseudo = $_POST['Pseudo'];
        $Nb_point = $_POST['Nb_point'];
        connectMaBase();
        $strSQL ="INSERT INTO stockage (Pseudo,Nb_point) Values('".$Pseudo."','".$Nb_point."')";
        $strSQL ="DROP TABLE IF EXISTS classement";
        $strSQL ="CREATE TABLE classement as
                SELECT [ID] INT IDENTITY, A.Pseudo, A.Nb_point
                FROM stockage as A
                ORDER BY Nb_point ASC
                limit 20; 
               ";
               
        mysql_query($strSQL);
      ?>
  </body>
</html>
