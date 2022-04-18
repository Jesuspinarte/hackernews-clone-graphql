function postedBy({ id }, _, { prisma }) {
  return prisma.link.findUnique({ where: { id } }).postedBy();
}

function votes({ id }, _, { prisma }) {
  return prisma.link.findUnique({ where: { id } }).votes();
}

module.exports = {
  postedBy,
  votes,
};
