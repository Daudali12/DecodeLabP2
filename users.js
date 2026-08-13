const users = [];

function nextId() {
  return users.length === 0 ? 1 : Math.max(...users.map((user) => user.id)) + 1;
}

module.exports = { users, nextId };
