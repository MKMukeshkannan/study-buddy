function async_middleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (err) {
            next(err);
        }
    };
}
export default async_middleware;
//# sourceMappingURL=AsyncMiddleware.js.map