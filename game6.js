var canvas, canvasContext; // Vászon és kontextus
var enemyX, // Ellenség X poz.
    enemyY, // Ellenség Y poz.
    enemyW = 20, // Ellenség szél.
    enemyH = 20, // Ellenség mag.
    enemySpeedX = 0, // Ellenség X seb.
    enemySpeedY = 0; // Ellenség Y seb.
var playerX = 640, // Játékos X poz.
    playerY = 370, // Játékos Y poz.
    playerW = 20, // Játékos szél.
    playerH = 20, // Játékos mag.
    playerSpeedX = 0, // Játékos X seb.
    playerSpeedY = 0; // Játékos Y seb.
var mouseX = 0, // Egér X poz.
    mouseY = 0; // Egér Y poz.
var bullets = []; // Lövedékek tömbje
var bulletSpeed = 2; // Lövedék seb.
var bulletY = 0, // Lövedék Y poz.
    bulletX = 0; // Lövedék X poz.
var KEY_W = 87, // W
    KEY_A = 65, // A
    KEY_S = 83, // S
    KEY_D = 68; // D
var keyHeld_Down = false, // Lefelé lenyomva
    keyHeld_Up = false, // Felfelé lenyomva
    keyHeld_Left = false, // Balra lenyomva
    keyHeld_Right = false, // Jobbra lenyomva
    keyHeld_Shoot = false; // Lövés lenyomva
var canShoot = true; // Lövés engedélyezése
var score = 0; // Pontszám

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 60; // Fps
    // Időzítő
    setInterval(function() {
        moveEverything(); // Mozgás frissítése
        drawEverything(); // Rajzolás frissítése
    }, 1000 / framesPerSecond);
    // Egér és billentyű eseménykezelők hozzáadása
    canvas.addEventListener('mousemove', updateMousePos);
    canvas.addEventListener('mousedown', mousePressed);
    canvas.addEventListener('mouseup', mouseReleased);
    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);

    // Enemy véletlen spawnolása
    enemyX = Math.random() * (canvas.width - enemyW);
    enemyY = Math.random() * (canvas.height - enemyH);
}
function updateMousePos(evt) {
    // Egér pozíció frissítése
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
}
function mousePressed(evt) {
    shootBullet(); // Lövés egérkattintásra
}
function mouseReleased(evt) {
    keyHeld_Shoot = false; // Lövés billentyű felengedése
    canShoot = true; // Lövés engedélyezése
}
function shootBullet() {
    // Lövedék létrehozása és hozzáadása a tömbhöz
    var bullet = {
        x: playerX,
        y: playerY,
        size: 5,
        vx: (mouseX - playerX) / 25,
        vy: (mouseY - playerY) / 25
    };
    bullets.push(bullet);
}
function keyPressed(evt) {
    // Billentyű lenyomás kezelése
    if (evt.keyCode == KEY_A) keyHeld_Left = true;
    if (evt.keyCode == KEY_D) keyHeld_Right = true;
    if (evt.keyCode == KEY_W) keyHeld_Up = true;
    if (evt.keyCode == KEY_S) keyHeld_Down = true;
}
function keyReleased(evt) {
    // Billentyű felengedés kezelése
    if (evt.keyCode == KEY_A) {
        keyHeld_Left = false;
        playerSpeedX = 0;
    }
    if (evt.keyCode == KEY_D) {
        keyHeld_Right = false;
        playerSpeedX = 0;
    }
    if (evt.keyCode == KEY_W) {
        keyHeld_Up = false;
        playerSpeedY = 0;
    }
    if (evt.keyCode == KEY_S) {
        keyHeld_Down = false;
        playerSpeedY = 0;
    }
}
function moveEverything() {
    // Játékos, ellenség mozgatása
    playerX += playerSpeedX;
    playerY += playerSpeedY;
    // Ellenség mozgása és eltűnése 
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        // Ellenség eltalálása lövedékkel
        if (bullet.x >= enemyX && bullet.x <= enemyX + enemyW && bullet.y >= enemyY && bullet.y <= enemyY + enemyH) {
            enemyX = Math.random() * (canvas.width - enemyW); // Új helyre helyezés
            enemyY = Math.random() * (canvas.height - enemyH);
            bullets.splice(i, 1); // Lövedék törlése
            score++; // Pontszám növelése
        }
    }
    // Játékos mozgásának irányítása és határok ellenőrzése
    if (keyHeld_Up) playerSpeedY = -7;
    if (keyHeld_Down) playerSpeedY = 7;
    if (keyHeld_Left) playerSpeedX = -7;
    if (keyHeld_Right) playerSpeedX = 7;
    if (playerX >= canvas.width - playerW) playerX = canvas.width - playerW;
    if (playerX <= 0) playerX = 0;
    if (playerY <= 0) playerY = 0;
    if (playerY >= canvas.height - playerH) playerY = canvas.height - playerH;

    // Lövedékek mozgatása és határok ellenőrzése
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
    }
    bullets = bullets.filter(function(bullet) {
        return bullet.x >= 0 && bullet.x <= canvas.width && bullet.y >= 0 && bullet.y <= canvas.height;
    });
    var dx = playerX - enemyX; // játékos és ellenség közötti x távolság
    var dy = playerY - enemyY; // játékos és ellenség közötti y távolság
    var distance = Math.sqrt(dx * dx + dy * dy);
    var speed = 4; // Ellenség sebessége
    var velocityX = (dx / distance) * speed;
    var velocityY = (dy / distance) * speed;
    enemyX += velocityX; // friss. ellenség x poz.
    enemyY += velocityY; // friss. ellenség y poz.

    if (distance < playerW && distance < playerH) { // ha az enemy hozzáér a playerhez
        enemyX = Math.random() * (canvas.width - enemyW); // Új helyre helyezés
        enemyY = Math.random() * (canvas.height - enemyH);
        score = 0;
    }
}
function drawEverything() {
    // Vászon kitöltése
    canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    // Játékos 
    canvasContext.fillStyle = 'blue';
        canvasContext.fillRect(playerX, playerY, playerW, playerH);
    // Ellenség 
    canvasContext.fillStyle = 'red';
        canvasContext.fillRect(enemyX, enemyY, enemyW, enemyH);
    // Lövedékek 
    canvasContext.fillStyle = 'white';
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        canvasContext.fillRect(bullet.x - bullet.size / 2, bullet.y - bullet.size / 2, bullet.size, bullet.size);
    }
    // Pontszám kijelzése
    canvasContext.fillStyle = 'white';
        canvasContext.fillText("Pontszám: " + score, canvas.width - 75, 20);
    // Szöveg
    canvasContext.fillStyle = 'grey';
        canvasContext.fillText("Irányítás: W-A-S-D", 10, canvas.height - 10);
        canvasContext.fillText("Lövés és célzás: Egér", 10, canvas.height - 30);
        canvasContext.fillText("Varga Dávid", 1215, canvas.height - 27);
        canvasContext.fillText("Bulyáki Máté", 1213, canvas.height - 10);
    // Egérkurzor rajzolása (fehér pont)
    canvasContext.fillStyle = 'white';
        canvasContext.fillRect(mouseX - 1, mouseY - 1, 4, 4);
}
