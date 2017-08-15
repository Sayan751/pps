export class Symbols {
    public static readonly empty = "\u2294";
}
export enum Connectives {
    not = "\u00AC",
    or = "\u2228",
    and = "\u2227",
    implication = "\u2192"
}

export const andRegex = new RegExp(`and|${Connectives.and}|&&`, "i");
export const orRegex = new RegExp(`or|${Connectives.or}|\\|\\|`, "i");
export const notRegex = new RegExp(`(not|${Connectives.not}|\!)`, "i");
export const validLitRegex = new RegExp(`^(not|${Connectives.not}|\!)?\\s*[a-z]+[0-9]*$`, "i");

export type ClausalConnectives = Connectives.or | Connectives.and;

export enum Quantifiers {
    universal = "\u2200",
    existential = "\u2203"
}