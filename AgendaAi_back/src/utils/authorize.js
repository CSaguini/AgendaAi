export const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    const userRole = req.user.role
    if(!roles[userRole] || roles[userRole] !== requiredPermissions) {
      return res.status(403).json({
        message: 'Sem autorização'
      })
    }
  }
}