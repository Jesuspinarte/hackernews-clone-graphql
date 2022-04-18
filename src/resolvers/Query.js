function info() {
  return `This is the API of a Hackernews Clone`;
}

async function feed(_, { filter, skip, take, orderBy }, { prisma }) {
  const where = filter
    ? {
        OR: [
          { description: { contains: filter } },
          { url: { contains: filter } },
        ],
      }
    : {};

  const [links, count] = await Promise.all([
    prisma.link.findMany({ where, skip, take, orderBy }),
    prisma.link.count({ where }),
  ]);

  return {
    links,
    count,
  };
}

function allusers(_, __, { prisma }) {
  return prisma.user.findMany();
}

module.exports = {
  info,
  feed,
  allusers,
};
