export class Symbols {
    public static readonly empty = "\u2294";
}
export class Connectives {
    public static readonly not = "\u00AC";
    public static readonly or = "\u2228";
    public static readonly and = "\u2227";
}

export const andRegex = new RegExp(`and|${Connectives.and}|&&`, "i");
export const orRegex = new RegExp(`or|${Connectives.or}|\\|\\|`, "i");
export const notRegex = new RegExp(`(not|${Connectives.not}|\!)`, "i");
export const validLitRegex = new RegExp(`^(not|${Connectives.not}|\!)?\\s*[a-z]+[0-9]*$`, "i");