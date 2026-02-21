exports.checkPermission = (permissionCode) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.roleCode) {
      return res.status(403).json({ message: 'No role assigned' });
    }

    const permissions = user.roleCode.permissions || [];

    const hasPermission = permissions.some((p) => p.code === permissionCode);

    if (!hasPermission) {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission',
      });
    }

    next();
  };
};
