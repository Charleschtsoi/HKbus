// Optional. Copy from config.example.js to enable Firebase cloud sync.
// Guest mode and on-device accounts work without this file.
window.HK_BUS_CONFIG = window.HK_BUS_CONFIG || {
  auth: {
    cloudSync: false,
    firebase: {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
    },
  },
};
