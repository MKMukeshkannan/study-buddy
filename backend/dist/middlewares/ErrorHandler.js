export default function error_handler(err, _req, res, _next) {
    return res.status(500).json({
        message: "Something Wrong with the server",
        error: err,
    });
}
//# sourceMappingURL=ErrorHandler.js.map