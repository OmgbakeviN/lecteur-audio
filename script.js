// Sélection des éléments HTML
const uploadBtn = document.getElementById("upload-btn");
const audioElement = document.getElementById("audio-element");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");

// Variables globales
let audioFiles = [];
let currentTrackIndex = 0;


// Fonction pour passer au précédent
prevBtn.addEventListener("click", () => {
    if (audioFiles.length > 0) {
        currentTrackIndex =
            (currentTrackIndex - 1 + audioFiles.length) % audioFiles.length;
        audioElement.src = audioFiles[currentTrackIndex].url; // Utiliser l'URL de la piste
        audioElement.play();
        updatePlaylist(); // Mettre à jour l'apparence de la playlist
    } else {
        alert("Aucune piste dans la liste.");
    }
});

// Fonction pour passer au suivant
nextBtn.addEventListener("click", () => {
    if (audioFiles.length > 0) {
        currentTrackIndex = (currentTrackIndex + 1) % audioFiles.length;
        audioElement.src = audioFiles[currentTrackIndex].url; // Utiliser l'URL de la piste
        audioElement.play();
        updatePlaylist(); // Mettre à jour l'apparence de la playlist
    } else {
        alert("Aucune piste dans la liste.");
    }
});


const playlist = document.getElementById("playlist");

// Fonction pour charger plusieurs fichiers MP3
uploadBtn.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "audio/mp3";
    fileInput.multiple = true; // Permettre plusieurs fichiers

    fileInput.onchange = (event) => {
        const files = event.target.files;
        for (let file of files) {
            const fileURL = URL.createObjectURL(file);
            audioFiles.push({ name: file.name, url: fileURL });
        }
        updatePlaylist();
    };

    fileInput.click();
});

// Mettre à jour la liste de lecture
function updatePlaylist() {
    playlist.innerHTML = ""; // Vider l'ancienne playlist
    audioFiles.forEach((file, index) => {
        const li = document.createElement("li");
        li.textContent = file.name;
        li.addEventListener("click", () => playTrack(index));
        if (index === currentTrackIndex) {
            li.classList.add("active");
        }
        playlist.appendChild(li);
    });
}

// Jouer une piste à partir de la liste de lecture
function playTrack(index) {
    currentTrackIndex = index;
    audioElement.src = audioFiles[currentTrackIndex].url;
    audioElement.play();
    updatePlaylist();
}

// Mise à jour de la barre de progression
audioElement.addEventListener("timeupdate", () => {
    if (!isNaN(audioElement.duration)) {
        const progressPercent =
            (audioElement.currentTime / audioElement.duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }
});

// Passer automatiquement à la piste suivante après la fin
audioElement.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % audioFiles.length;
    playTrack(currentTrackIndex);
});

// Fonction pour jouer l'audio
playBtn.addEventListener("click", () => {
    if (audioFiles.length > 0) {
        if (!audioElement.src) {
            // Si aucune piste n'est sélectionnée, jouer la première par défaut
            currentTrackIndex = 0;
            audioElement.src = audioFiles[currentTrackIndex].url;
        }
        audioElement.play();
        togglePlayPauseButtons(true);
    } else {
        alert("Veuillez d'abord uploader un fichier MP3.");
    }
});


// Fonction pour mettre en pause l'audio
pauseBtn.addEventListener("click", () => {
    audioElement.pause();
    togglePlayPauseButtons(false);
});

// Fonction pour alterner la visibilité des boutons Play et Pause
function togglePlayPauseButtons(isPlaying) {
    if (isPlaying) {
        playBtn.style.display = "none";
        pauseBtn.style.display = "inline-block";
    } else {
        playBtn.style.display = "inline-block";
        pauseBtn.style.display = "none";
    }
}

// Mettre à jour les boutons quand l'audio se termine
audioElement.addEventListener("ended", () => {
    togglePlayPauseButtons(false);
});

function togglePlayPauseButtons(isPlaying) {
    if (isPlaying) {
        playBtn.style.display = "none";
        pauseBtn.style.display = "inline-block";
    } else {
        playBtn.style.display = "inline-block";
        pauseBtn.style.display = "none";
    }
}

//permettre de cliquer sur la barre pour la position de lecture
progressBar.addEventListener("click", (event) => {
    if (!audioElement.duration) return;// Si aucune piste n'est en cours de lecture, ne rien faire

    // Calculer la position cliquée sur la barre
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;

    // Calculer la nouvelle position en pourcentage
    const newTime = (clickX / width) * audioElement.duration;
    audioElement.currentTime = newTime;

    // Mettre à jour visuellement la barre de progression
    const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
    progress.style.width = `${progressPercent}%`;
});

// Mettre à jour le temps écoulé et le temps total
audioElement.addEventListener("timeupdate", () => {
    const currentTime = formatTime(audioElement.currentTime);
    const totalTime = formatTime(audioElement.duration);
    document.getElementById("current-time").textContent = currentTime;
    document.getElementById("total-time").textContent = totalTime || "0:00";
});

// Fonction pour formater le temps (secondes -> mm:ss)
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
