// import bibliotek
const http = require("http");
const app = require("./app");

// port
const PORT = process.env.PORT || 3000;

// serwer HTTP
const server = http.createServer(app);

// uruchomienie serwera
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
