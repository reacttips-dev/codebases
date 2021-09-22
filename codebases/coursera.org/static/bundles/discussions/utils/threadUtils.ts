export function formatCount(count, round = false) {
  if (count > 1000) {
    if (round) {
      return Math.round(count / 1000) + 'k';
    }
    return Math.round((count / 1000) * 10) / 10 + 'k';
  }
  return count;
}

export function formatThreadLegendId(question) {
  return `${question.id}-thread-legend`;
}

export function formatReplyLegendId(reply) {
  return `${reply.id}-post-legend`;
}

// returns the last ID from a ~ separated set of IDs.
// this is useful when you need to get the current level post from a reply.
export function getPostIdFromQuestion(question?: { id: string }) {
  return question?.id?.split('~').pop() || '';
}
