exports.checkPermission = (permissionCode) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.roleCode) {
      return res.status(403).json({ message: 'No role assigned' });
    }

    const role = user.roleCode; // đã populate
    console.log('ROLE:', req.user.roleCode);

    if (!role.permissions || role.permissions.length === 0) {
      return res.status(403).json({ message: 'No permissions found' });
    }

    const hasPermission = role.permissions.some(
      (p) => p.code === permissionCode
    );

    console.log('HAS PERMISSION:', hasPermission);

    if (!hasPermission) {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission',
      });
    }

    next();
  };
};
