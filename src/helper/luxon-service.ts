import { DateTime, Settings } from "luxon";
import {
  formatDistanceToNow,
  formatDistance,
  format,
  isToday,
  isYesterday,
  isSameWeek,
  isSameYear,
  isBefore,
  isAfter,
} from "date-fns";
import { es, enUS } from "date-fns/locale";
import { DATE_DIFF } from "src/common/enums";

import { DateTimeService } from "./date-time-service";

export const LuxonService: DateTimeService = class {
  static fromISOToDatetime(date: string) {
    return DateTime.fromISO(date);
  }

  static toDatetime(date: Date) {
    const instance = DateTime.fromJSDate(date);
    return instance;
  }

  static toDate(date: DateTime) {
    return date.toJSDate();
  }

  static now() {
    return DateTime.now();
  }

  static tranform(date: Date, value: number, type: DATE_DIFF) {
    const intance = this.toDatetime(date);

    switch (type) {
      case DATE_DIFF.MINUTE:
        return intance.plus({ minutes: value });
      case DATE_DIFF.HOUR:
        return intance.plus({ hours: value });
      case DATE_DIFF.DAY:
        return intance.plus({ days: value });
      case DATE_DIFF.WEEK:
        return intance.plus({ weeks: value });
      case DATE_DIFF.MONTH:
        return intance.plus({ months: value });
      case DATE_DIFF.YEAR:
        return intance.plus({ years: value });
      default:
        return intance;
    }
  }

  static transformFromNow(value: number, type: DATE_DIFF) {
    return this.tranform(DateTime.now().toJSDate(), value, type);
  }

  static diffBetween(date1: Date, date2: Date) {
    const dt1 = this.toDatetime(date1);
    const dt2 = this.toDatetime(date2);

    return dt1.diff(dt2);
  }

  static equals(date1: Date, date2: Date) {
    return (
      this.toDatetime(date1).toISODate() === this.toDatetime(date2).toISODate()
    );
  }

  static setGlobalLocale() {
    Settings.defaultLocale = "es-hn";
  }

  static isValidDate(date: any) {
    if (!date || date == "Invalid Date") return false;

    return true;
  }

  static dateDistance(
    date: Date,
    baseDate: Date,
    lang: string,
    addSuffix: boolean = true
  ) {
    if (!date) return "";

    const options = {
      includeSeconds: false,
      addSuffix: addSuffix,
      locale: lang === "es" ? es : enUS,
    };
    const result = formatDistance(date, baseDate, options);

    return result;
  }

  static dateDistanceToNow(
    date: Date,
    lang: string,
    addSuffix: boolean = true,
    includeSeconds: boolean = true
  ) {
    if (!date) return "";

    const options = {
      includeSeconds: includeSeconds,
      addSuffix: addSuffix,
      locale: lang === "es" ? es : enUS,
    };
    const result = formatDistanceToNow(date, options);

    return result;
  }

  static getFriendlyDateTime(date: Date, lang: string, exact: boolean = false) {
    if (!this.isValidDate(date)) return "Unknown";

    if (exact) {
      const fmt =
        lang === "es" ? "dd 'de' MMM yyyy h:m aaaa" : "MMM dd, yyyy H:m";
      return format(new Date(date), fmt, { locale: lang === "es" ? es : enUS });
    } else {
      const options = {
        includeSeconds: true,
        addSuffix: true,
        locale: lang === "es" ? es : enUS,
      };
      const created = new Date(date);
      const result = formatDistanceToNow(created, options);
      return result;
    }
  }

  static dateFormatToString(
    date: Date,
    lang: string,
    dateFormat: string = "MMM dd yyyy  H:m:s"
  ) {
    if (!this.isValidDate(date)) return "Unknown";

    return format(new Date(date), dateFormat, {
      locale: lang === "es" ? es : enUS,
      weekStartsOn: 1,
    });
  }

  static shortDateDividerHelper(
    date: Date,
    lang: string,
    includeHourAfterToday: boolean = false
  ) {
    try {
      if (!this.isValidDate(date)) return "";

      const current = new Date();

      const hourFormat = "hh:mm aaaa";
      const addFormat = includeHourAfterToday ? ` ${hourFormat}` : "";

      if (isToday(date)) return this.dateFormatToString(date, lang, hourFormat);

      if (isYesterday(date)) {
        const lbYesterday = lang === "es" ? "Ayer " : "Yesterday ";
        return (
          lbYesterday +
          (includeHourAfterToday
            ? this.dateFormatToString(date, lang, hourFormat)
            : "")
        );
      }

      if (isSameWeek(date, current))
        return this.dateFormatToString(date, lang, "EEEE" + addFormat);

      if (isSameYear(date, current)) {
        const fmt_sy = lang === "es" ? "dd MMM" : "MMM dd";
        return this.dateFormatToString(date, lang, fmt_sy + addFormat);
      }

      const fmt_gen = lang === "es" ? "dd/MM/yyyy" : "MM/dd/yyyy";
      return this.dateFormatToString(date, lang, fmt_gen + addFormat);
    } catch (error) {
      return "error";
    }
  }

  static isBefore(date: Date, dateToCompare: Date) {
    return isBefore(date, dateToCompare);
  }

  static isAfter(date: Date, dateToCompare: Date) {
    return isAfter(date, dateToCompare);
  }
};
