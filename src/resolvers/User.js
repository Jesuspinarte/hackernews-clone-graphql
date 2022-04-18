function links({ id }, _, { prisma }) {
  return prisma.user.findUnique({ where: { id } }).links();
}

module.exports = {
  links,
};
