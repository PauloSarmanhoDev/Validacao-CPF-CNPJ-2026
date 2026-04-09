const codeExamples = {

    // ─────────────────────────────────────────────
    // JAVA
    // ─────────────────────────────────────────────
    java: {
        cpf: `// Validar CPF em Java

public class CpfValidator {
    private static final int[] PESOS = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};

    public static boolean isValidCPF(String cpf) {
        cpf = cpf.replaceAll("[^\\\\d]", "");
        if (cpf.length() != 11 || cpf.matches("^(\\\\d)\\\\1*$")) return false;
        String base = cpf.substring(0, 9);
        int dv1 = calcDigito(base, PESOS);
        int dv2 = calcDigito(base + dv1, PESOS);
        return cpf.equals(base + dv1 + dv2);
    }

    private static int calcDigito(String base, int[] pesos) {
        int soma = 0, len = base.length();
        for (int i = len - 1; i >= 0; i--) {
            soma += ((int) base.charAt(i) - 48) * pesos[pesos.length - len + i];
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
}`,

        cnpj: `// Validar CNPJ Numérico em Java
// Compatível com a regra 2026 (algoritmo ASCII – funciona para numérico e alfanumérico)

public class CnpjValidator {
    private static final int[] PESOS = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    public static boolean isValidCNPJ(String cnpj) {
        cnpj = cnpj.replaceAll("[./-]", "");
        // Para CNPJ numérico: aceita somente dígitos e rejeita sequências iguais
        if (!cnpj.matches("^\\\\d{14}$") || cnpj.matches("^(\\\\d)\\\\1*$")) return false;
        String base = cnpj.substring(0, 12);
        int dv1 = calcDigito(base, PESOS);
        int dv2 = calcDigito(base + dv1, PESOS);
        return cnpj.equals(base + dv1 + dv2);
    }

    private static int calcDigito(String base, int[] pesos) {
        int soma = 0, len = base.length();
        for (int i = len - 1; i >= 0; i--) {
            soma += ((int) base.charAt(i) - 48) * pesos[pesos.length - len + i];
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
}`,

        cnpj_alpha: `// Validar CNPJ Alfanumérico em Java – Novo formato 2026
// A raiz (8 primeiros) pode conter letras A–Z e números 0–9.
// Os 2 dígitos verificadores (posições 13–14) são sempre numéricos.
// O cálculo usa o valor ASCII do caractere menos 48.

public class CnpjAlphaValidator {
    private static final int[] PESOS = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    public static boolean isValidCNPJAlpha(String cnpj) {
        cnpj = cnpj.replaceAll("[./-]", "").toUpperCase();
        // 12 chars alfanuméricos + 2 dígitos no final
        if (!cnpj.matches("^[A-Z0-9]{12}\\\\d{2}$") || cnpj.matches("^0+$")) return false;
        String base = cnpj.substring(0, 12);
        int dv1 = calcDigito(base, PESOS);
        int dv2 = calcDigito(base + dv1, PESOS);
        return cnpj.equals(base + dv1 + dv2);
    }

    // Converte cada caractere pelo valor ASCII (letra 'A' = 65, logo 65-48=17)
    private static int calcDigito(String base, int[] pesos) {
        int soma = 0, len = base.length();
        for (int i = len - 1; i >= 0; i--) {
            soma += ((int) base.charAt(i) - 48) * pesos[pesos.length - len + i];
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
}`,

        todos: `// Validação Unificada em Java (CPF + CNPJ numérico e alfanumérico)
// Detecta o tipo automaticamente pelo tamanho e composição.

public class DocumentValidator {
    private static final int[] PESOS_CPF  = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
    private static final int[] PESOS_CNPJ = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    public static boolean isValid(String doc) {
        if (doc == null) return false;
        doc = doc.replaceAll("[./-]", "").toUpperCase();

        if (doc.length() == 11 && doc.matches("^\\\\d+$")) {
            // CPF
            if (doc.matches("^(\\\\d)\\\\1*$")) return false;
            String b = doc.substring(0, 9);
            int dv1 = calc(b, PESOS_CPF);
            return doc.equals(b + dv1 + calc(b + dv1, PESOS_CPF));
        } else if (doc.length() == 14 && doc.matches("^[A-Z0-9]{12}\\\\d{2}$") && !doc.matches("^0+$")) {
            // CNPJ (numérico ou alfanumérico)
            String b = doc.substring(0, 12);
            int dv1 = calc(b, PESOS_CNPJ);
            return doc.equals(b + dv1 + calc(b + dv1, PESOS_CNPJ));
        }
        return false;
    }

    private static int calc(String base, int[] pesos) {
        int soma = 0, len = base.length();
        for (int i = len - 1; i >= 0; i--)
            soma += ((int) base.charAt(i) - 48) * pesos[pesos.length - len + i];
        return (soma % 11 < 2) ? 0 : 11 - (soma % 11);
    }
}`
    },

    // ─────────────────────────────────────────────
    // C#
    // ─────────────────────────────────────────────
    csharp: {
        cpf: `// Validar CPF em C#

using System.Text.RegularExpressions;

public static class CpfValidator {
    private static readonly int[] Pesos = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};

    public static bool IsValidCPF(string cpf) {
        cpf = Regex.Replace(cpf ?? "", @"\\D", "");
        if (cpf.Length != 11 || Regex.IsMatch(cpf, @"^(\\d)\\1*$")) return false;
        string b = cpf.Substring(0, 9);
        int dv1 = Calc(b, Pesos);
        int dv2 = Calc(b + dv1, Pesos);
        return cpf == b + dv1 + dv2;
    }

    private static int Calc(string sub, int[] p) {
        int r = 0, l = sub.Length;
        for (int i = l - 1; i >= 0; i--)
            r += ((int)sub[i] - 48) * p[p.Length - l + i];
        return r % 11 < 2 ? 0 : 11 - (r % 11);
    }
}`,

        cnpj: `// Validar CNPJ Numérico em C#
// Compatível com a regra 2026 (algoritmo ASCII)

using System.Text.RegularExpressions;

public static class CnpjValidator {
    private static readonly int[] Pesos = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    public static bool IsValidCNPJ(string cnpj) {
        cnpj = Regex.Replace(cnpj ?? "", @"[./-]", "");
        if (!Regex.IsMatch(cnpj, @"^\\d{14}$") || Regex.IsMatch(cnpj, @"^(\\d)\\1*$")) return false;
        string b = cnpj.Substring(0, 12);
        int dv1 = Calc(b, Pesos);
        int dv2 = Calc(b + dv1, Pesos);
        return cnpj == b + dv1 + dv2;
    }

    private static int Calc(string sub, int[] p) {
        int r = 0, l = sub.Length;
        for (int i = l - 1; i >= 0; i--)
            r += ((int)sub[i] - 48) * p[p.Length - l + i];
        return r % 11 < 2 ? 0 : 11 - (r % 11);
    }
}`,

        cnpj_alpha: `// Validar CNPJ Alfanumérico em C# – Novo formato 2026
// A raiz (8 primeiros caracteres) pode conter letras A–Z e números 0–9.
// Os 2 dígitos verificadores finais são sempre numéricos.
// O cálculo usa valor ASCII de cada caractere menos 48.

using System.Text.RegularExpressions;

public static class CnpjAlphaValidator {
    private static readonly int[] Pesos = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    public static bool IsValidCNPJAlpha(string cnpj) {
        cnpj = Regex.Replace(cnpj ?? "", @"[./-]", "").ToUpper();
        if (!Regex.IsMatch(cnpj, @"^[A-Z0-9]{12}\\d{2}$") || Regex.IsMatch(cnpj, @"^0+$")) return false;
        string b = cnpj.Substring(0, 12);
        int dv1 = Calc(b, Pesos);
        int dv2 = Calc(b + dv1, Pesos);
        return cnpj == b + dv1 + dv2;
    }

    private static int Calc(string sub, int[] p) {
        int r = 0, l = sub.Length;
        for (int i = l - 1; i >= 0; i--)
            r += ((int)sub[i] - 48) * p[p.Length - l + i];
        return r % 11 < 2 ? 0 : 11 - (r % 11);
    }
}`,

        todos: `// Validação Unificada em C# (CPF + CNPJ numérico e alfanumérico)
// Detecta o tipo automaticamente pelo tamanho e composição.

using System.Text.RegularExpressions;

public static class DocumentValidator {
    private static readonly int[] PesosCPF  = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
    private static readonly int[] PesosCNPJ = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    public static bool IsValid(string doc) {
        if (string.IsNullOrWhiteSpace(doc)) return false;
        doc = Regex.Replace(doc, @"[./-]", "").ToUpper();

        if (doc.Length == 11 && Regex.IsMatch(doc, @"^\\d+$")) {
            if (Regex.IsMatch(doc, @"^(\\d)\\1*$")) return false;
            string b = doc.Substring(0, 9);
            int dv1 = Calc(b, PesosCPF);
            return doc == b + dv1 + Calc(b + dv1, PesosCPF);
        } else if (doc.Length == 14 && Regex.IsMatch(doc, @"^[A-Z0-9]{12}\\d{2}$") && !Regex.IsMatch(doc, @"^0+$")) {
            string b = doc.Substring(0, 12);
            int dv1 = Calc(b, PesosCNPJ);
            return doc == b + dv1 + Calc(b + dv1, PesosCNPJ);
        }
        return false;
    }

    private static int Calc(string sub, int[] p) {
        int r = 0, l = sub.Length;
        for (int i = l - 1; i >= 0; i--)
            r += ((int)sub[i] - 48) * p[p.Length - l + i];
        return r % 11 < 2 ? 0 : 11 - (r % 11);
    }
}`
    },

    // ─────────────────────────────────────────────
    // JAVASCRIPT
    // ─────────────────────────────────────────────
    js: {
        cpf: `// Validar CPF em JavaScript

const PESOS_CPF = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

function calcDV(base, pesos) {
    let soma = 0;
    for (let i = base.length - 1; i >= 0; i--) {
        soma += (base.charCodeAt(i) - 48) * pesos[pesos.length - base.length + i];
    }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
}

export function isValidCPF(cpf) {
    cpf = cpf.replace(/\\D/g, '');
    if (cpf.length !== 11 || /^(\\d)\\1+$/.test(cpf)) return false;
    const base = cpf.substring(0, 9);
    const dv1 = calcDV(base, PESOS_CPF);
    const dv2 = calcDV(base + dv1, PESOS_CPF);
    return cpf === base + dv1 + dv2;
}`,

        cnpj: `// Validar CNPJ Numérico em JavaScript
// Compatível com a regra 2026 (algoritmo ASCII)

const PESOS_CNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcDV(base, pesos) {
    let soma = 0;
    for (let i = base.length - 1; i >= 0; i--) {
        soma += (base.charCodeAt(i) - 48) * pesos[pesos.length - base.length + i];
    }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
}

export function isValidCNPJ(cnpj) {
    cnpj = cnpj.replace(/[./-]/g, '');
    if (!/^\\d{14}$/.test(cnpj) || /^(\\d)\\1+$/.test(cnpj)) return false;
    const base = cnpj.substring(0, 12);
    const dv1 = calcDV(base, PESOS_CNPJ);
    const dv2 = calcDV(base + dv1, PESOS_CNPJ);
    return cnpj === base + dv1 + dv2;
}`,

        cnpj_alpha: `// Validar CNPJ Alfanumérico em JavaScript – Novo formato 2026
// A raiz (8 primeiros) pode conter letras A–Z e números 0–9.
// Os 2 dígitos verificadores são sempre numéricos.
// O cálculo usa charCodeAt(i) - 48 para converter cada char.

const PESOS_CNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcDV(base, pesos) {
    let soma = 0;
    for (let i = base.length - 1; i >= 0; i--) {
        soma += (base.charCodeAt(i) - 48) * pesos[pesos.length - base.length + i];
    }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
}

export function isValidCNPJAlpha(cnpj) {
    cnpj = cnpj.replace(/[./-]/g, '').toUpperCase();
    // 12 posições alfanuméricas + 2 dígitos verificadores numéricos
    if (!/^[A-Z0-9]{12}\\d{2}$/.test(cnpj) || /^0+$/.test(cnpj)) return false;
    const base = cnpj.substring(0, 12);
    const dv1 = calcDV(base, PESOS_CNPJ);
    const dv2 = calcDV(base + dv1, PESOS_CNPJ);
    return cnpj === base + dv1 + dv2;
}`,

        todos: `// Validação Unificada em JavaScript (CPF + CNPJ numérico e alfanumérico)
// Detecta o tipo automaticamente pelo tamanho e composição.

const PESOS_CPF  = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcDV(base, pesos) {
    let soma = 0;
    for (let i = base.length - 1; i >= 0; i--) {
        soma += (base.charCodeAt(i) - 48) * pesos[pesos.length - base.length + i];
    }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
}

export function isValidDocument(doc) {
    if (!doc) return false;
    doc = doc.replace(/[./-]/g, '').toUpperCase();

    if (doc.length === 11 && /^\\d+$/.test(doc)) {
        // CPF
        if (/^(\\d)\\1+$/.test(doc)) return false;
        const b = doc.substring(0, 9);
        const dv1 = calcDV(b, PESOS_CPF);
        return doc === b + dv1 + calcDV(b + dv1, PESOS_CPF);
    } else if (doc.length === 14 && /^[A-Z0-9]{12}\\d{2}$/.test(doc) && !/^0+$/.test(doc)) {
        // CNPJ (numérico ou alfanumérico)
        const b = doc.substring(0, 12);
        const dv1 = calcDV(b, PESOS_CNPJ);
        return doc === b + dv1 + calcDV(b + dv1, PESOS_CNPJ);
    }
    return false;
}`
    },

    // ─────────────────────────────────────────────
    // TYPESCRIPT
    // ─────────────────────────────────────────────
    ts: {
        cpf: `// Validar CPF em TypeScript

const PESOS_CPF: number[] = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

function calcDV(base: string, pesos: number[]): number {
    let soma = 0;
    for (let i = base.length - 1; i >= 0; i--) {
        soma += (base.charCodeAt(i) - 48) * pesos[pesos.length - base.length + i];
    }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
}

export function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/\\D/g, '');
    if (cpf.length !== 11 || /^(\\d)\\1+$/.test(cpf)) return false;
    const base = cpf.substring(0, 9);
    const dv1 = calcDV(base, PESOS_CPF);
    const dv2 = calcDV(base + dv1, PESOS_CPF);
    return cpf === base + dv1 + dv2;
}`,

        cnpj: `// Validar CNPJ Numérico em TypeScript
// Compatível com a regra 2026 (algoritmo ASCII)

const PESOS_CNPJ: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcDV(base: string, pesos: number[]): number {
    let soma = 0;
    for (let i = base.length - 1; i >= 0; i--) {
        soma += (base.charCodeAt(i) - 48) * pesos[pesos.length - base.length + i];
    }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
}

export function isValidCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[./-]/g, '');
    if (!/^\\d{14}$/.test(cnpj) || /^(\\d)\\1+$/.test(cnpj)) return false;
    const base = cnpj.substring(0, 12);
    const dv1 = calcDV(base, PESOS_CNPJ);
    const dv2 = calcDV(base + dv1, PESOS_CNPJ);
    return cnpj === base + dv1 + dv2;
}`,

        cnpj_alpha: `// Validar CNPJ Alfanumérico em TypeScript – Novo formato 2026
// A raiz (8 primeiros) pode conter letras A–Z e números 0–9.
// Os 2 dígitos verificadores são sempre numéricos.
// O cálculo usa charCodeAt(i) - 48 para converter cada char.

const PESOS_CNPJ: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcDV(base: string, pesos: number[]): number {
    let soma = 0;
    for (let i = base.length - 1; i >= 0; i--) {
        soma += (base.charCodeAt(i) - 48) * pesos[pesos.length - base.length + i];
    }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
}

export function isValidCNPJAlpha(cnpj: string): boolean {
    cnpj = cnpj.replace(/[./-]/g, '').toUpperCase();
    if (!/^[A-Z0-9]{12}\\d{2}$/.test(cnpj) || /^0+$/.test(cnpj)) return false;
    const base = cnpj.substring(0, 12);
    const dv1 = calcDV(base, PESOS_CNPJ);
    const dv2 = calcDV(base + dv1, PESOS_CNPJ);
    return cnpj === base + dv1 + dv2;
}`,

        todos: `// Validação Unificada em TypeScript (CPF + CNPJ numérico e alfanumérico)
// Detecta o tipo automaticamente pelo tamanho e composição.

const PESOS_CPF: number[]  = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcDV(base: string, pesos: number[]): number {
    let soma = 0;
    for (let i = base.length - 1; i >= 0; i--) {
        soma += (base.charCodeAt(i) - 48) * pesos[pesos.length - base.length + i];
    }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
}

export function isValidDocument(doc: string): boolean {
    if (!doc) return false;
    doc = doc.replace(/[./-]/g, '').toUpperCase();

    if (doc.length === 11 && /^\\d+$/.test(doc)) {
        if (/^(\\d)\\1+$/.test(doc)) return false;
        const b = doc.substring(0, 9);
        const dv1 = calcDV(b, PESOS_CPF);
        return doc === b + dv1 + calcDV(b + dv1, PESOS_CPF);
    } else if (doc.length === 14 && /^[A-Z0-9]{12}\\d{2}$/.test(doc) && !/^0+$/.test(doc)) {
        const b = doc.substring(0, 12);
        const dv1 = calcDV(b, PESOS_CNPJ);
        return doc === b + dv1 + calcDV(b + dv1, PESOS_CNPJ);
    }
    return false;
}`
    },

    // ─────────────────────────────────────────────
    // RUST
    // ─────────────────────────────────────────────
    rust: {
        cpf: `// Validar CPF em Rust

const PESOS_CPF: &[u32] = &[11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

fn calc_dv(base: &str, pesos: &[u32]) -> u32 {
    let bytes = base.as_bytes();
    let soma: u32 = bytes.iter().enumerate()
        .map(|(i, &b)| (b as u32 - 48) * pesos[pesos.len() - bytes.len() + i])
        .sum();
    match soma % 11 { 0 | 1 => 0, r => 11 - r }
}

pub fn is_valid_cpf(cpf: &str) -> bool {
    let clean: String = cpf.chars().filter(|c| c.is_ascii_digit()).collect();
    if clean.len() != 11 { return false; }
    if clean.chars().collect::<std::collections::HashSet<_>>().len() == 1 { return false; }
    let base = &clean[..9];
    let dv1 = calc_dv(base, PESOS_CPF);
    let tmp  = format!("{}{}", base, dv1);
    let dv2  = calc_dv(&tmp, PESOS_CPF);
    clean == format!("{}{}{}", base, dv1, dv2)
}`,

        cnpj: `// Validar CNPJ Numérico em Rust
// Compatível com a regra 2026 (algoritmo ASCII)

const PESOS_CNPJ: &[u32] = &[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

fn calc_dv(base: &str, pesos: &[u32]) -> u32 {
    let bytes = base.as_bytes();
    let soma: u32 = bytes.iter().enumerate()
        .map(|(i, &b)| (b as u32 - 48) * pesos[pesos.len() - bytes.len() + i])
        .sum();
    match soma % 11 { 0 | 1 => 0, r => 11 - r }
}

pub fn is_valid_cnpj(cnpj: &str) -> bool {
    let clean: String = cnpj.chars().filter(|c| *c != '.' && *c != '/' && *c != '-').collect();
    if clean.len() != 14 || !clean.chars().all(|c| c.is_ascii_digit()) { return false; }
    if clean.chars().collect::<std::collections::HashSet<_>>().len() == 1 { return false; }
    let base = &clean[..12];
    let dv1  = calc_dv(base, PESOS_CNPJ);
    let tmp  = format!("{}{}", base, dv1);
    let dv2  = calc_dv(&tmp, PESOS_CNPJ);
    clean == format!("{}{}{}", base, dv1, dv2)
}`,

        cnpj_alpha: `// Validar CNPJ Alfanumérico em Rust – Novo formato 2026
// A raiz (8 primeiros) pode conter letras A–Z e números 0–9.
// Os 2 dígitos verificadores são sempre numéricos.
// O cálculo usa o valor byte (ASCII) menos 48.

const PESOS_CNPJ: &[u32] = &[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

fn calc_dv(base: &str, pesos: &[u32]) -> u32 {
    let bytes = base.as_bytes();
    let soma: u32 = bytes.iter().enumerate()
        .map(|(i, &b)| (b as u32 - 48) * pesos[pesos.len() - bytes.len() + i])
        .sum();
    match soma % 11 { 0 | 1 => 0, r => 11 - r }
}

pub fn is_valid_cnpj_alpha(cnpj: &str) -> bool {
    let clean: String = cnpj.replace(&['.', '/', '-'][..], "").to_uppercase();
    if clean.len() != 14 { return false; }
    // Últimos 2 devem ser dígitos; os 12 primeiros alfanuméricos
    let base = &clean[..12];
    let dvs  = &clean[12..];
    if !base.chars().all(|c| c.is_ascii_alphanumeric()) { return false; }
    if !dvs.chars().all(|c| c.is_ascii_digit()) { return false; }
    if clean.as_bytes().iter().all(|&b| b == clean.as_bytes()[0]) { return false; }
    let dv1 = calc_dv(base, PESOS_CNPJ);
    let tmp  = format!("{}{}", base, dv1);
    let dv2  = calc_dv(&tmp, PESOS_CNPJ);
    clean == format!("{}{}{}", base, dv1, dv2)
}`,

        todos: `// Validação Unificada em Rust (CPF + CNPJ numérico e alfanumérico)
// Detecta o tipo automaticamente pelo tamanho e composição.

const PESOS_CPF:  &[u32] = &[11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ: &[u32] = &[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

fn calc_dv(base: &str, pesos: &[u32]) -> u32 {
    let bytes = base.as_bytes();
    let soma: u32 = bytes.iter().enumerate()
        .map(|(i, &b)| (b as u32 - 48) * pesos[pesos.len() - bytes.len() + i])
        .sum();
    match soma % 11 { 0 | 1 => 0, r => 11 - r }
}

pub fn is_valid_document(doc: &str) -> bool {
    let clean = doc.replace(&['.', '/', '-'][..], "").to_uppercase();

    if clean.len() == 11 && clean.chars().all(|c| c.is_ascii_digit()) {
        // CPF
        if clean.chars().collect::<std::collections::HashSet<_>>().len() == 1 { return false; }
        let base = &clean[..9];
        let dv1  = calc_dv(base, PESOS_CPF);
        let tmp  = format!("{}{}", base, dv1);
        return clean == format!("{}{}{}", base, dv1, calc_dv(&tmp, PESOS_CPF));
    } else if clean.len() == 14 {
        // CNPJ (numérico ou alfanumérico)
        let base = &clean[..12];
        let dvs  = &clean[12..];
        if !base.chars().all(|c| c.is_ascii_alphanumeric()) { return false; }
        if !dvs.chars().all(|c| c.is_ascii_digit()) { return false; }
        let dv1 = calc_dv(base, PESOS_CNPJ);
        let tmp  = format!("{}{}", base, dv1);
        return clean == format!("{}{}{}", base, dv1, calc_dv(&tmp, PESOS_CNPJ));
    }
    false
}`
    },

    // ─────────────────────────────────────────────
    // GO
    // ─────────────────────────────────────────────
    go: {
        cpf: `// Validar CPF em Go (Golang)

package validator

import (
\t"regexp"
\t"strconv"
)

var pesosCPF = []int{11, 10, 9, 8, 7, 6, 5, 4, 3, 2}

func calcDV(base string, pesos []int) int {
\tsoma := 0
\tl := len(base)
\tfor i := l - 1; i >= 0; i-- {
\t\tsoma += (int(base[i]) - 48) * pesos[len(pesos)-l+i]
\t}
\tr := soma % 11
\tif r < 2 { return 0 }
\treturn 11 - r
}

func IsValidCPF(cpf string) bool {
\tre := regexp.MustCompile(\`\\D\`)
\tclean := re.ReplaceAllString(cpf, "")
\tif len(clean) != 11 { return false }

\t// Rejeitar sequências como 111.111.111-11
\tallSame := true
\tfor i := 1; i < len(clean); i++ {
\t\tif clean[i] != clean[0] { allSame = false; break }
\t}
\tif allSame { return false }

\tbase := clean[:9]
\tdv1  := calcDV(base, pesosCPF)
\tdv2  := calcDV(base+strconv.Itoa(dv1), pesosCPF)
\treturn clean == base+strconv.Itoa(dv1)+strconv.Itoa(dv2)
}`,

        cnpj: `// Validar CNPJ Numérico em Go (Golang)
// Compatível com a regra 2026 (algoritmo ASCII)

package validator

import (
\t"regexp"
\t"strconv"
)

var pesosCNPJ = []int{6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}

func calcDV(base string, pesos []int) int {
\tsoma := 0
\tl := len(base)
\tfor i := l - 1; i >= 0; i-- {
\t\tsoma += (int(base[i]) - 48) * pesos[len(pesos)-l+i]
\t}
\tr := soma % 11
\tif r < 2 { return 0 }
\treturn 11 - r
}

func IsValidCNPJ(cnpj string) bool {
\tre := regexp.MustCompile(\`[./-]\`)
\tclean := re.ReplaceAllString(cnpj, "")
\tif len(clean) != 14 { return false }

\t// Verificar se é todo numérico
\tonlyDigits := regexp.MustCompile(\`^\\d{14}$\`)
\tif !onlyDigits.MatchString(clean) { return false }

\tbase := clean[:12]
\tdv1  := calcDV(base, pesosCNPJ)
\tdv2  := calcDV(base+strconv.Itoa(dv1), pesosCNPJ)
\treturn clean == base+strconv.Itoa(dv1)+strconv.Itoa(dv2)
}`,

        cnpj_alpha: `// Validar CNPJ Alfanumérico em Go – Novo formato 2026
// A raiz (8 primeiros) pode conter letras A–Z e números 0–9.
// Os 2 dígitos verificadores são sempre numéricos.
// O cálculo usa o valor byte (ASCII) menos 48.

package validator

import (
\t"regexp"
\t"strconv"
\t"strings"
)

var pesosCNPJ = []int{6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}

func calcDV(base string, pesos []int) int {
\tsoma := 0
\tl := len(base)
\tfor i := l - 1; i >= 0; i-- {
\t\tsoma += (int(base[i]) - 48) * pesos[len(pesos)-l+i]
\t}
\tr := soma % 11
\tif r < 2 { return 0 }
\treturn 11 - r
}

func IsValidCNPJAlpha(cnpj string) bool {
\tre := regexp.MustCompile(\`[./-]\`)
\tclean := strings.ToUpper(re.ReplaceAllString(cnpj, ""))
\tif len(clean) != 14 { return false }

\t// 12 alfanuméricos + 2 dígitos
\talphaNum := regexp.MustCompile(\`^[A-Z0-9]{12}\\d{2}$\`)
\tif !alphaNum.MatchString(clean) { return false }

\tbase := clean[:12]
\tdv1  := calcDV(base, pesosCNPJ)
\tdv2  := calcDV(base+strconv.Itoa(dv1), pesosCNPJ)
\treturn clean == base+strconv.Itoa(dv1)+strconv.Itoa(dv2)
}`,

        todos: `// Validação Unificada em Go (CPF + CNPJ numérico e alfanumérico)
// Detecta o tipo automaticamente pelo tamanho e composição.

package validator

import (
\t"regexp"
\t"strconv"
\t"strings"
)

var pesosCPF  = []int{11, 10, 9, 8, 7, 6, 5, 4, 3, 2}
var pesosCNPJ = []int{6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}

func calcDV(base string, pesos []int) int {
\tsoma := 0
\tl := len(base)
\tfor i := l - 1; i >= 0; i-- {
\t\tsoma += (int(base[i]) - 48) * pesos[len(pesos)-l+i]
\t}
\tr := soma % 11
\tif r < 2 { return 0 }
\treturn 11 - r
}

func IsValidDocument(doc string) bool {
\tre := regexp.MustCompile(\`[./-]\`)
\tclean := strings.ToUpper(re.ReplaceAllString(doc, ""))

\tif len(clean) == 11 {
\t\t// CPF
\t\tif !regexp.MustCompile(\`^\\d{11}$\`).MatchString(clean) { return false }
\t\tb := clean[:9]
\t\tdv1 := calcDV(b, pesosCPF)
\t\treturn clean == b+strconv.Itoa(dv1)+strconv.Itoa(calcDV(b+strconv.Itoa(dv1), pesosCPF))
\t} else if len(clean) == 14 {
\t\t// CNPJ (numérico ou alfanumérico)
\t\tif !regexp.MustCompile(\`^[A-Z0-9]{12}\\d{2}$\`).MatchString(clean) { return false }
\t\tb := clean[:12]
\t\tdv1 := calcDV(b, pesosCNPJ)
\t\treturn clean == b+strconv.Itoa(dv1)+strconv.Itoa(calcDV(b+strconv.Itoa(dv1), pesosCNPJ))
\t}
\treturn false
}`
    },

    // ─────────────────────────────────────────────
    // SWIFT
    // ─────────────────────────────────────────────
    swift: {
        cpf: `// Validar CPF em Swift

import Foundation

let pesosCPF = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]

func calcDV(_ base: String, _ pesos: [Int]) -> Int {
    let chars = Array(base.unicodeScalars)
    var soma = 0
    for i in 0..<chars.count {
        soma += (Int(chars[i].value) - 48) * pesos[pesos.count - chars.count + i]
    }
    let r = soma % 11
    return r < 2 ? 0 : 11 - r
}

func isValidCPF(_ cpf: String) -> Bool {
    let clean = cpf.replacingOccurrences(of: "\\D", with: "", options: .regularExpression)
    guard clean.count == 11 else { return false }
    let set = Set(clean)
    guard set.count > 1 else { return false } // rejeita "11111111111"
    let base = String(clean.prefix(9))
    let dv1  = calcDV(base, pesosCPF)
    let dv2  = calcDV(base + "\\(dv1)", pesosCPF)
    return clean == "\\(base)\\(dv1)\\(dv2)"
}`,

        cnpj: `// Validar CNPJ Numérico em Swift
// Compatível com a regra 2026 (algoritmo ASCII)

import Foundation

let pesosCNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

func calcDV(_ base: String, _ pesos: [Int]) -> Int {
    let chars = Array(base.unicodeScalars)
    var soma = 0
    for i in 0..<chars.count {
        soma += (Int(chars[i].value) - 48) * pesos[pesos.count - chars.count + i]
    }
    let r = soma % 11
    return r < 2 ? 0 : 11 - r
}

func isValidCNPJ(_ cnpj: String) -> Bool {
    let clean = cnpj.replacingOccurrences(of: "[./-]", with: "", options: .regularExpression)
    guard clean.count == 14,
          clean.range(of: "^\\\\d{14}$", options: .regularExpression) != nil else { return false }
    let base = String(clean.prefix(12))
    let dv1  = calcDV(base, pesosCNPJ)
    let dv2  = calcDV(base + "\\(dv1)", pesosCNPJ)
    return clean == "\\(base)\\(dv1)\\(dv2)"
}`,

        cnpj_alpha: `// Validar CNPJ Alfanumérico em Swift – Novo formato 2026
// A raiz (8 primeiros) pode conter letras A–Z e números 0–9.
// Os 2 dígitos verificadores são sempre numéricos.
// O cálculo usa o valor Unicode scalar menos 48.

import Foundation

let pesosCNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

func calcDV(_ base: String, _ pesos: [Int]) -> Int {
    let chars = Array(base.unicodeScalars)
    var soma = 0
    for i in 0..<chars.count {
        soma += (Int(chars[i].value) - 48) * pesos[pesos.count - chars.count + i]
    }
    let r = soma % 11
    return r < 2 ? 0 : 11 - r
}

func isValidCNPJAlpha(_ cnpj: String) -> Bool {
    let clean = cnpj
        .replacingOccurrences(of: "[./-]", with: "", options: .regularExpression)
        .uppercased()
    guard clean.count == 14,
          clean.range(of: "^[A-Z0-9]{12}\\\\d{2}$", options: .regularExpression) != nil
    else { return false }

    let base = String(clean.prefix(12))
    let dv1  = calcDV(base, pesosCNPJ)
    let dv2  = calcDV(base + "\\(dv1)", pesosCNPJ)
    return clean == "\\(base)\\(dv1)\\(dv2)"
}`,

        todos: `// Validação Unificada em Swift (CPF + CNPJ numérico e alfanumérico)
// Detecta o tipo automaticamente pelo tamanho e composição.

import Foundation

let pesosCPF  = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
let pesosCNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

func calcDV(_ base: String, _ pesos: [Int]) -> Int {
    let chars = Array(base.unicodeScalars)
    var soma = 0
    for i in 0..<chars.count {
        soma += (Int(chars[i].value) - 48) * pesos[pesos.count - chars.count + i]
    }
    let r = soma % 11
    return r < 2 ? 0 : 11 - r
}

func isValidDocument(_ doc: String) -> Bool {
    let clean = doc
        .replacingOccurrences(of: "[./-]", with: "", options: .regularExpression)
        .uppercased()

    if clean.count == 11,
       clean.range(of: "^\\\\d+$", options: .regularExpression) != nil {
        // CPF
        guard Set(clean).count > 1 else { return false }
        let b   = String(clean.prefix(9))
        let dv1 = calcDV(b, pesosCPF)
        return clean == "\\(b)\\(dv1)\\(calcDV(b + "\\(dv1)", pesosCPF))"
    } else if clean.count == 14,
              clean.range(of: "^[A-Z0-9]{12}\\\\d{2}$", options: .regularExpression) != nil {
        // CNPJ (numérico ou alfanumérico)
        let b   = String(clean.prefix(12))
        let dv1 = calcDV(b, pesosCNPJ)
        return clean == "\\(b)\\(dv1)\\(calcDV(b + "\\(dv1)", pesosCNPJ))"
    }
    return false
}`
    },

    // ─────────────────────────────────────────────
    // KOTLIN
    // ─────────────────────────────────────────────
    kotlin: {
        cpf: `// Validar CPF em Kotlin

val PESOS_CPF = intArrayOf(11, 10, 9, 8, 7, 6, 5, 4, 3, 2)

fun calcDV(base: String, pesos: IntArray): Int {
    var soma = 0
    for (i in base.indices.reversed())
        soma += (base[i].code - 48) * pesos[pesos.size - base.length + i]
    val r = soma % 11
    return if (r < 2) 0 else 11 - r
}

fun isValidCPF(cpf: String): Boolean {
    val clean = cpf.replace(Regex("\\\\D"), "")
    if (clean.length != 11 || clean.all { it == clean[0] }) return false
    val base = clean.substring(0, 9)
    val dv1  = calcDV(base, PESOS_CPF)
    val dv2  = calcDV(base + dv1, PESOS_CPF)
    return clean == base + dv1 + dv2
}`,

        cnpj: `// Validar CNPJ Numérico em Kotlin
// Compatível com a regra 2026 (algoritmo ASCII)

val PESOS_CNPJ = intArrayOf(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2)

fun calcDV(base: String, pesos: IntArray): Int {
    var soma = 0
    for (i in base.indices.reversed())
        soma += (base[i].code - 48) * pesos[pesos.size - base.length + i]
    val r = soma % 11
    return if (r < 2) 0 else 11 - r
}

fun isValidCNPJ(cnpj: String): Boolean {
    val clean = cnpj.replace(Regex("[./-]"), "")
    if (!clean.matches(Regex("^\\\\d{14}$")) || clean.all { it == clean[0] }) return false
    val base = clean.substring(0, 12)
    val dv1  = calcDV(base, PESOS_CNPJ)
    val dv2  = calcDV(base + dv1, PESOS_CNPJ)
    return clean == base + dv1 + dv2
}`,

        cnpj_alpha: `// Validar CNPJ Alfanumérico em Kotlin – Novo formato 2026
// A raiz (8 primeiros) pode conter letras A–Z e números 0–9.
// Os 2 dígitos verificadores são sempre numéricos.
// O cálculo usa Char.code - 48 para converter cada caractere.

val PESOS_CNPJ = intArrayOf(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2)

fun calcDV(base: String, pesos: IntArray): Int {
    var soma = 0
    for (i in base.indices.reversed())
        soma += (base[i].code - 48) * pesos[pesos.size - base.length + i]
    val r = soma % 11
    return if (r < 2) 0 else 11 - r
}

fun isValidCNPJAlpha(cnpj: String): Boolean {
    val clean = cnpj.replace(Regex("[./-]"), "").uppercase()
    // 12 alfanuméricos + 2 dígitos verificadores
    if (!clean.matches(Regex("^[A-Z0-9]{12}\\\\d{2}$"))) return false
    val base = clean.substring(0, 12)
    val dv1  = calcDV(base, PESOS_CNPJ)
    val dv2  = calcDV(base + dv1, PESOS_CNPJ)
    return clean == base + dv1 + dv2
}`,

        todos: `// Validação Unificada em Kotlin (CPF + CNPJ numérico e alfanumérico)
// Detecta o tipo automaticamente pelo tamanho e composição.

val PESOS_CPF  = intArrayOf(11, 10, 9, 8, 7, 6, 5, 4, 3, 2)
val PESOS_CNPJ = intArrayOf(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2)

fun calcDV(base: String, pesos: IntArray): Int {
    var soma = 0
    for (i in base.indices.reversed())
        soma += (base[i].code - 48) * pesos[pesos.size - base.length + i]
    val r = soma % 11
    return if (r < 2) 0 else 11 - r
}

fun isValidDocument(doc: String): Boolean {
    val clean = doc.replace(Regex("[./-]"), "").uppercase()
    return when {
        clean.length == 11 && clean.matches(Regex("^\\\\d+$")) -> {
            // CPF
            if (clean.all { it == clean[0] }) return false
            val b   = clean.substring(0, 9)
            val dv1 = calcDV(b, PESOS_CPF)
            clean == b + dv1 + calcDV(b + dv1, PESOS_CPF)
        }
        clean.length == 14 && clean.matches(Regex("^[A-Z0-9]{12}\\\\d{2}$")) -> {
            // CNPJ (numérico ou alfanumérico)
            val b   = clean.substring(0, 12)
            val dv1 = calcDV(b, PESOS_CNPJ)
            clean == b + dv1 + calcDV(b + dv1, PESOS_CNPJ)
        }
        else -> false
    }
}`
    },

    // ─────────────────────────────────────────────
    // SQL (PostgreSQL / PL/pgSQL)
    // ─────────────────────────────────────────────
    sql: {
        cpf: `-- Validar CPF em PL/pgSQL (PostgreSQL)

CREATE OR REPLACE FUNCTION calc_dv(base_str VARCHAR, pesos INT[]) RETURNS INT AS $$
DECLARE
    soma INT := 0; i INT; val INT;
BEGIN
    FOR i IN 1..length(base_str) LOOP
        val  := ascii(substring(base_str FROM i FOR 1)) - 48;
        soma := soma + val * pesos[array_length(pesos,1) - length(base_str) + i];
    END LOOP;
    RETURN CASE WHEN (soma % 11) < 2 THEN 0 ELSE 11 - (soma % 11) END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION is_valid_cpf(cpf VARCHAR) RETURNS BOOLEAN AS $$
DECLARE
    clean  VARCHAR := regexp_replace(cpf, '\\D', '', 'g');
    base   VARCHAR;
    dv1    INT;
    dv2    INT;
BEGIN
    IF length(clean) != 11 THEN RETURN FALSE; END IF;
    -- Rejeitar sequências iguais (ex.: 111.111.111-11)
    IF clean ~ '^(.)\\1*$' THEN RETURN FALSE; END IF;
    base := substring(clean, 1, 9);
    dv1  := calc_dv(base, ARRAY[11,10,9,8,7,6,5,4,3,2]);
    dv2  := calc_dv(base || dv1::text, ARRAY[11,10,9,8,7,6,5,4,3,2]);
    RETURN clean = base || dv1::text || dv2::text;
END;
$$ LANGUAGE plpgsql IMMUTABLE;`,

        cnpj: `-- Validar CNPJ Numérico em PL/pgSQL (PostgreSQL)
-- Compatível com a regra 2026 (algoritmo ASCII)

CREATE OR REPLACE FUNCTION calc_dv(base_str VARCHAR, pesos INT[]) RETURNS INT AS $$
DECLARE
    soma INT := 0; i INT; val INT;
BEGIN
    FOR i IN 1..length(base_str) LOOP
        val  := ascii(substring(base_str FROM i FOR 1)) - 48;
        soma := soma + val * pesos[array_length(pesos,1) - length(base_str) + i];
    END LOOP;
    RETURN CASE WHEN (soma % 11) < 2 THEN 0 ELSE 11 - (soma % 11) END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION is_valid_cnpj(cnpj VARCHAR) RETURNS BOOLEAN AS $$
DECLARE
    clean  VARCHAR := regexp_replace(cnpj, '[./-]', '', 'g');
    base   VARCHAR;
    dv1    INT;
    dv2    INT;
BEGIN
    IF length(clean) != 14 THEN RETURN FALSE; END IF;
    IF clean !~ '^\\d{14}$' THEN RETURN FALSE; END IF;
    IF clean ~ '^(.)\\1*$'  THEN RETURN FALSE; END IF;
    base := substring(clean, 1, 12);
    dv1  := calc_dv(base, ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2]);
    dv2  := calc_dv(base || dv1::text, ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2]);
    RETURN clean = base || dv1::text || dv2::text;
END;
$$ LANGUAGE plpgsql IMMUTABLE;`,

        cnpj_alpha: `-- Validar CNPJ Alfanumérico em PL/pgSQL – Novo formato 2026
-- A raiz (12 primeiros, sendo 8 raiz + 4 filial) pode conter A–Z e 0–9.
-- Os 2 dígitos verificadores (posições 13–14) são sempre numéricos.
-- O cálculo usa ASCII de cada caractere menos 48.

CREATE OR REPLACE FUNCTION calc_dv(base_str VARCHAR, pesos INT[]) RETURNS INT AS $$
DECLARE
    soma INT := 0; i INT; val INT;
BEGIN
    FOR i IN 1..length(base_str) LOOP
        val  := ascii(substring(base_str FROM i FOR 1)) - 48;
        soma := soma + val * pesos[array_length(pesos,1) - length(base_str) + i];
    END LOOP;
    RETURN CASE WHEN (soma % 11) < 2 THEN 0 ELSE 11 - (soma % 11) END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION is_valid_cnpj_alpha(cnpj VARCHAR) RETURNS BOOLEAN AS $$
DECLARE
    clean  VARCHAR := upper(regexp_replace(cnpj, '[./-]', '', 'g'));
    base   VARCHAR;
    dv1    INT;
    dv2    INT;
BEGIN
    IF length(clean) != 14 THEN RETURN FALSE; END IF;
    -- 12 alfanuméricos + 2 dígitos
    IF clean !~ '^[A-Z0-9]{12}[0-9]{2}$' THEN RETURN FALSE; END IF;
    base := substring(clean, 1, 12);
    dv1  := calc_dv(base, ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2]);
    dv2  := calc_dv(base || dv1::text, ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2]);
    RETURN clean = base || dv1::text || dv2::text;
END;
$$ LANGUAGE plpgsql IMMUTABLE;`,

        todos: `-- Validação Unificada em PL/pgSQL (CPF + CNPJ numérico e alfanumérico)
-- Detecta o tipo automaticamente pelo tamanho e composição.

CREATE OR REPLACE FUNCTION calc_dv(base_str VARCHAR, pesos INT[]) RETURNS INT AS $$
DECLARE
    soma INT := 0; i INT; val INT;
BEGIN
    FOR i IN 1..length(base_str) LOOP
        val  := ascii(substring(base_str FROM i FOR 1)) - 48;
        soma := soma + val * pesos[array_length(pesos,1) - length(base_str) + i];
    END LOOP;
    RETURN CASE WHEN (soma % 11) < 2 THEN 0 ELSE 11 - (soma % 11) END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION is_valid_document(doc VARCHAR) RETURNS BOOLEAN AS $$
DECLARE
    clean    VARCHAR := upper(regexp_replace(doc, '[./-]', '', 'g'));
    base_str VARCHAR;
    dv1      INT;
    dv2      INT;
BEGIN
    IF length(clean) = 11 AND clean ~ '^\\d+$' THEN
        -- CPF
        IF clean ~ '^(.)\\1*$' THEN RETURN FALSE; END IF;
        base_str := substring(clean, 1, 9);
        dv1 := calc_dv(base_str, ARRAY[11,10,9,8,7,6,5,4,3,2]);
        dv2 := calc_dv(base_str || dv1::text, ARRAY[11,10,9,8,7,6,5,4,3,2]);
        RETURN clean = base_str || dv1::text || dv2::text;

    ELSIF length(clean) = 14 AND clean ~ '^[A-Z0-9]{12}[0-9]{2}$' THEN
        -- CNPJ (numérico ou alfanumérico)
        base_str := substring(clean, 1, 12);
        dv1 := calc_dv(base_str, ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2]);
        dv2 := calc_dv(base_str || dv1::text, ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2]);
        RETURN clean = base_str || dv1::text || dv2::text;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;`
    },

    // ─────────────────────────────────────────────
    // SQL (Oracle / PL/SQL)
    // ─────────────────────────────────────────────
    oracle: {
        cpf: `-- Validar CPF em Oracle PL/SQL

CREATE OR REPLACE FUNCTION calc_dv_oracle(p_base IN VARCHAR2, p_pesos IN VARCHAR2) RETURN NUMBER IS
    t_soma NUMBER := 0;
    t_val  NUMBER;
    t_len  NUMBER := LENGTH(p_base);
    t_p_arr VARCHAR2(100) := p_pesos;
    t_curr_p VARCHAR2(2);
    t_p_idx NUMBER := 1;
BEGIN
    FOR i IN 1..t_len LOOP
        t_val := ASCII(SUBSTR(p_base, i, 1)) - 48;
        -- Extrai o peso da string separada por vírgula
        t_curr_p := REGEXP_SUBSTR(t_pesos, '[^,]+', 1, (LENGTH(p_base) - t_len + i) + (REGEXP_COUNT(p_pesos, ',') + 1 - t_len));
        t_soma := t_soma + (t_val * TO_NUMBER(t_curr_p));
    END LOOP;
    RETURN CASE WHEN MOD(t_soma, 11) < 2 THEN 0 ELSE 11 - MOD(t_soma, 11) END;
END;
/

CREATE OR REPLACE FUNCTION is_valid_cpf(p_cpf IN VARCHAR2) RETURN VARCHAR2 IS
    t_clean VARCHAR2(11) := REGEXP_REPLACE(p_cpf, '[^0-9]', '');
    t_base  VARCHAR2(9);
    t_dv1   NUMBER;
    t_dv2   NUMBER;
BEGIN
    IF LENGTH(t_clean) != 11 OR REGEXP_LIKE(t_clean, '^(.)\\1*$') THEN RETURN 'FALSE'; END IF;
    t_base := SUBSTR(t_clean, 1, 9);
    t_dv1  := calc_dv_oracle(t_base, '11,10,9,8,7,6,5,4,3,2');
    t_dv2  := calc_dv_oracle(t_base || t_dv1, '11,10,9,8,7,6,5,4,3,2');
    IF t_clean = t_base || t_dv1 || t_dv2 THEN RETURN 'TRUE'; ELSE RETURN 'FALSE'; END IF;
END;
/`,

        cnpj: `-- Validar CNPJ Numérico em Oracle PL/SQL
-- Compatível com a regra 2026 (algoritmo ASCII)

CREATE OR REPLACE FUNCTION is_valid_cnpj(p_cnpj IN VARCHAR2) RETURN VARCHAR2 IS
    t_clean VARCHAR2(14) := REGEXP_REPLACE(p_cnpj, '[./-]', '');
    t_base  VARCHAR2(12);
    t_pesos VARCHAR2(100) := '6,5,4,3,2,9,8,7,6,5,4,3,2';
    t_dv1   NUMBER;
    t_dv2   NUMBER;
BEGIN
    IF LENGTH(t_clean) != 14 OR NOT REGEXP_LIKE(t_clean, '^[0-9]{14}$') OR REGEXP_LIKE(t_clean, '^(.)\\1*$') THEN 
        RETURN 'FALSE'; 
    END IF;
    t_base := SUBSTR(t_clean, 1, 12);
    t_dv1  := calc_dv_oracle(t_base, t_pesos);
    t_dv2  := calc_dv_oracle(t_base || t_dv1, t_pesos);
    IF t_clean = t_base || t_dv1 || t_dv2 THEN RETURN 'TRUE'; ELSE RETURN 'FALSE'; END IF;
END;
/`,

        cnpj_alpha: `-- Validar CNPJ Alfanumérico em Oracle PL/SQL – Novo formato 2026
-- A raiz (8 primeiros) pode conter letras A–Z e números 0–9.
-- Os 2 dígitos verificadores são sempre numéricos.

CREATE OR REPLACE FUNCTION is_valid_cnpj_alpha(p_cnpj IN VARCHAR2) RETURN VARCHAR2 IS
    t_clean VARCHAR2(14) := UPPER(REGEXP_REPLACE(p_cnpj, '[./-]', ''));
    t_base  VARCHAR2(12);
    t_pesos VARCHAR2(100) := '6,5,4,3,2,9,8,7,6,5,4,3,2';
    t_dv1   NUMBER;
    t_dv2   NUMBER;
BEGIN
    IF LENGTH(t_clean) != 14 OR NOT REGEXP_LIKE(t_clean, '^[A-Z0-9]{12}[0-9]{2}$') OR REGEXP_LIKE(t_clean, '^0+$') THEN 
        RETURN 'FALSE'; 
    END IF;
    t_base := SUBSTR(t_clean, 1, 12);
    t_dv1  := calc_dv_oracle(t_base, t_pesos);
    t_dv2  := calc_dv_oracle(t_base || t_dv1, t_pesos);
    IF t_clean = t_base || t_dv1 || t_dv2 THEN RETURN 'TRUE'; ELSE RETURN 'FALSE'; END IF;
END;
/`,

        todos: `-- Validação Unificada em Oracle PL/SQL (CPF + CNPJ numérico e alfanumérico)
-- Detecta o tipo automaticamente pelo tamanho e composição.

CREATE OR REPLACE FUNCTION is_valid_document(p_doc IN VARCHAR2) RETURN VARCHAR2 IS
    t_clean VARCHAR2(20) := UPPER(REGEXP_REPLACE(p_doc, '[./-]', ''));
    t_base  VARCHAR2(12);
    t_dv1   NUMBER;
    t_dv2   NUMBER;
BEGIN
    IF LENGTH(t_clean) = 11 AND REGEXP_LIKE(t_clean, '^[0-9]+$') THEN
        -- Lógica CPF
        IF REGEXP_LIKE(t_clean, '^(.)\\1*$') THEN RETURN 'FALSE'; END IF;
        t_base := SUBSTR(t_clean, 1, 9);
        t_dv1  := calc_dv_oracle(t_base, '11,10,9,8,7,6,5,4,3,2');
        t_dv2  := calc_dv_oracle(t_base || t_dv1, '11,10,9,8,7,6,5,4,3,2');
        IF t_clean = t_base || t_dv1 || t_dv2 THEN RETURN 'TRUE'; ELSE RETURN 'FALSE'; END IF;

    ELSIF LENGTH(t_clean) = 14 AND REGEXP_LIKE(t_clean, '^[A-Z0-9]{12}[0-9]{2}$') THEN
        -- Lógica CNPJ (Numérico ou Alpha)
        IF REGEXP_LIKE(t_clean, '^0+$') THEN RETURN 'FALSE'; END IF;
        t_base := SUBSTR(t_clean, 1, 12);
        t_dv1  := calc_dv_oracle(t_base, '6,5,4,3,2,9,8,7,6,5,4,3,2');
        t_dv2  := calc_dv_oracle(t_base || t_dv1, '6,5,4,3,2,9,8,7,6,5,4,3,2');
        IF t_clean = t_base || t_dv1 || t_dv2 THEN RETURN 'TRUE'; ELSE RETURN 'FALSE'; END IF;
    END IF;
    RETURN 'FALSE';
END;
/`
    }
};
