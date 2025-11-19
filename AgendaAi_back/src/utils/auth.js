import jwt from "jsonwebtoken";
async function auth(req, res, next) {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        try{
            jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
                if (error) {
                    return res.status(403).json({error: "Token invalid"})
                }
                req.isAuthenticated = true
                req.userId = decoded.id
                res.setHeader('Content-Type', 'application/json')
                return next()
            })

        } catch (error) {
            return res.status(401).send(error)
        }
    } else{
        res.setHeader('Content-Type', 'application/json')
        return res.status(403).json({ message: 'Missing Token'})
    }

}

export default auth