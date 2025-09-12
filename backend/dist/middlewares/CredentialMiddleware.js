const allowedOrgins = [
    "domain.com",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:6969",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:6969",
];
export const corsOptions = {
    // origin(requestOrigin, callback) {
    //   if (!requestOrigin || allowedOrgins.indexOf(requestOrigin) !== -1) {
    //     callback(null, requestOrigin);
    //   } else {
    //     callback(new Error("Not allowed by CORS"));
    //   }
    // },
    origin: allowedOrgins,
    optionsSuccessStatus: 200,
};
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrgins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    next();
};
export default credentials;
//# sourceMappingURL=CredentialMiddleware.js.map