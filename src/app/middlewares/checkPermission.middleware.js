// exports.checkPermission = (permissionCode) => {
//   return (req, res, next) => {
//     const user = req.user;

//     if (!user || !user.roleCode) {
//       return res.status(403).json({ message: 'No role assigned' });
//     }

//     const role = user.roleCode; // đã populate
//     console.log('ROLE:', req.user.roleCode);

//     if (!role.permissions || role.permissions.length === 0) {
//       return res.status(403).json({ message: 'No permissions found' });
//     }

//     const hasPermission = role.permissions.some(
//       (p) => p.code === permissionCode
//     );

//     console.log('HAS PERMISSION:', hasPermission);

//     if (!hasPermission) {
//       return res.status(403).json({
//         message: 'Forbidden: You do not have permission',
//       });
//     }

//     next();
//   };
// };

exports.checkPermission = (...permissionCodes) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const role = user.roleCode;

    if (!role) {
      return res.status(403).json({ message: 'No role assigned' });
    }

    const permissions = role.permissions || [];

    if (permissions.length === 0) {
      return res.status(403).json({ message: 'No permissions found' });
    }

    // check OR logic: chỉ cần 1 trong các permissionCodes có trong user
    const hasPermission = permissions.some(
      (p) => p && permissionCodes.includes(p.code)
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: `Forbidden: Missing permission ${permissionCodes.join(' or ')}`,
      });
    }

    next();
  };
};
