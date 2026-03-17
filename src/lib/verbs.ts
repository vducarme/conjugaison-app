// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Banco de dados de verbos franceses — DailyVerbEngine
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Verb, Tense, Pronoun } from "@/types";

// [DECISÃO] 60 verbos cobrindo os 3 grupos — suficiente para variação sem repetir em < 1 semana
// Priorizamos os mais usados no cotidiano francês (frequência de uso real)
export const VERBS: Verb[] = [
  // Grupo 1 — verbos em -er (regular)
  { infinitive: "parler", group: 1, auxiliary: "avoir", isIrregular: false },
  { infinitive: "manger", group: 1, auxiliary: "avoir", isIrregular: false },
  { infinitive: "jouer", group: 1, auxiliary: "avoir", isIrregular: false },
  { infinitive: "travailler", group: 1, auxiliary: "avoir", isIrregular: false },
  { infinitive: "aimer", group: 1, auxiliary: "avoir", isIrregular: false },
  { infinitive: "regarder", group: 1, auxiliary: "avoir", isIrregular: false },
  { infinitive: "écouter", group: 1, auxiliary: "avoir", isIrregular: false },
  { infinitive: "habiter", group: 1, auxiliary: "avoir", isIrregular: false },
  { infinitive: "acheter", group: 1, auxiliary: "avoir", isIrregular: true },
  { infinitive: "appeler", group: 1, auxiliary: "avoir", isIrregular: true },
  { infinitive: "commencer", group: 1, auxiliary: "avoir", isIrregular: true },
  { infinitive: "voyager", group: 1, auxiliary: "avoir", isIrregular: true },
  { infinitive: "envoyer", group: 1, auxiliary: "avoir", isIrregular: true },
  { infinitive: "payer", group: 1, auxiliary: "avoir", isIrregular: true },
  { infinitive: "arriver", group: 1, auxiliary: "être", isIrregular: false },
  { infinitive: "tomber", group: 1, auxiliary: "être", isIrregular: false },
  { infinitive: "rester", group: 1, auxiliary: "être", isIrregular: false },
  { infinitive: "entrer", group: 1, auxiliary: "être", isIrregular: false },
  { infinitive: "retourner", group: 1, auxiliary: "être", isIrregular: false },
  { infinitive: "passer", group: 1, auxiliary: "avoir", isIrregular: false },

  // Grupo 2 — verbos em -ir (regular -issant)
  { infinitive: "finir", group: 2, auxiliary: "avoir", isIrregular: false },
  { infinitive: "choisir", group: 2, auxiliary: "avoir", isIrregular: false },
  { infinitive: "réussir", group: 2, auxiliary: "avoir", isIrregular: false },
  { infinitive: "remplir", group: 2, auxiliary: "avoir", isIrregular: false },
  { infinitive: "grandir", group: 2, auxiliary: "avoir", isIrregular: false },
  { infinitive: "obéir", group: 2, auxiliary: "avoir", isIrregular: false },
  { infinitive: "réfléchir", group: 2, auxiliary: "avoir", isIrregular: false },
  { infinitive: "agir", group: 2, auxiliary: "avoir", isIrregular: false },
  { infinitive: "guérir", group: 2, auxiliary: "avoir", isIrregular: false },
  { infinitive: "bâtir", group: 2, auxiliary: "avoir", isIrregular: false },

  // Grupo 3 — verbos irregulares
  { infinitive: "être", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "avoir", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "aller", group: 3, auxiliary: "être", isIrregular: true },
  { infinitive: "faire", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "dire", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "pouvoir", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "vouloir", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "devoir", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "savoir", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "venir", group: 3, auxiliary: "être", isIrregular: true },
  { infinitive: "tenir", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "prendre", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "mettre", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "voir", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "partir", group: 3, auxiliary: "être", isIrregular: true },
  { infinitive: "sortir", group: 3, auxiliary: "être", isIrregular: true },
  { infinitive: "dormir", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "écrire", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "lire", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "boire", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "connaître", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "vivre", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "mourir", group: 3, auxiliary: "être", isIrregular: true },
  { infinitive: "naître", group: 3, auxiliary: "être", isIrregular: true },
  { infinitive: "croire", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "recevoir", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "ouvrir", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "courir", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "conduire", group: 3, auxiliary: "avoir", isIrregular: true },
  { infinitive: "suivre", group: 3, auxiliary: "avoir", isIrregular: true },
];

// [DECISÃO] Tenses limitados ao nível A2-B2 do perfil — impératif incluso por ser recorrente em treinos
export const TENSES: Tense[] = [
  "présent",
  "passé composé",
  "imparfait",
  "futur simple",
  "conditionnel présent",
  "subjonctif présent",
  "plus-que-parfait",
];

