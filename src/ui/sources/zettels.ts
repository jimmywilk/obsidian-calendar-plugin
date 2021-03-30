import type { Moment } from "moment";
import type { TFile } from "obsidian";
import type { ICalendarSource, IEvaluatedMetadata } from "obsidian-calendar-ui";
import { getDailyNote, getDateFromFile } from "obsidian-daily-notes-interface";
import { get } from "svelte/store";

import { dailyNotes } from "../stores";

export function getNumZettels(note: TFile): number {
  if (!note) {
    return 0;
  }

  const zettelPrefix = getDateFromFile(note, "day").format("YYYYMMDD");
  return window.app.vault
    .getMarkdownFiles()
    .filter((file) => file.name.startsWith(zettelPrefix)).length;
}

async function getMetadata(file: TFile): Promise<IEvaluatedMetadata> {
  const numZettels = getNumZettels(file);

  return {
    dots: [],
    value: numZettels,
  };
}

export const zettelsSource: ICalendarSource = {
  id: "zettels",
  name: "Zettels",
  description:
    "Show how many notes use a Zettelkasten prefix matching the current day",

  getDailyMetadata: async (date: Moment): Promise<IEvaluatedMetadata> => {
    const file = getDailyNote(date, get(dailyNotes));
    return getMetadata(file);
  },

  defaultSettings: Object.freeze({
    color: "#b48ead",
    display: "calendar-and-menu",
  }),
};