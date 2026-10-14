// ============================================================
//  💕 Love Website Configuration — edit ONLY this file 💕
// ============================================================

const CONFIG = {
    // Her name (used all over the site)
    partnerName: "My Love",

    // Your name (used in the signature). Leave "" to hide.
    yourName: "",

    // ---------- 🎵 SONG ----------
    // Best way: put your song in this folder, name it  song.mp3
    // (any romantic song you want her to hear). It starts when she taps the envelope.
    music: "song.mp3",
    // Backup songs used only if song.mp3 is missing
    musicFallbacks: [
        "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3",
        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73c3a.mp3"
    ],

    // ---------- 📸 THE ONE PICTURE ----------
    // Put 1 picture in this folder and write its file name here (jpg / png / webp)
    photo: "photo.jpg",
    photoCaption: "my favorite person in the whole world 💕",

    // ---------- 📅 OPTIONAL: when did your love start? ----------
    // Format YYYY-MM-DD. Shows a live "loving you for ... days" counter. Leave "" to hide.
    startDate: "",

    // ---------- 💌 INTRO (the sealed envelope) ----------
    intro: {
        small: "a little surprise, made only for you",
        button: "Tap to open 💌"
    },

    // ---------- ✍️ MESSAGES ----------
    messages: {
        subtitle: "you light up my world in ways words can't express ✨",
        letterTitle: "To My Dearest Love",
        loveNote: "you are the sunshine in my darkest days and the stars in my night sky. Every moment with you feels like magic, and I fall in love with you more each day. You're not just my girlfriend, you're my best friend, my soulmate, and my everything. I love you beyond words! 💖",
        specialMessage: "You came into my life like a beautiful surprise, and now I can't imagine my world without you. Your smile brightens my darkest days, your laugh is my favorite melody, and your love is the greatest gift I've ever received.",
        specialMessage2: "Thank you for being you, for loving me, and for making every day feel like a celebration. I promise to love you, cherish you, and make you smile every single day of our lives together.",
        signature: "With all my love, Forever yours 💕"
    },

    // ---------- 💖 REASONS I LOVE YOU (tap a heart to flip it) ----------
    reasonsTitle: "Reasons I Love You",
    reasons: [
        "Your smile makes my whole day better",
        "Your voice is my favorite sound in the world",
        "You care so deeply about the people you love",
        "You are cute without even trying",
        "You make me want to be a better person",
        "Talking to you makes time disappear",
        "You are my peace and my happiness",
        "Because you are simply you"
    ],

    // Memory descriptions
    memories: {
        lateNight: "Those endless conversations that made us forget about time",
        firstMeeting: "I know the day we meet will be magical and unforgettable",
        care: "Your caring nature, sweet voice, and adorable cuteness"
    },

    // Character descriptions
    characters: {
        partner: "My beautiful angel",
        you: "Forever yours"
    },

    // Special messages for different kiss counts
    kissMessages: {
        10: "10 kisses! You're so sweet! 💕",
        50: "50 kisses! I'm falling deeper in love! 💖",
        100: "100 kisses! You're my everything! 💘"
    },

    // Messages when she taps a memory card
    memoryMessages: {
        lateNight: "Those late nights talking with you are my favorite memories 🌙✨",
        firstMeeting: "I know the day we meet will be magical and unforgettable 💫💕",
        care: "Your caring nature, sweet voice, and adorable cuteness melt my heart 💕😍"
    },

    // ---------- 🎆 THE FINAL SURPRISE ----------
    finale: {
        button: "One last surprise… 💝",
        big: "I love you",
        lines: [
            "Out of all the stars in the sky,",
            "my heart chose you.",
            "And it will choose you again,",
            "every single day. 💕"
        ],
        question: "Will you stay in my heart forever?",
        yes: "Yes, forever 💖",
        yesReply: "You just made me the happiest person alive 🥹💕 I love you, always.",
        // Sweet words that pop up in the sky during the fireworks
        popWords: ["forever 💕", "my everything", "you & me", "always you", "my home", "I choose you", "mine, always 💞", "my favorite person"],
        // Shown after the big show, above the Replay button
        endLine: "Forever isn't long enough with you. 💞"
    }
};

window.CONFIG = CONFIG;
