let bg;
let logo;
let full_logo_zwart;
let full_logo_wit;
let type;
let factor = 2;
let v;
let title01 = "OPENKUNST";
let title02 = "DAG";
let wanneer = "22 MAART 2025";
let adres01 = "OUDE HOUTLEI 44";
let adres02 = "9000 GENT";
let colors = [
  "#61B199", "#C0CE68",  "#FBBF2E", "#F89A3C",
  "#F3722E", "#EF4424", "#ED1C26", "#E92B59", "#E23D96",
  "#BF428A", "#9F4A81", "#69619B", "#367BB7", "#0091D1"
];
//"#F0E933",
let picker01;
let picker02;
let photoTaken = false;
let tempImage;
let preview = false;

function preload() {
  bg = loadImage("start_interactie.png");
  full_logo_zwart = loadImage("images_system/logo_zwart.png");
  full_logo_wit = loadImage("images_system/logo_wit.png");
  type = loadFont("UniversRegular.ttf");
}

function setup() {
  let canvas = createCanvas(565,  800, P2D, {
    willReadFrequently: true
  });
  canvas.parent("left");

  bg.resize(565,  800);
  picker01 = random(colors);
  do {
    picker02 = random(colors);
  } while (picker02 === picker01);
  
  // Kies willekeurig tussen het zwarte en witte logo
  logo = random([full_logo_zwart, full_logo_wit]);

  let constraints = { video: true };
  v = createCapture(constraints);
  v.hide();

  v.elt.onloadeddata = function () {
    console.log("Camera is geladen!");
  };
}

function draw() {
  background(255);

  let videoY = 63; 

  if (!photoTaken) {
    let videoRatio = v.width / v.height;
    let canvasRatio = width / height;

    let w, h;
    if (videoRatio > canvasRatio) {
      w = width;
      h = width / videoRatio;
    } else {
      h = height - videoY; 
      w = h * videoRatio;
    }

    let x = (width - w) / 2;
    let y = videoY; 

    image(v, x, y, w, h);
    filter(GRAY);
  } else {
    image(tempImage, 0, 0, width, height);
  }

  generate_bg();
}

function keyPressed() {
  if (keyCode === 32 && !photoTaken) {
    takePhoto();
  }
}

function retryPhoto() { //voor de foto
  photoTaken = false;
  document.getElementById("takePhotoBtn").style.display = "inline";
  document.getElementById("statusMessage").innerText = "Klaar om een foto te maken";
  document.getElementById("retryBtn").style.display = "none";
  document.getElementById("saveBtn").style.display = "none";
  document.getElementById("remixBtn").style.display = "none";
  document.getElementById("shareBtn").style.display = "none"; // Knop verbergen
}

function takePhoto() { //na het nemen van de foto, opslaan of niet.
  photoTaken = true;
  tempImage = get();

  document.getElementById("statusMessage").innerText = "Foto genomen!";
  document.getElementById("retryBtn").style.display = "inline";
  document.getElementById("saveBtn").style.display = "inline";
  document.getElementById("takePhotoBtn").style.display = "none";
  document.getElementById("remixBtn").style.display = "none";
  document.getElementById("shareBtn").style.display = "none"; // Knop tonen
}

function saveImage() {
  let imageData = canvas.toDataURL("image/png");

  fetch("saveImage.php", {
    method: "POST",
    body: JSON.stringify({ image: imageData }),
    headers: { "Content-Type": "application/json" }
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        updateGallery();
        retryPhoto();
      }
    })
    .catch(error => console.error("Error:", error));
}

function updateGallery() {
  fetch("gallery.php")
    .then(response => response.text())
    .then(data => {
      document.getElementById("gallery").innerHTML = data;
    });
}

