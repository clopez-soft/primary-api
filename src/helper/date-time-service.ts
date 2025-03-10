import { DateTime, Duration } from "luxon";
import { DATE_DIFF } from "src/common/enums";

export abstract class DateTimeService {
  abstract fromISOToDatetime(date: string): DateTime;
  abstract toDatetime(date: Date): DateTime;
  abstract toDate(date: DateTime): Date;
  abstract now(): DateTime;

  abstract tranform(date: Date, value: number, type: DATE_DIFF): DateTime;
  abstract transformFromNow(value: number, type: DATE_DIFF): DateTime;

  abstract diffBetween(date1: Date, date2: Date): Duration;
  abstract equals: (date1: Date, date2: Date) => boolean;

  abstract isValidDate: (date: any) => boolean;
  abstract dateDistance: (
    date: Date,
    baseDate: Date,
    lang: string,
    addSuffix: boolean
  ) => string;
  abstract dateDistanceToNow: (
    date: Date,
    lang: string,
    addSuffix: boolean,
    includeSeconds: boolean
  ) => string;
  abstract getFriendlyDateTime: (
    date: Date,
    lang: string,
    exact: boolean
  ) => string;
  abstract dateFormatToString: (
    date: Date,
    lang: string,
    dateFormat: string
  ) => string;
  abstract shortDateDividerHelper: (
    date: Date,
    lang: string,
    includeHourAfterToday: boolean
  ) => string;

  abstract isBefore: (date: Date, dateToCompare: Date) => boolean;
  abstract isAfter: (date: Date, dateToCompare: Date) => boolean;
}
