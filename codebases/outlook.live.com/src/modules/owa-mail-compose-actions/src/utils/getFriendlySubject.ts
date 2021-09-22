import { noSubject } from 'owa-locstrings/lib/strings/nosubject.locstring.json';
import loc from 'owa-localize';

export default function getFriendlySubject(subject: string) {
    subject = subject || '';
    if (subject.trim() == '') {
        subject = loc(noSubject);
    }

    return subject;
}
