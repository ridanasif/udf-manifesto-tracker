export const VALID_STATUSES = ["pending", "in_progress", "fulfilled", "evaded"];

export const STATUS_OPTIONS = [
  {
    id: "pending",
    label_en: "Pending",
    label_ml: "ബാക്കി",
    statusLabel: "Pending",
    statusLabel_ml: "ബാക്കിനിൽക്കുന്നത്"
  },
  {
    id: "in_progress",
    label_en: "In Progress",
    label_ml: "പുരോഗതിയിൽ",
    statusLabel: "In Progress",
    statusLabel_ml: "പുരോഗതിയിൽ"
  },
  {
    id: "fulfilled",
    label_en: "Implemented",
    label_ml: "നടപ്പിലായത്",
    statusLabel: "Implemented",
    statusLabel_ml: "നടപ്പിലായത്"
  },
  {
    id: "evaded",
    label_en: "Bypassed",
    label_ml: "ഉപേക്ഷിച്ചത്",
    statusLabel: "Bypassed",
    statusLabel_ml: "ഉപേക്ഷിച്ചത്"
  }
];

export const STATUS_DISPLAY = STATUS_OPTIONS.reduce((acc, status) => {
  acc[status.id] = status;
  return acc;
}, {});

export const SOURCE_DOMAINS = [
  "kerala.gov.in",
  "assembly.kerala.gov.in",
  "budget.kerala.gov.in",
  "egazette.kerala.gov.in",
  "pib.gov.in",
  "eci.gov.in",
  "prsindia.org",
  "data.gov.in",
  "thehindu.com",
  "indianexpress.com",
  "timesofindia.indiatimes.com",
  "ndtv.com",
  "deccanherald.com",
  "newindianexpress.com",
  "news18.com",
  "scroll.in",
  "thewire.in",
  "onmanorama.com",
  "mathrubhumi.com",
  "manoramanews.com",
  "asianetnews.com",
  "mediaoneonline.com",
  "deshabhimani.com",
  "24newshd.com",
  "reporterlive.com",
  "janamtv.com",
  "worldbank.org",
  "unicef.org",
  "who.int",
  "undp.org",
  "niti.gov.in"
];
