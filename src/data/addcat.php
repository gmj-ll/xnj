<?php
$Temperature=$_GET["Temperature"];
$Humidity=$_GET["Humidity"];

// 创建连接
$conn = mysqli_connect('47.111.177.25', 'root', 'xjf');
// 检测连接
if ($conn) {

if (mysqli_select_db($conn, 'xnj'))
{
    $sql = "INSERT INTO wsd(Temperature, Humidity) VALUES ('$Temperature','$Humidity')";
 
    if (mysqli_query($conn, $sql)) {
        echo "新记录插入成功";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

}
}
else{
    die("Connection failed: " . mysqli_connect_error());
}


$conn->close();



?>