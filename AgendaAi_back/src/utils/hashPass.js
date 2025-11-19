import * as bcrypt from "bcrypt"

export function hashPass(pass) {
  const salt = 10

  const hash = bcrypt.hash(pass, salt)
  return hash
}