<?php
$files = array_reverse(glob("images/*.png"));
if (count($files) > 0) {
    foreach ($files as $file) {
        echo "<a href='#' onclick='showImage(\"$file\")'>
                <img src='$file' class='thumbnail'>
              </a>";
    }
} else {
    echo "<p>Geen foto's beschikbaar.</p>";
}
?>
<script>
showImage(src);
</script>
