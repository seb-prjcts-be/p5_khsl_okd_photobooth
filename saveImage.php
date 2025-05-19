<?php
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data["image"])) {
    $image = $data["image"];
    $image = str_replace("data:image/png;base64,", "", $image);
    $image = str_replace(" ", "+", $image);
    $imageData = base64_decode($image);

    if (!file_exists("images")) {
        mkdir("images", 0777, true);
    }

    $filename = "images/" . uniqid() . ".png";
    file_put_contents($filename, $imageData);

    echo json_encode(["status" => "success", "file" => $filename]);
} else {
    echo json_encode(["status" => "error"]);
}
?>
