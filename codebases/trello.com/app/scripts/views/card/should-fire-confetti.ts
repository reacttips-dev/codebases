const CONFETTI_KEYWORDS = ['🎊', '🎉', '🎆', '🎇', '👖', '✨'];

export function shouldFireConfetti(name: string) {
  return CONFETTI_KEYWORDS.some((keyword) => name.includes(keyword));
}
