<?php
function connectMaBase(){
    $idcon = mysql_connect ('localhost', 'root', '');  
    $total = mysql_select_db ('correlation', $idcon) ;
    echo $total;
}
?>
