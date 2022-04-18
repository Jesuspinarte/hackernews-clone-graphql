const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../utils");

async function post(_, { url, description }, { prisma, pubsub, userId }) {
  const newLink = await prisma.link.create({
    data: { description, url, postedBy: { connect: { id: userId } } },
  });

  pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

async function updateLink(_, { description, id, url }, { prisma, pubsub }) {
  const updateLink = await prisma.link.update({
    where: { id: Number(id) },
    data: { description, url },
  });

  if (!updateLink) {
    throw new Error(`The link with the ID ${id} was not found`);
  }

  pubsub.publish("UPDATE_LINK", updateLink);

  return updateLink;
}

async function deleteLink(_, { id }, { prisma, pubsub }) {
  // Delete post's votes
  await prisma.vote.deleteMany({ where: { linkId: Number(id) } });
  // Delete post
  const deleteLink = await prisma.link.delete({ where: { id: Number(id) } });

  if (!deleteLink) {
    throw new Error(`The link with the ID ${id} was not found`);
  }

  pubsub.publish("DELETE_LINK", deleteLink);

  return deleteLink;
}

async function signup(_, args, { prisma }) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await prisma.user.create({ data: { ...args, password } });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(_, { email, password }, { prisma }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Wrong user or password");
  }

  const valid = bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Wrong user or password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function vote(_, { linkId }, { prisma, pubsub, userId }) {
  const vote = await prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(linkId),
        userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${linkId}`);
  }

  const newVote = await prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(linkId) } },
    },
  });

  pubsub.publish("NEW_VOTE", newVote);
  return newVote;
}

module.exports = {
  deleteLink,
  login,
  post,
  signup,
  updateLink,
  vote,
};