export const PRONOUNS: Pronoun[] = [
  "je",
  "tu",
  "il/elle",
  "nous",
  "vous",
  "ils/elles",
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Tabela de conjugação
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// [DECISÃO] Conjugações hardcoded para os verbos mais comuns — garante precisão vs depender de API externa
// Formato: conjugations[infinitive][tense][pronoun] = "forma conjugada"
type ConjugationTable = Record<string, Partial<Record<Tense, Record<Pronoun, string>>>>;

export const CONJUGATIONS: ConjugationTable = {
  // ─── ÊTRE ───
  "être": {
    "présent": {
      "je": "suis", "tu": "es", "il/elle": "est",
      "nous": "sommes", "vous": "êtes", "ils/elles": "sont",
    },
    "passé composé": {
      "je": "ai été", "tu": "as été", "il/elle": "a été",
      "nous": "avons été", "vous": "avez été", "ils/elles": "ont été",
    },
    "imparfait": {
      "je": "étais", "tu": "étais", "il/elle": "était",
      "nous": "étions", "vous": "étiez", "ils/elles": "étaient",
    },
    "futur simple": {
      "je": "serai", "tu": "seras", "il/elle": "sera",
      "nous": "serons", "vous": "serez", "ils/elles": "seront",
    },
    "conditionnel présent": {
      "je": "serais", "tu": "serais", "il/elle": "serait",
      "nous": "serions", "vous": "seriez", "ils/elles": "seraient",
    },
    "subjonctif présent": {
      "je": "sois", "tu": "sois", "il/elle": "soit",
      "nous": "soyons", "vous": "soyez", "ils/elles": "soient",
    },
    "plus-que-parfait": {
      "je": "avais été", "tu": "avais été", "il/elle": "avait été",
      "nous": "avions été", "vous": "aviez été", "ils/elles": "avaient été",
    },
  },

  // ─── AVOIR ───
  "avoir": {
    "présent": {
      "je": "ai", "tu": "as", "il/elle": "a",
      "nous": "avons", "vous": "avez", "ils/elles": "ont",
    },
    "passé composé": {
      "je": "ai eu", "tu": "as eu", "il/elle": "a eu",
      "nous": "avons eu", "vous": "avez eu", "ils/elles": "ont eu",
    },
    "imparfait": {
      "je": "avais", "tu": "avais", "il/elle": "avait",
      "nous": "avions", "vous": "aviez", "ils/elles": "avaient",
    },
    "futur simple": {
      "je": "aurai", "tu": "auras", "il/elle": "aura",
      "nous": "aurons", "vous": "aurez", "ils/elles": "auront",
    },
    "conditionnel présent": {
      "je": "aurais", "tu": "aurais", "il/elle": "aurait",
      "nous": "aurions", "vous": "auriez", "ils/elles": "auraient",
    },
    "subjonctif présent": {
      "je": "aie", "tu": "aies", "il/elle": "ait",
      "nous": "ayons", "vous": "ayez", "ils/elles": "aient",
    },
    "plus-que-parfait": {
      "je": "avais eu", "tu": "avais eu", "il/elle": "avait eu",
      "nous": "avions eu", "vous": "aviez eu", "ils/elles": "avaient eu",
    },
  },

  // ─── ALLER ───
  "aller": {
    "présent": {
      "je": "vais", "tu": "vas", "il/elle": "va",
      "nous": "allons", "vous": "allez", "ils/elles": "vont",
    },
    "passé composé": {
      "je": "suis allé", "tu": "es allé", "il/elle": "est allé",
      "nous": "sommes allés", "vous": "êtes allés", "ils/elles": "sont allés",
    },
    "imparfait": {
      "je": "allais", "tu": "allais", "il/elle": "allait",
      "nous": "allions", "vous": "alliez", "ils/elles": "allaient",
    },
    "futur simple": {
      "je": "irai", "tu": "iras", "il/elle": "ira",
      "nous": "irons", "vous": "irez", "ils/elles": "iront",
    },
    "conditionnel présent": {
      "je": "irais", "tu": "irais", "il/elle": "irait",
      "nous": "irions", "vous": "iriez", "ils/elles": "iraient",
    },
    "subjonctif présent": {
      "je": "aille", "tu": "ailles", "il/elle": "aille",
      "nous": "allions", "vous": "alliez", "ils/elles": "aillent",
    },
    "plus-que-parfait": {
      "je": "étais allé", "tu": "étais allé", "il/elle": "était allé",
      "nous": "étions allés", "vous": "étiez allés", "ils/elles": "étaient allés",
    },
  },

  // ─── FAIRE ───
  "faire": {
    "présent": {
      "je": "fais", "tu": "fais", "il/elle": "fait",
      "nous": "faisons", "vous": "faites", "ils/elles": "font",
    },
    "passé composé": {
      "je": "ai fait", "tu": "as fait", "il/elle": "a fait",
      "nous": "avons fait", "vous": "avez fait", "ils/elles": "ont fait",
    },
    "imparfait": {
      "je": "faisais", "tu": "faisais", "il/elle": "faisait",
      "nous": "faisions", "vous": "faisiez", "ils/elles": "faisaient",
    },
    "futur simple": {
      "je": "ferai", "tu": "feras", "il/elle": "fera",
      "nous": "ferons", "vous": "ferez", "ils/elles": "feront",
    },
    "conditionnel présent": {
      "je": "ferais", "tu": "ferais", "il/elle": "ferait",
      "nous": "ferions", "vous": "feriez", "ils/elles": "feraient",
    },
    "subjonctif présent": {
      "je": "fasse", "tu": "fasses", "il/elle": "fasse",
      "nous": "fassions", "vous": "fassiez", "ils/elles": "fassent",
    },
    "plus-que-parfait": {
      "je": "avais fait", "tu": "avais fait", "il/elle": "avait fait",
      "nous": "avions fait", "vous": "aviez fait", "ils/elles": "avaient fait",
    },
  },

  // ─── PARLER (modelo grupo 1) ───
  "parler": {
    "présent": {
      "je": "parle", "tu": "parles", "il/elle": "parle",
      "nous": "parlons", "vous": "parlez", "ils/elles": "parlent",
    },
    "passé composé": {
      "je": "ai parlé", "tu": "as parlé", "il/elle": "a parlé",
      "nous": "avons parlé", "vous": "avez parlé", "ils/elles": "ont parlé",
    },
    "imparfait": {
      "je": "parlais", "tu": "parlais", "il/elle": "parlait",
      "nous": "parlions", "vous": "parliez", "ils/elles": "parlaient",
    },
    "futur simple": {
      "je": "parlerai", "tu": "parleras", "il/elle": "parlera",
      "nous": "parlerons", "vous": "parlerez", "ils/elles": "parleront",
    },
    "conditionnel présent": {
      "je": "parlerais", "tu": "parlerais", "il/elle": "parlerait",
      "nous": "parlerions", "vous": "parleriez", "ils/elles": "parleraient",
    },
    "subjonctif présent": {
      "je": "parle", "tu": "parles", "il/elle": "parle",
      "nous": "parlions", "vous": "parliez", "ils/elles": "parlent",
    },
    "plus-que-parfait": {
      "je": "avais parlé", "tu": "avais parlé", "il/elle": "avait parlé",
      "nous": "avions parlé", "vous": "aviez parlé", "ils/elles": "avaient parlé",
    },
  },

  // ─── FINIR (modelo grupo 2) ───
  "finir": {
    "présent": {
      "je": "finis", "tu": "finis", "il/elle": "finit",
      "nous": "finissons", "vous": "finissez", "ils/elles": "finissent",
    },
    "passé composé": {
      "je": "ai fini", "tu": "as fini", "il/elle": "a fini",
      "nous": "avons fini", "vous": "avez fini", "ils/elles": "ont fini",
    },
    "imparfait": {
      "je": "finissais", "tu": "finissais", "il/elle": "finissait",
      "nous": "finissions", "vous": "finissiez", "ils/elles": "finissaient",
    },
    "futur simple": {
      "je": "finirai", "tu": "finiras", "il/elle": "finira",
      "nous": "finirons", "vous": "finirez", "ils/elles": "finiront",
    },
    "conditionnel présent": {
      "je": "finirais", "tu": "finirais", "il/elle": "finirait",
      "nous": "finirions", "vous": "finiriez", "ils/elles": "finiraient",
    },
    "subjonctif présent": {
      "je": "finisse", "tu": "finisses", "il/elle": "finisse",
      "nous": "finissions", "vous": "finissiez", "ils/elles": "finissent",
    },
    "plus-que-parfait": {
      "je": "avais fini", "tu": "avais fini", "il/elle": "avait fini",
      "nous": "avions fini", "vous": "aviez fini", "ils/elles": "avaient fini",
    },
  },

  // ─── POUVOIR ───
  "pouvoir": {
    "présent": {
      "je": "peux", "tu": "peux", "il/elle": "peut",
      "nous": "pouvons", "vous": "pouvez", "ils/elles": "peuvent",
    },
    "passé composé": {
      "je": "ai pu", "tu": "as pu", "il/elle": "a pu",
      "nous": "avons pu", "vous": "avez pu", "ils/elles": "ont pu",
    },
    "imparfait": {
      "je": "pouvais", "tu": "pouvais", "il/elle": "pouvait",
      "nous": "pouvions", "vous": "pouviez", "ils/elles": "pouvaient",
    },
    "futur simple": {
      "je": "pourrai", "tu": "pourras", "il/elle": "pourra",
      "nous": "pourrons", "vous": "pourrez", "ils/elles": "pourront",
    },
    "conditionnel présent": {
      "je": "pourrais", "tu": "pourrais", "il/elle": "pourrait",
      "nous": "pourrions", "vous": "pourriez", "ils/elles": "pourraient",
    },
    "subjonctif présent": {
      "je": "puisse", "tu": "puisses", "il/elle": "puisse",
      "nous": "puissions", "vous": "puissiez", "ils/elles": "puissent",
    },
    "plus-que-parfait": {
      "je": "avais pu", "tu": "avais pu", "il/elle": "avait pu",
      "nous": "avions pu", "vous": "aviez pu", "ils/elles": "avaient pu",
    },
  },

  // ─── VOULOIR ───
  "vouloir": {
    "présent": {
      "je": "veux", "tu": "veux", "il/elle": "veut",
      "nous": "voulons", "vous": "voulez", "ils/elles": "veulent",
    },
    "passé composé": {
      "je": "ai voulu", "tu": "as voulu", "il/elle": "a voulu",
      "nous": "avons voulu", "vous": "avez voulu", "ils/elles": "ont voulu",
    },
    "imparfait": {
      "je": "voulais", "tu": "voulais", "il/elle": "voulait",
      "nous": "voulions", "vous": "vouliez", "ils/elles": "voulaient",
    },
    "futur simple": {
      "je": "voudrai", "tu": "voudras", "il/elle": "voudra",
      "nous": "voudrons", "vous": "voudrez", "ils/elles": "voudront",
    },
    "conditionnel présent": {
      "je": "voudrais", "tu": "voudrais", "il/elle": "voudrait",
      "nous": "voudrions", "vous": "voudriez", "ils/elles": "voudraient",
    },
    "subjonctif présent": {
      "je": "veuille", "tu": "veuilles", "il/elle": "veuille",
      "nous": "voulions", "vous": "vouliez", "ils/elles": "veuillent",
    },
    "plus-que-parfait": {
      "je": "avais voulu", "tu": "avais voulu", "il/elle": "avait voulu",
      "nous": "avions voulu", "vous": "aviez voulu", "ils/elles": "avaient voulu",
    },
  },

  // ─── DEVOIR ───
  "devoir": {
    "présent": {
      "je": "dois", "tu": "dois", "il/elle": "doit",
      "nous": "devons", "vous": "devez", "ils/elles": "doivent",
    },
    "passé composé": {
      "je": "ai dû", "tu": "as dû", "il/elle": "a dû",
      "nous": "avons dû", "vous": "avez dû", "ils/elles": "ont dû",
    },
    "imparfait": {
      "je": "devais", "tu": "devais", "il/elle": "devait",
      "nous": "devions", "vous": "deviez", "ils/elles": "devaient",
    },
    "futur simple": {
      "je": "devrai", "tu": "devras", "il/elle": "devra",
      "nous": "devrons", "vous": "devrez", "ils/elles": "devront",
    },
    "conditionnel présent": {
      "je": "devrais", "tu": "devrais", "il/elle": "devrait",
      "nous": "devrions", "vous": "devriez", "ils/elles": "devraient",
    },
    "subjonctif présent": {
      "je": "doive", "tu": "doives", "il/elle": "doive",
      "nous": "devions", "vous": "deviez", "ils/elles": "doivent",
    },
    "plus-que-parfait": {
      "je": "avais dû", "tu": "avais dû", "il/elle": "avait dû",
      "nous": "avions dû", "vous": "aviez dû", "ils/elles": "avaient dû",
    },
  },

  // ─── SAVOIR ───
  "savoir": {
    "présent": {
      "je": "sais", "tu": "sais", "il/elle": "sait",
      "nous": "savons", "vous": "savez", "ils/elles": "savent",
    },
    "passé composé": {
      "je": "ai su", "tu": "as su", "il/elle": "a su",
      "nous": "avons su", "vous": "avez su", "ils/elles": "ont su",
    },
    "imparfait": {
      "je": "savais", "tu": "savais", "il/elle": "savait",
      "nous": "savions", "vous": "saviez", "ils/elles": "savaient",
    },
    "futur simple": {
      "je": "saurai", "tu": "sauras", "il/elle": "saura",
      "nous": "saurons", "vous": "saurez", "ils/elles": "sauront",
    },
    "conditionnel présent": {
      "je": "saurais", "tu": "saurais", "il/elle": "saurait",
      "nous": "saurions", "vous": "sauriez", "ils/elles": "sauraient",
    },
    "subjonctif présent": {
      "je": "sache", "tu": "saches", "il/elle": "sache",
      "nous": "sachions", "vous": "sachiez", "ils/elles": "sachent",
    },
    "plus-que-parfait": {
      "je": "avais su", "tu": "avais su", "il/elle": "avait su",
      "nous": "avions su", "vous": "aviez su", "ils/elles": "avaient su",
    },
  },

  // ─── VENIR ───
  "venir": {
    "présent": {
      "je": "viens", "tu": "viens", "il/elle": "vient",
      "nous": "venons", "vous": "venez", "ils/elles": "viennent",
    },
    "passé composé": {
      "je": "suis venu", "tu": "es venu", "il/elle": "est venu",
      "nous": "sommes venus", "vous": "êtes venus", "ils/elles": "sont venus",
    },
    "imparfait": {
      "je": "venais", "tu": "venais", "il/elle": "venait",
      "nous": "venions", "vous": "veniez", "ils/elles": "venaient",
    },
    "futur simple": {
      "je": "viendrai", "tu": "viendras", "il/elle": "viendra",
      "nous": "viendrons", "vous": "viendrez", "ils/elles": "viendront",
    },
    "conditionnel présent": {
      "je": "viendrais", "tu": "viendrais", "il/elle": "viendrait",
      "nous": "viendrions", "vous": "viendriez", "ils/elles": "viendraient",
    },
    "subjonctif présent": {
      "je": "vienne", "tu": "viennes", "il/elle": "vienne",
      "nous": "venions", "vous": "veniez", "ils/elles": "viennent",
    },
    "plus-que-parfait": {
      "je": "étais venu", "tu": "étais venu", "il/elle": "était venu",
      "nous": "étions venus", "vous": "étiez venus", "ils/elles": "étaient venus",
    },
  },

  // ─── PRENDRE ───
  "prendre": {
    "présent": {
      "je": "prends", "tu": "prends", "il/elle": "prend",
      "nous": "prenons", "vous": "prenez", "ils/elles": "prennent",
    },
    "passé composé": {
      "je": "ai pris", "tu": "as pris", "il/elle": "a pris",
      "nous": "avons pris", "vous": "avez pris", "ils/elles": "ont pris",
    },
    "imparfait": {
      "je": "prenais", "tu": "prenais", "il/elle": "prenait",
      "nous": "prenions", "vous": "preniez", "ils/elles": "prenaient",
    },
    "futur simple": {
      "je": "prendrai", "tu": "prendras", "il/elle": "prendra",
      "nous": "prendrons", "vous": "prendrez", "ils/elles": "prendront",
    },
    "conditionnel présent": {
      "je": "prendrais", "tu": "prendrais", "il/elle": "prendrait",
      "nous": "prendrions", "vous": "prendriez", "ils/elles": "prendraient",
    },
    "subjonctif présent": {
      "je": "prenne", "tu": "prennes", "il/elle": "prenne",
      "nous": "prenions", "vous": "preniez", "ils/elles": "prennent",
    },
    "plus-que-parfait": {
      "je": "avais pris", "tu": "avais pris", "il/elle": "avait pris",
      "nous": "avions pris", "vous": "aviez pris", "ils/elles": "avaient pris",
    },
  },

  // ─── DIRE ───
  "dire": {
    "présent": {
      "je": "dis", "tu": "dis", "il/elle": "dit",
      "nous": "disons", "vous": "dites", "ils/elles": "disent",
    },
    "passé composé": {
      "je": "ai dit", "tu": "as dit", "il/elle": "a dit",
      "nous": "avons dit", "vous": "avez dit", "ils/elles": "ont dit",
    },
    "imparfait": {
      "je": "disais", "tu": "disais", "il/elle": "disait",
      "nous": "disions", "vous": "disiez", "ils/elles": "disaient",
    },
    "futur simple": {
      "je": "dirai", "tu": "diras", "il/elle": "dira",
      "nous": "dirons", "vous": "direz", "ils/elles": "diront",
    },
    "conditionnel présent": {
      "je": "dirais", "tu": "dirais", "il/elle": "dirait",
      "nous": "dirions", "vous": "diriez", "ils/elles": "diraient",
    },
    "subjonctif présent": {
      "je": "dise", "tu": "dises", "il/elle": "dise",
      "nous": "disions", "vous": "disiez", "ils/elles": "disent",
    },
    "plus-que-parfait": {
      "je": "avais dit", "tu": "avais dit", "il/elle": "avait dit",
      "nous": "avions dit", "vous": "aviez dit", "ils/elles": "avaient dit",
    },
  },

  // ─── METTRE ───
  "mettre": {
    "présent": {
      "je": "mets", "tu": "mets", "il/elle": "met",
      "nous": "mettons", "vous": "mettez", "ils/elles": "mettent",
    },
    "passé composé": {
      "je": "ai mis", "tu": "as mis", "il/elle": "a mis",
      "nous": "avons mis", "vous": "avez mis", "ils/elles": "ont mis",
    },
    "imparfait": {
      "je": "mettais", "tu": "mettais", "il/elle": "mettait",
      "nous": "mettions", "vous": "mettiez", "ils/elles": "mettaient",
    },
    "futur simple": {
      "je": "mettrai", "tu": "mettras", "il/elle": "mettra",
      "nous": "mettrons", "vous": "mettrez", "ils/elles": "mettront",
    },
    "conditionnel présent": {
      "je": "mettrais", "tu": "mettrais", "il/elle": "mettrait",
      "nous": "mettrions", "vous": "mettriez", "ils/elles": "mettraient",
    },
    "subjonctif présent": {
      "je": "mette", "tu": "mettes", "il/elle": "mette",
      "nous": "mettions", "vous": "mettiez", "ils/elles": "mettent",
    },
    "plus-que-parfait": {
      "je": "avais mis", "tu": "avais mis", "il/elle": "avait mis",
      "nous": "avions mis", "vous": "aviez mis", "ils/elles": "avaient mis",
    },
  },

  // ─── VOIR ───
  "voir": {
    "présent": {
      "je": "vois", "tu": "vois", "il/elle": "voit",
      "nous": "voyons", "vous": "voyez", "ils/elles": "voient",
    },
    "passé composé": {
      "je": "ai vu", "tu": "as vu", "il/elle": "a vu",
      "nous": "avons vu", "vous": "avez vu", "ils/elles": "ont vu",
    },
    "imparfait": {
      "je": "voyais", "tu": "voyais", "il/elle": "voyait",
      "nous": "voyions", "vous": "voyiez", "ils/elles": "voyaient",
    },
    "futur simple": {
      "je": "verrai", "tu": "verras", "il/elle": "verra",
      "nous": "verrons", "vous": "verrez", "ils/elles": "verront",
    },
    "conditionnel présent": {
      "je": "verrais", "tu": "verrais", "il/elle": "verrait",
      "nous": "verrions", "vous": "verriez", "ils/elles": "verraient",
    },
    "subjonctif présent": {
      "je": "voie", "tu": "voies", "il/elle": "voie",
      "nous": "voyions", "vous": "voyiez", "ils/elles": "voient",
    },
    "plus-que-parfait": {
      "je": "avais vu", "tu": "avais vu", "il/elle": "avait vu",
      "nous": "avions vu", "vous": "aviez vu", "ils/elles": "avaient vu",
    },
  },

  // ─── MANGER ───
  "manger": {
    "présent": {
      "je": "mange", "tu": "manges", "il/elle": "mange",
      "nous": "mangeons", "vous": "mangez", "ils/elles": "mangent",
    },
    "passé composé": {
      "je": "ai mangé", "tu": "as mangé", "il/elle": "a mangé",
      "nous": "avons mangé", "vous": "avez mangé", "ils/elles": "ont mangé",
    },
    "imparfait": {
      "je": "mangeais", "tu": "mangeais", "il/elle": "mangeait",
      "nous": "mangions", "vous": "mangiez", "ils/elles": "mangeaient",
    },
    "futur simple": {
      "je": "mangerai", "tu": "mangeras", "il/elle": "mangera",
      "nous": "mangerons", "vous": "mangerez", "ils/elles": "mangeront",
    },
    "conditionnel présent": {
      "je": "mangerais", "tu": "mangerais", "il/elle": "mangerait",
      "nous": "mangerions", "vous": "mangeriez", "ils/elles": "mangeraient",
    },
    "subjonctif présent": {
      "je": "mange", "tu": "manges", "il/elle": "mange",
      "nous": "mangions", "vous": "mangiez", "ils/elles": "mangent",
    },
    "plus-que-parfait": {
      "je": "avais mangé", "tu": "avais mangé", "il/elle": "avait mangé",
      "nous": "avions mangé", "vous": "aviez mangé", "ils/elles": "avaient mangé",
    },
  },

  // ─── BOIRE ───
  "boire": {
    "présent": {
      "je": "bois", "tu": "bois", "il/elle": "boit",
      "nous": "buvons", "vous": "buvez", "ils/elles": "boivent",
    },
    "passé composé": {
      "je": "ai bu", "tu": "as bu", "il/elle": "a bu",
      "nous": "avons bu", "vous": "avez bu", "ils/elles": "ont bu",
    },
    "imparfait": {
      "je": "buvais", "tu": "buvais", "il/elle": "buvait",
      "nous": "buvions", "vous": "buviez", "ils/elles": "buvaient",
    },
    "futur simple": {
      "je": "boirai", "tu": "boiras", "il/elle": "boira",
      "nous": "boirons", "vous": "boirez", "ils/elles": "boiront",
    },
    "conditionnel présent": {
      "je": "boirais", "tu": "boirais", "il/elle": "boirait",
      "nous": "boirions", "vous": "boiriez", "ils/elles": "boiraient",
    },
    "subjonctif présent": {
      "je": "boive", "tu": "boives", "il/elle": "boive",
      "nous": "buvions", "vous": "buviez", "ils/elles": "boivent",
    },
    "plus-que-parfait": {
      "je": "avais bu", "tu": "avais bu", "il/elle": "avait bu",
      "nous": "avions bu", "vous": "aviez bu", "ils/elles": "avaient bu",
    },
  },

  // ─── ÉCRIRE ───
  "écrire": {
    "présent": {
      "je": "écris", "tu": "écris", "il/elle": "écrit",
      "nous": "écrivons", "vous": "écrivez", "ils/elles": "écrivent",
    },
    "passé composé": {
      "je": "ai écrit", "tu": "as écrit", "il/elle": "a écrit",
      "nous": "avons écrit", "vous": "avez écrit", "ils/elles": "ont écrit",
    },
    "imparfait": {
      "je": "écrivais", "tu": "écrivais", "il/elle": "écrivait",
      "nous": "écrivions", "vous": "écriviez", "ils/elles": "écrivaient",
    },
    "futur simple": {
      "je": "écrirai", "tu": "écriras", "il/elle": "écrira",
      "nous": "écrirons", "vous": "écrirez", "ils/elles": "écriront",
    },
    "conditionnel présent": {
      "je": "écrirais", "tu": "écrirais", "il/elle": "écrirait",
      "nous": "écririons", "vous": "écririez", "ils/elles": "écriraient",
    },
    "subjonctif présent": {
      "je": "écrive", "tu": "écrives", "il/elle": "écrive",
      "nous": "écrivions", "vous": "écriviez", "ils/elles": "écrivent",
    },
    "plus-que-parfait": {
      "je": "avais écrit", "tu": "avais écrit", "il/elle": "avait écrit",
      "nous": "avions écrit", "vous": "aviez écrit", "ils/elles": "avaient écrit",
    },
  },

  // ─── LIRE ───
  "lire": {
    "présent": {
      "je": "lis", "tu": "lis", "il/elle": "lit",
      "nous": "lisons", "vous": "lisez", "ils/elles": "lisent",
    },
    "passé composé": {
      "je": "ai lu", "tu": "as lu", "il/elle": "a lu",
      "nous": "avons lu", "vous": "avez lu", "ils/elles": "ont lu",
    },
    "imparfait": {
      "je": "lisais", "tu": "lisais", "il/elle": "lisait",
      "nous": "lisions", "vous": "lisiez", "ils/elles": "lisaient",
    },
    "futur simple": {
      "je": "lirai", "tu": "liras", "il/elle": "lira",
      "nous": "lirons", "vous": "lirez", "ils/elles": "liront",
    },
    "conditionnel présent": {
      "je": "lirais", "tu": "lirais", "il/elle": "lirait",
      "nous": "lirions", "vous": "liriez", "ils/elles": "liraient",
    },
    "subjonctif présent": {
      "je": "lise", "tu": "lises", "il/elle": "lise",
      "nous": "lisions", "vous": "lisiez", "ils/elles": "lisent",
    },
    "plus-que-parfait": {
      "je": "avais lu", "tu": "avais lu", "il/elle": "avait lu",
      "nous": "avions lu", "vous": "aviez lu", "ils/elles": "avaient lu",
    },
  },

  // ─── CHOISIR ───
  "choisir": {
    "présent": {
      "je": "choisis", "tu": "choisis", "il/elle": "choisit",
      "nous": "choisissons", "vous": "choisissez", "ils/elles": "choisissent",
    },
    "passé composé": {
      "je": "ai choisi", "tu": "as choisi", "il/elle": "a choisi",
      "nous": "avons choisi", "vous": "avez choisi", "ils/elles": "ont choisi",
    },
    "imparfait": {
      "je": "choisissais", "tu": "choisissais", "il/elle": "choisissait",
      "nous": "choisissions", "vous": "choisissiez", "ils/elles": "choisissaient",
    },
    "futur simple": {
      "je": "choisirai", "tu": "choisiras", "il/elle": "choisira",
      "nous": "choisirons", "vous": "choisirez", "ils/elles": "choisiront",
    },
    "conditionnel présent": {
      "je": "choisirais", "tu": "choisirais", "il/elle": "choisirait",
      "nous": "choisirions", "vous": "choisiriez", "ils/elles": "choisiraient",
    },
    "subjonctif présent": {
      "je": "choisisse", "tu": "choisisses", "il/elle": "choisisse",
      "nous": "choisissions", "vous": "choisissiez", "ils/elles": "choisissent",
    },
    "plus-que-parfait": {
      "je": "avais choisi", "tu": "avais choisi", "il/elle": "avait choisi",
      "nous": "avions choisi", "vous": "aviez choisi", "ils/elles": "avaient choisi",
    },
  },

  // ─── PARTIR ───
  "partir": {
    "présent": {
      "je": "pars", "tu": "pars", "il/elle": "part",
      "nous": "partons", "vous": "partez", "ils/elles": "partent",
    },
    "passé composé": {
      "je": "suis parti", "tu": "es parti", "il/elle": "est parti",
      "nous": "sommes partis", "vous": "êtes partis", "ils/elles": "sont partis",
    },
    "imparfait": {
      "je": "partais", "tu": "partais", "il/elle": "partait",
      "nous": "partions", "vous": "partiez", "ils/elles": "partaient",
    },
    "futur simple": {
      "je": "partirai", "tu": "partiras", "il/elle": "partira",
      "nous": "partirons", "vous": "partirez", "ils/elles": "partiront",
    },
    "conditionnel présent": {
      "je": "partirais", "tu": "partirais", "il/elle": "partirait",
      "nous": "partirions", "vous": "partiriez", "ils/elles": "partiraient",
    },
    "subjonctif présent": {
      "je": "parte", "tu": "partes", "il/elle": "parte",
      "nous": "partions", "vous": "partiez", "ils/elles": "partent",
    },
    "plus-que-parfait": {
      "je": "étais parti", "tu": "étais parti", "il/elle": "était parti",
      "nous": "étions partis", "vous": "étiez partis", "ils/elles": "étaient partis",
    },
  },

  // ─── CROIRE ───
  "croire": {
    "présent": {
      "je": "crois", "tu": "crois", "il/elle": "croit",
      "nous": "croyons", "vous": "croyez", "ils/elles": "croient",
    },
    "passé composé": {
      "je": "ai cru", "tu": "as cru", "il/elle": "a cru",
      "nous": "avons cru", "vous": "avez cru", "ils/elles": "ont cru",
    },
    "imparfait": {
      "je": "croyais", "tu": "croyais", "il/elle": "croyait",
      "nous": "croyions", "vous": "croyiez", "ils/elles": "croyaient",
    },
    "futur simple": {
      "je": "croirai", "tu": "croiras", "il/elle": "croira",
      "nous": "croirons", "vous": "croirez", "ils/elles": "croiront",
    },
    "conditionnel présent": {
      "je": "croirais", "tu": "croirais", "il/elle": "croirait",
      "nous": "croirions", "vous": "croiriez", "ils/elles": "croiraient",
    },
    "subjonctif présent": {
      "je": "croie", "tu": "croies", "il/elle": "croie",
      "nous": "croyions", "vous": "croyiez", "ils/elles": "croient",
    },
    "plus-que-parfait": {
      "je": "avais cru", "tu": "avais cru", "il/elle": "avait cru",
      "nous": "avions cru", "vous": "aviez cru", "ils/elles": "avaient cru",
    },
  },

  // ─── DORMIR ───
  "dormir": {
    "présent": {
      "je": "dors", "tu": "dors", "il/elle": "dort",
      "nous": "dormons", "vous": "dormez", "ils/elles": "dorment",
    },
    "passé composé": {
      "je": "ai dormi", "tu": "as dormi", "il/elle": "a dormi",
      "nous": "avons dormi", "vous": "avez dormi", "ils/elles": "ont dormi",
    },
    "imparfait": {
      "je": "dormais", "tu": "dormais", "il/elle": "dormait",
      "nous": "dormions", "vous": "dormiez", "ils/elles": "dormaient",
    },
    "futur simple": {
      "je": "dormirai", "tu": "dormiras", "il/elle": "dormira",
      "nous": "dormirons", "vous": "dormirez", "ils/elles": "dormiront",
    },
    "conditionnel présent": {
      "je": "dormirais", "tu": "dormirais", "il/elle": "dormirait",
      "nous": "dormirions", "vous": "dormiriez", "ils/elles": "dormiraient",
    },
    "subjonctif présent": {
      "je": "dorme", "tu": "dormes", "il/elle": "dorme",
      "nous": "dormions", "vous": "dormiez", "ils/elles": "dorment",
    },
    "plus-que-parfait": {
      "je": "avais dormi", "tu": "avais dormi", "il/elle": "avait dormi",
      "nous": "avions dormi", "vous": "aviez dormi", "ils/elles": "avaient dormi",
    },
  },

  // ─── CONNAÎTRE ───
  "connaître": {
    "présent": {
      "je": "connais", "tu": "connais", "il/elle": "connaît",
      "nous": "connaissons", "vous": "connaissez", "ils/elles": "connaissent",
    },
    "passé composé": {
      "je": "ai connu", "tu": "as connu", "il/elle": "a connu",
      "nous": "avons connu", "vous": "avez connu", "ils/elles": "ont connu",
    },
    "imparfait": {
      "je": "connaissais", "tu": "connaissais", "il/elle": "connaissait",
      "nous": "connaissions", "vous": "connaissiez", "ils/elles": "connaissaient",
    },
    "futur simple": {
      "je": "connaîtrai", "tu": "connaîtras", "il/elle": "connaîtra",
      "nous": "connaîtrons", "vous": "connaîtrez", "ils/elles": "connaîtront",
    },
    "conditionnel présent": {
      "je": "connaîtrais", "tu": "connaîtrais", "il/elle": "connaîtrait",
      "nous": "connaîtrions", "vous": "connaîtriez", "ils/elles": "connaîtraient",
    },
    "subjonctif présent": {
      "je": "connaisse", "tu": "connaisses", "il/elle": "connaisse",
      "nous": "connaissions", "vous": "connaissiez", "ils/elles": "connaissent",
    },
    "plus-que-parfait": {
      "je": "avais connu", "tu": "avais connu", "il/elle": "avait connu",
      "nous": "avions connu", "vous": "aviez connu", "ils/elles": "avaient connu",
    },
  },

  // ─── RECEVOIR ───
  "recevoir": {
    "présent": {
      "je": "reçois", "tu": "reçois", "il/elle": "reçoit",
      "nous": "recevons", "vous": "recevez", "ils/elles": "reçoivent",
    },
    "passé composé": {
      "je": "ai reçu", "tu": "as reçu", "il/elle": "a reçu",
      "nous": "avons reçu", "vous": "avez reçu", "ils/elles": "ont reçu",
    },
    "imparfait": {
      "je": "recevais", "tu": "recevais", "il/elle": "recevait",
      "nous": "recevions", "vous": "receviez", "ils/elles": "recevaient",
    },
    "futur simple": {
      "je": "recevrai", "tu": "recevras", "il/elle": "recevra",
      "nous": "recevrons", "vous": "recevrez", "ils/elles": "recevront",
    },
    "conditionnel présent": {
      "je": "recevrais", "tu": "recevrais", "il/elle": "recevrait",
      "nous": "recevrions", "vous": "recevriez", "ils/elles": "recevraient",
    },
    "subjonctif présent": {
      "je": "reçoive", "tu": "reçoives", "il/elle": "reçoive",
      "nous": "recevions", "vous": "receviez", "ils/elles": "reçoivent",
    },
    "plus-que-parfait": {
      "je": "avais reçu", "tu": "avais reçu", "il/elle": "avait reçu",
      "nous": "avions reçu", "vous": "aviez reçu", "ils/elles": "avaient reçu",
    },
  },

  // ─── OUVRIR ───
  "ouvrir": {
    "présent": {
      "je": "ouvre", "tu": "ouvres", "il/elle": "ouvre",
      "nous": "ouvrons", "vous": "ouvrez", "ils/elles": "ouvrent",
    },
    "passé composé": {
      "je": "ai ouvert", "tu": "as ouvert", "il/elle": "a ouvert",
      "nous": "avons ouvert", "vous": "avez ouvert", "ils/elles": "ont ouvert",
    },
    "imparfait": {
      "je": "ouvrais", "tu": "ouvrais", "il/elle": "ouvrait",
      "nous": "ouvrions", "vous": "ouvriez", "ils/elles": "ouvraient",
    },
    "futur simple": {
      "je": "ouvrirai", "tu": "ouvriras", "il/elle": "ouvrira",
      "nous": "ouvrirons", "vous": "ouvrirez", "ils/elles": "ouvriront",
    },
    "conditionnel présent": {
      "je": "ouvrirais", "tu": "ouvrirais", "il/elle": "ouvrirait",
      "nous": "ouvririons", "vous": "ouvririez", "ils/elles": "ouvriraient",
    },
    "subjonctif présent": {
      "je": "ouvre", "tu": "ouvres", "il/elle": "ouvre",
      "nous": "ouvrions", "vous": "ouvriez", "ils/elles": "ouvrent",
    },
    "plus-que-parfait": {
      "je": "avais ouvert", "tu": "avais ouvert", "il/elle": "avait ouvert",
      "nous": "avions ouvert", "vous": "aviez ouvert", "ils/elles": "avaient ouvert",
    },
  },

  // ─── COURIR ───
  "courir": {
    "présent": {
      "je": "cours", "tu": "cours", "il/elle": "court",
      "nous": "courons", "vous": "courez", "ils/elles": "courent",
    },
    "passé composé": {
      "je": "ai couru", "tu": "as couru", "il/elle": "a couru",
      "nous": "avons couru", "vous": "avez couru", "ils/elles": "ont couru",
    },
    "imparfait": {
      "je": "courais", "tu": "courais", "il/elle": "courait",
      "nous": "courions", "vous": "couriez", "ils/elles": "couraient",
    },
    "futur simple": {
      "je": "courrai", "tu": "courras", "il/elle": "courra",
      "nous": "courrons", "vous": "courrez", "ils/elles": "courront",
    },
    "conditionnel présent": {
      "je": "courrais", "tu": "courrais", "il/elle": "courrait",
      "nous": "courrions", "vous": "courriez", "ils/elles": "courraient",
    },
    "subjonctif présent": {
      "je": "coure", "tu": "coures", "il/elle": "coure",
      "nous": "courions", "vous": "couriez", "ils/elles": "courent",
    },
    "plus-que-parfait": {
      "je": "avais couru", "tu": "avais couru", "il/elle": "avait couru",
      "nous": "avions couru", "vous": "aviez couru", "ils/elles": "avaient couru",
    },
  },
};

// [DECISÃO] Função de lookup com fallback — verbos não mapeados retornam null, engine lida com isso
export function getConjugation(
  infinitive: string,
  tense: Tense,
  pronoun: Pronoun
): string | null {
  return CONJUGATIONS[infinitive]?.[tense]?.[pronoun] ?? null;
}

// [DECISÃO] Lista de verbos com conjugação disponível — engine só seleciona verbos que podemos validar
export function getAvailableVerbs(): Verb[] {
  return VERBS.filter((v) => v.infinitive in CONJUGATIONS);
}
