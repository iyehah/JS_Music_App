document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const playlistElement = document.getElementById('playlist');
    const openFolderButton = document.getElementById('open-folder');
    const volumeSlider = document.getElementById('volume');
    const muteUnmuteButton = document.getElementById('mute-unmute');
    const progressSlider = document.getElementById('progress');

    let songs = [];
    let currentSongIndex = 0;

    async function openMusicFolder() {
        try {
            const directoryHandle = await window.showDirectoryPicker();
            for await (const entry of directoryHandle.values()) {
                if (entry.kind === 'file' && entry.name.endsWith('.mp3')) {
                    const file = await entry.getFile();
                    songs.push({ title: file.name, file });
                }
            }
            updatePlaylist();
            loadSong(currentSongIndex);
        } catch (error) {
            console.error('Error accessing folder:', error);
        }
    }

    function loadSong(index) {
        const file = songs[index].file;
        const fileURL = URL.createObjectURL(file);
        audioSource.src = fileURL;
        audioPlayer.load();
    }

    function playPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        }
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        playPause();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        playPause();
    }

    function updatePlaylist() {
        playlistElement.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = song.title;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playPause();
            });
            playlistElement.appendChild(li);
        });
    }

    function setVolume() {
        audioPlayer.volume = volumeSlider.value;
    }

    function muteUnmute() {
        if (audioPlayer.muted) {
            audioPlayer.muted = false;
            muteUnmuteButton.textContent = 'Mute';
        } else {
            audioPlayer.muted = true;
            muteUnmuteButton.textContent = 'Unmute';
        }
    }

    function updateProgress() {
        progressSlider.max = audioPlayer.duration;
        progressSlider.value = audioPlayer.currentTime;
    }

    function setProgress() {
        audioPlayer.currentTime = progressSlider.value;
    }

    playPauseButton.addEventListener('click', playPause);
    prevButton.addEventListener('click', prevSong);
    nextButton.addEventListener('click', nextSong);
    openFolderButton.addEventListener('click', openMusicFolder);
    volumeSlider.addEventListener('input', setVolume);
    muteUnmuteButton.addEventListener('click', muteUnmute);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    progressSlider.addEventListener('input', setProgress);

    // Initialize with an empty playlist
    updatePlaylist();
});