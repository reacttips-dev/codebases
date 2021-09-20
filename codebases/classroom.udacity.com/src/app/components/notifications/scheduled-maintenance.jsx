import Markdown from '@udacity/ureact-markdown';

export default function ScheduledMaintenance({ customMessage }) {
  return <Markdown text={customMessage} />;
}
