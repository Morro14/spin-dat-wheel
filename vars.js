export const WOW_CLASS_COLORS = {
  DEATH_KNIGHT: "#C41E3A",
  DEMON_HUNTER: "#A330C9",
  DRUID: "#FF7C0A",
  EVOKER: "#33937F",
  HUNTER: "#AAD372",
  MAGE: "#3FC7EB",
  MONK: "#00FF98",
  PALADIN: "#F48CBA",
  PRIEST: "#FFFFFF",
  ROGUE: "#FFF468",
  SHAMAN: "#0070DD",
  WARLOCK: "#8788EE",
  WARRIOR: "#C69B6D",
};

export const WOW_CLASS_DATA = {
  DEATH_KNIGHT: {
    roles: ["tank", "dps", "melee"],
    specs: ["frost", "unholy", "blood"],
  },
  DEMON_HUNTER: {
    roles: ["tank", "dps", "melee", "ranged"],
    specs: ["vengeance", "havoc", "devaurer"],
  },
  DRUID: {
    roles: ["tank", "dps", "healer", "melee", "ranged"],
    specs: ["guardian", "feral", "restoration", "balance"],
  },
  EVOKER: {
    roles: ["dps", "healer", "ranged", "support"],
    specs: ["devastation", "preservation", "augmentation"],
  },
  HUNTER: {
    roles: ["dps", "melee", "ranged"],
    specs: ["beastmastery", "marksman", "survival"],
  },
  MAGE: { roles: ["dps", "ranged"], specs: ["arcane", "fire", "frost"] },
  MONK: {
    roles: ["tank", "dps", "melee", "healer"],
    specs: ["mistweaver", "brewmaster", "windwalker"],
  },
  PALADIN: {
    roles: ["tank", "dps", "melee", "healer"],
    specs: ["retibution", "holy", "protection"],
  },
  PRIEST: {
    roles: ["dps", "ranged", "healer"],
    specs: ["discipline", "holy", "shadow"],
  },
  ROGUE: {
    roles: ["dps", "melee"],
    specs: ["assassination", "outlaw", "subtely"],
  },
  SHAMAN: {
    roles: ["dps", "melee", "ranged", "healer"],
    specs: ["enhancement", "elemental", "restoration"],
  },
  WARLOCK: {
    roles: ["dps", "ranged"],
    specs: ["affliction", "demonology", "destruction"],
  },
  WARRIOR: {
    roles: ["tank", "dps", "melee"],
    specs: ["arms", "fury", "protection"],
  },
};

export const CHOICES_INIT = Object.keys(WOW_CLASS_DATA);
export const ROLES = ["tank", "healer", "melee", "ranged", "support"];

export const SPEC_COLORS = ["#6132D9", "#E85B45", "#BFD63D", "#29D2B9"];
