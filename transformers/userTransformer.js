function transformUser(user) {
  return {
    id: user.userId,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
  };
}

module.exports = { transformUser };
