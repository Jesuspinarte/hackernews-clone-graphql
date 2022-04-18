function newLinkSubscribe(_, __, { pubsub }) {
  return pubsub.asyncIterator("NEW_LINK");
}

function updateLinkSubscribe(_, __, { pubsub }) {
  return pubsub.asyncIterator("UPDATE_LINK");
}

function deleteLinkSubscribe(_, __, { pubsub }) {
  return pubsub.asyncIterator("DELETE_LINK");
}

function newVoteSubscribe(_, __, { pubsub }) {
  return pubsub.asyncIterator("NEW_VOTE");
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => payload,
};

const updateLink = {
  subscribe: updateLinkSubscribe,
  resolve: (payload) => payload,
};

const deleteLink = {
  subscribe: deleteLinkSubscribe,
  resolve: (payload) => payload,
};

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload) => payload,
};

module.exports = {
  deleteLink,
  newLink,
  newVote,
  updateLink,
};
