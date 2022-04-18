function link({ id }, _, { prisma }) {
  return prisma.vote.findUnique({ where: { id } }).link();
}

function user({ id }, _, { prisma }) {
  return prisma.vote.findUnique({ where: { id } }).user();
}

module.exports = {
  link,
  user,
};