function shareByEmail() {
  const email = prompt("Voer het e-mailadres in waar je de foto naar wilt sturen:");
  
  if (!email) {
    return; // User cancelled
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Voer een geldig e-mailadres in.");
    return;
  }

  const imgSrc = document.getElementById("largeImg").src;
  const imageUrl = imgSrc.split("/").pop(); // Get just the filename

  // Show loading message
  const statusMessage = document.getElementById("statusMessage");
  const originalMessage = statusMessage.innerText;
  statusMessage.innerText = "E-mail wordt verzonden...";

  fetch('sendEmail.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      imageUrl: imageUrl
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      alert("De foto is succesvol verzonden naar " + email);
    } else {
      alert("Er is een fout opgetreden bij het verzenden: " + data.message);
    }
    statusMessage.innerText = originalMessage;
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Er is een fout opgetreden bij het verzenden van de e-mail.");
    statusMessage.innerText = originalMessage;
  });
}

function downloadImage() {
  const imgSrc = document.getElementById("largeImg").src;
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = imgSrc;
  link.download = 'OKD4_foto.png'; // Set the download filename
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function remixBg() {
  picker01 = random(colors);
  do {
    picker02 = random(colors);
  } while (picker02 === picker01);
  logo = random([full_logo_zwart, full_logo_wit]);
  generate_bg();
}

function generate_bg()
{
//----------------------------------------------
//Kleurvlakken
//----------------------------------------------

//OPENKUNST en DAG
  
  fill(picker01);
  rect(0,0,width,63);
  rect(width-170,60,width,62);

//----------------------------------------------
//LOGO groot
//----------------------------------------------

image(logo, 0, height - 380, width, logo.height / factor);


   
//naast OPENKUNST
  let checkSize = 20;
  let stretchFactor = 1.4;
  let startX = width - (checkSize * 4 * stretchFactor);
  let startY = 0;
  let rows = 3;
  let cols = 4;

  fill(picker01);  
  rect(startX, startY, checkSize * cols * stretchFactor, checkSize * rows);
  fill(picker02);  
  rect(startX, startY, checkSize * 2 * stretchFactor, checkSize);
  rect(startX + (checkSize * 3 * stretchFactor), startY, checkSize * stretchFactor, checkSize);
  rect(startX + (checkSize * 2 * stretchFactor), startY + checkSize, checkSize * stretchFactor, checkSize);
  rect(startX, startY + (checkSize * 2), checkSize * 2 * stretchFactor, checkSize);
  rect(startX + (checkSize * 3 * stretchFactor), startY + (checkSize * 2), checkSize * stretchFactor, checkSize);

  //adres
  fill(picker02);
 
  rect(260, 590, 320, 30); //boven
  rect(260, 620, 150, 30); //onder

  //datum
  fill(picker01);
  rect(0,648,540,62);

  //wij waren er ook!
  fill(picker02);
  rect(0, 710, 800, 300);
  



//----------------------------------------------
//teksten typografie
//----------------------------------------------

  noStroke();
  fill(255);
  textFont(type);

  //titel
  textSize(70);
  text(title01,2,56);
  text(title02,width-170,113);
  
  //adres
  textSize(24);
  text(adres01, 270, 614);
  text(adres02, 270, 638);
  
  //datum
  textSize(70);
  text(wanneer,6,704);
  
  //tijd
  textSize(48);
  text('Wij waren er ook!', 100, 760);


print(700);

  
  // // Website
  // fill(255, 237, 0);
  // rect(20, 940, 300, 40);
  // fill(0);
  // textSize(24);
  // text('LUCASGENT.BE', 30, 968);
  
  // // Contact info
  // textSize(16);
  // text('INFO', 20, 1000);
  // text('MAIL', 20, 1030);
  // text('TEL', 20, 1060);
  
  // text('secretariaat@lucasgent.be', 180, 1030);
  // text('09/224.08.76', 180, 1060);
  
  // // Social media
  // text('IG/TT', 400, 1030);
  // text('FB', 400, 1060);
  
  // text('@kunsthumaniorasintlucasgent', 480, 1030);
  // text('@kunsthumaniora.sintlucas', 480, 1060);
}


function showImage(src) {
  let img = document.getElementById("largeImg");
  preview=true;
  if (preview) {
      img.src = src;
      document.getElementById("statusMessage").innerText = "Klik om te sluiten!";
      document.getElementById("fullImage").style.display = "flex";
      document.getElementById("shareBtn").style.display = "inline"; // Knop tonen
      document.getElementById("remixBtn").style.display = "none"; // Knop niet tonen
  } 
}