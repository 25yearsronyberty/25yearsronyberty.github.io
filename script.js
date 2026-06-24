// ======================
// GUEST NAME — URL & INVITED SECTION
// ======================
const params = new URLSearchParams(window.location.search);
const guest = params.get("to");

if (guest) {
    // Cover greeting (sudah ada)
    document.getElementById("guestGreeting").style.display = "block";
    document.getElementById("guestName").textContent = guest;

    // Invited section
    const invitedName = document.getElementById("invitedName");
    invitedName.textContent = guest;
    invitedName.classList.add("has-guest");

    document.getElementById("invitedNote").textContent =
        "Kehadiran " + guest + " akan menjadi kebahagiaan tersendiri bagi kami " +
        "di momen yang sangat berarti ini.";
} else {
    // Fallback jika tidak ada ?to= di URL
    document.getElementById("invitedName").textContent = "Tamu Undangan Kami";
    document.getElementById("invitedNote").textContent =
        "Kami dengan penuh kebahagiaan mengundang Anda untuk turut merayakan " +
        "momen istimewa bersama kami.";
}

// ======================
// OPEN INVITATION
// ======================
function openInvitation() {
    document.getElementById("cover").style.display = "none";

    const invitation = document.getElementById("invitation");
    invitation.classList.remove("hidden");

    const music = document.getElementById("bgMusic");

    music.play().catch(() => {
        console.log("Autoplay diblok browser");
    });

    startCountdown();
}

// ======================
// MUSIC CONTROL
// ======================
function toggleMusic() {
    const music = document.getElementById("bgMusic");
    const icon = document.getElementById("musicIcon");
    const waves = document.getElementById("musicWaves");

    if (music.paused) {
        music.play();
        icon.textContent = "♪";
        waves.style.opacity = "1";
    } else {
        music.pause();
        icon.textContent = "🔇";
        waves.style.opacity = "0.3";
    }
}

