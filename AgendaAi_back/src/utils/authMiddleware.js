/*export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
      return res.status(401).json({ error: "Token não fornecido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado" });

    req.user = user; // 🔥 importante
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
};*/
