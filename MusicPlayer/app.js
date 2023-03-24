const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MEDIA_PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumbnail = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Aloha',
            singer: "Audition",
            path: './music/aloha.mp3',
            image: './img/aloha.png',
        },
        {
            name: '10 Minutes',
            singer: "Lee Hyori",
            path: './music/10-Minutes-Lee-Hyori.mp3',
            image: './img/aloha.png',
        },
        {
            name: 'Anh tin mình đã cho nhau kỷ niệm',
            singer: "Thu Thủy - Lương Bằng Quang",
            path: './music/AnhTinMinhDaChoNhauMotKyNiem.mp3',
            image: './img/aloha.png',
        },
        {
            name: 'Imma Heartbreaker',
            singer: "JustaTee - Emily - LK",
            path: './music/Imma-Heartbreaker.mp3',
            image: './img/aloha.png',
        },
        {
            name: 'Sorry',
            singer: "Bảo Thy",
            path: './music/Sorry-Bao-Thy.mp3',
            image: './img/aloha.png',
        },
        {
            name: 'Khóc',
            singer: "Đông Nhi",
            path: './music/Khoc-Dong-Nhi.mp3',
            image: './img/aloha.png',
        },
        {
            name: 'Tìm đâu',
            singer: "Bảo Thy",
            path: './music/Tim-Dau-Bao-Thy.mp3',
            image: './img/aloha.png',
        },
        {
            name: 'Vội vàng',
            singer: "Khổng Tú Quỳnh",
            path: './music/Voi-Vang-Khong-Tu-Quynh.mp3',
            image: './img/aloha.png',
        },
        {
            name: 'Vụt mất',
            singer: "Wanbi Tuấn Anh",
            path: './music/Vut-Mat-Wanbi-Tuan-Anh.mp3',
            image: './img/aloha.png',
        },
        {
            name: 'Yêu dấu theo gió bay',
            singer: "Hiền Thục",
            path: './music/Yeu-Dau-Theo-Gio-Bay-Hien-Thuc.mp3',
            image: './img/aloha.png',
        },
    ],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        /* Option 2:
        Object.assign(this, this.config);
        */
        //Hien thi trang thai dau cua button repeat va random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
              <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              </div>
            `;
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xu ly CD quay va dung
        const cdThumbAnimate = cdThumbnail.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //xu ly phong to, thu nho CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //xu ly khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //khi song duoc play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //khi bam nut pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //Xu ly khi tua bai hai
        progress.onchange = function (e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        //Khi next bai hat
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Khi bam prev bai hat
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //click random button
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //xu ly lap 1 bai hat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //Xu ly next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                if (_this.isRandom) {
                    _this.randomSong();
                } else {
                    _this.nextSong();
                }
            }
            audio.play();
        }

        //click vao 1 bat hat de nghe
        playlist.onclick = function (e) {
            let songActive = e.target.closest('.song:not(.active)');
            let songOption = e.target.closest('.option');
            if (e.target.closest('.song:not(.active)') || !e.target.closest('.option')) {
                if (songActive) {
                    _this.currentIndex = Number(songActive.dataset.index);
                    /* option 2:
                    _this.currentIndex2 = songActive.getAttribute('data-index');
                    */
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                if (songOption) {
                    console.log(songOption);
                }
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumbnail.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        console.log(this.currentIndex);
        this.loadCurrentSong();
    },
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    },
    start: function () {
        //Gan cau hinh tu config vao ung dung
        this.loadConfig();
        //Dinh nghia cac thuoc tinh cho object
        this.defineProperties();
        //lang nghe/xu ly cac su kien (DOM events)
        this.handleEvents();
        //Tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong();
        //Render playlist
        this.render();
    }
};
app.start();