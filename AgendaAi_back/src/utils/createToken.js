import jwt from "jsonwebtoken"

function createToken(params = {}, expire) {
    return jwt.sign(params, process.env.SECRET_KEY, {expiresIn: expire})
}

export default createToken