// ======================
// COUNTDOWN
// ======================
function startCountdown() {

    // GANTI TANGGAL ACARA
    const target = new Date("July 19, 2026 18:00:00").getTime();

    const timer = setInterval(() => {

        const now = new Date().getTime();
        const distance = target - now;

        if (distance < 0) {
            clearInterval(timer);

            document.getElementById("cdDays").textContent = "00";
            document.getElementById("cdHours").textContent = "00";
            document.getElementById("cdMins").textContent = "00";
            document.getElementById("cdSecs").textContent = "00";

            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const mins = Math.floor(
            (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const secs = Math.floor(
            (distance % (1000 * 60)) /
            1000
        );

        document.getElementById("cdDays").textContent =
            String(days).padStart(2, "0");

        document.getElementById("cdHours").textContent =
            String(hours).padStart(2, "0");

        document.getElementById("cdMins").textContent =
            String(mins).padStart(2, "0");

        document.getElementById("cdSecs").textContent =
            String(secs).padStart(2, "0");

    }, 1000);
}

// ======================
// LIGHTBOX
// ======================
const galleryImages = [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200",
    "https://images.unsplash.com/photo-1529682316-7b85f8b02e1e?w=1200",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200"
];

let currentImage = 0;

function openLightbox(index) {
    currentImage = index;

    document.getElementById("lightbox").style.display = "flex";
    document.getElementById("lightboxImg").src =
        galleryImages[currentImage];
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

function changeLightbox(direction) {

    currentImage += direction;

    if (currentImage < 0) {
        currentImage = galleryImages.length - 1;
    }

    if (currentImage >= galleryImages.length) {
        currentImage = 0;
    }

    document.getElementById("lightboxImg").src =
        galleryImages[currentImage];
}

// ======================
// FORM UCAPAN
// ======================
async function submitWish(event) {
    event.preventDefault();

    const pesan = document.getElementById("wishMsg").value;
    const tamu = guest || "Tamu Tanpa Nama";

    try {
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbzVFigv_qaq0nHSerxrM4FaPXXz8HVSShkKGc26y7Wz9K37WfGeVNrfV_YGwwTfQaZq/exec",
            {
                method: "POST",
                body: JSON.stringify({ tamu: tamu, pesan: pesan })
            }
        );

        const result = await response.json();

        if (result.success) {
            const container = document.getElementById("wishesContainer");
            const card = document.createElement("div");
            card.className = "wish-card";
            card.innerHTML = `
                <p class="wish-name">${tamu}</p>
                <p class="wish-text">${pesan}</p>
                <p class="wish-time">Baru saja</p>
            `;
            container.prepend(card);

            document.getElementById("wishForm").reset();
            document.getElementById("wishSuccess").classList.remove("hidden");

            setTimeout(() => {
                document.getElementById("wishSuccess").classList.add("hidden");
            }, 3000);
        }

    } catch (err) {
        console.error(err);
        alert("Gagal mengirim ucapan");
    }
}

async function loadWishes() {
    try {
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbzVFigv_qaq0nHSerxrM4FaPXXz8HVSShkKGc26y7Wz9K37WfGeVNrfV_YGwwTfQaZq/exec"
        );

        const wishes = await response.json();
        const container = document.getElementById("wishesContainer");
        const LIMIT = 5;
        let showing = LIMIT;

        function renderCards() {
            container.innerHTML = "";
            wishes.reverse().slice(0, showing).forEach(item => {
                const card = document.createElement("div");
                card.className = "wish-card";
                card.innerHTML = `
                    <p class="wish-name">${item.tamu}</p>
                    <p class="wish-text">${item.pesan}</p>
                    <p class="wish-time">${timeAgo(item.waktu)}</p>
                `;
                container.appendChild(card);
            });

            // Tombol load more
            if (showing < wishes.length) {
                const btn = document.createElement("button");
                btn.textContent = `Lihat lebih banyak (${wishes.length - showing} lainnya)`;
                btn.style.cssText = `
                    display: block;
                    margin: 1rem auto 0;
                    padding: 0.6rem 1.5rem;
                    background: transparent;
                    border: 1px solid rgba(168,184,200,0.3);
                    border-radius: 2rem;
                    color: var(--gold2);
                    font-family: var(--ff-body);
                    font-size: 0.8rem;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: var(--transition);
                `;
                btn.onmouseenter = () => btn.style.background = "rgba(255,255,255,0.06)";
                btn.onmouseleave = () => btn.style.background = "transparent";
                btn.onclick = () => {
                    showing += LIMIT;
                    renderCards();
                };
                container.appendChild(btn);
            }
        }

        renderCards();

    } catch (err) {
        console.error(err);
    }
}

// ======================
// COVER PARTICLES
// ======================
const particles = document.getElementById("particles");

if (particles) {
    for (let i = 0; i < 40; i++) {
        const p = document.createElement("span");

        const size = 3 + Math.random() * 5;
        const duration = 3 + Math.random() * 5;
        const delay = Math.random() * -6;
        const animType = Math.random() > 0.5 ? "float" : "drift";

        p.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.8);
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      box-shadow: 0 0 ${size * 2}px rgba(255,255,255,0.5);
      animation: ${animType} ${duration}s ${delay}s ease-in-out infinite;
      will-change: transform, opacity;
    `;

        particles.appendChild(p);
    }
}

// ======================
// TIME AGO
// ======================
function timeAgo(dateStr) {
    const now = new Date();
    const past = new Date(dateStr);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "Baru saja";
    if (diff < 3600) {
        const m = Math.floor(diff / 60);
        return `${m} menit yang lalu`;
    }
    if (diff < 86400) {
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        return m > 0 ? `${h} jam ${m} menit yang lalu` : `${h} jam yang lalu`;
    }
    if (diff < 2592000) {
        const d = Math.floor(diff / 86400);
        return `${d} hari yang lalu`;
    }
    const months = Math.floor(diff / 2592000);
    return `${months} bulan yang lalu`;
}

loadWishes();