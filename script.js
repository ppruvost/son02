// Liste des fréquences disponibles
const frequencies = [
    { name: "396 Hz", file: "song/396hz.mp3", freq: 396 },
    { name: "432 Hz", file: "song/432hz.mp3", freq: 432 },
    // Ajoute les autres fréquences ici
];

let currentAudio = null;
let chladniSketch = null;

// Initialisation de la liste des fréquences
function initFrequencyList() {
    const list = document.querySelector('.frequency-list');
    frequencies.forEach(freq => {
        const item = document.createElement('div');
        item.className = 'frequency-item';
        item.textContent = freq.name;
        item.addEventListener('click', () => playFrequency(freq));
        list.appendChild(item);
    });
}

// Lecture d'une fréquence
function playFrequency(freq) {
    if (currentAudio) {
        currentAudio.pause();
    }
    currentAudio = new Audio(freq.file);
    currentAudio.loop = false;
    currentAudio.play();
    updateChladni(freq.freq);
}

// Lecture de toute la playlist en boucle
function playAll() {
    if (currentAudio) {
        currentAudio.pause();
    }
    let index = 0;
    function playNext() {
        if (index >= frequencies.length) index = 0;
        const freq = frequencies[index];
        currentAudio = new Audio(freq.file);
        currentAudio.loop = false;
        currentAudio.play();
        updateChladni(freq.freq);
        currentAudio.onended = () => {
            index++;
            playNext();
        };
    }
    playNext();
}

// Mise à jour du motif de Chladni
function updateChladni(frequency) {
    if (chladniSketch) {
        chladniSketch.remove();
    }
    chladniSketch = new p5(sketch => {
        let img;
        sketch.setup = () => {
            let canvas = sketch.createCanvas(300, 300);
            canvas.parent('chladni-canvas');
            sketch.noLoop();
            img = sketch.createImage(300, 300);
            drawChladniPattern(sketch, img, frequency);
        };
        sketch.draw = () => {
            sketch.background(249, 247, 243);
            sketch.image(img, 0, 0);
        };
    });
}

// Dessin du motif de Chladni (simplifié pour l'exemple)
function drawChladniPattern(sketch, img, frequency) {
    img.loadPixels();
    const d = sketch.pixelDensity();
    const halfW = img.width / 2;
    const halfH = img.height / 2;
    const scale = 0.01 * frequency;

    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            const dx = (x - halfW) * scale;
            const dy = (y - halfH) * scale;
            const dSquared = dx * dx + dy * dy;
            const angle = sketch.atan2(dy, dx);
            const r = sketch.sqrt(dSquared);
            const val = sketch.sin(r * 10) * sketch.sin(angle * 8);
            const col = sketch.floor(sketch.map(val, -1, 1, 0, 255));
            const index = 4 * d * (y * img.width * d + x);
            img.pixels[index] = col;
            img.pixels[index + 1] = col;
            img.pixels[index + 2] = col;
            img.pixels[index + 3] = 255;
        }
    }
    img.updatePixels();
}

// Événements
document.getElementById('play-all').addEventListener('click', playAll);

// Initialisation
initFrequencyList();
