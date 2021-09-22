import { FluidOwaSource } from '../enums/FluidEnums';
import { assertNever } from 'owa-assert';

export function isChapterTwoSource(owaSource: FluidOwaSource) {
    switch (owaSource) {
        case FluidOwaSource.MailCompose:
        case FluidOwaSource.AgendaEditor:
        case FluidOwaSource.MailReadingPane:
        case FluidOwaSource.Timestream:
        case FluidOwaSource.None:
            return false;
        case FluidOwaSource.CalendarCompose:
        case FluidOwaSource.MailCalendarCard:
        case FluidOwaSource.CalendarReadingPane:
            return true;
        default:
            return assertNever(owaSource);
    }
}

export function isCalendarSource(fluidOwaSource: FluidOwaSource): boolean {
    switch (fluidOwaSource) {
        case FluidOwaSource.CalendarReadingPane:
        case FluidOwaSource.CalendarCompose:
        case FluidOwaSource.AgendaEditor:
        case FluidOwaSource.MailCalendarCard:
            return true;

        case FluidOwaSource.Timestream:
        case FluidOwaSource.MailReadingPane:
        case FluidOwaSource.MailCompose:
        case FluidOwaSource.None:
            return false;
        default:
            assertNever(fluidOwaSource);
    }
}
