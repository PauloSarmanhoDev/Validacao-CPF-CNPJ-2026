const codeExamples = {
  java: {
    isolado: `// Validação Isolada em Java

public class Validator {
    private static final int[] PESOS_CPF = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
    private static final int[] PESOS_CNPJ = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    public static boolean isValidCPF(String cpf) {
        cpf = cpf.replaceAll("[^\\\\d]", "");
        if (cpf.length() != 11 || cpf.matches("^(\\\\d)\\\\1*$")) return false;
        String base = cpf.substring(0, 9);
        int dv1 = calculaDigito(base, PESOS_CPF);
        int dv2 = calculaDigito(base + dv1, PESOS_CPF);
        return cpf.equals(base + dv1 + dv2);
    }

    public static boolean isValidCNPJ(String cnpj) {
        cnpj = cnpj.replaceAll("[./-]", "").toUpperCase();
        if (!cnpj.matches("^[A-Z0-9]{12}\\\\d{2}$") || cnpj.matches("^[0]+$")) return false;
        String base = cnpj.substring(0, 12);
        int dv1 = calculaDigito(base, PESOS_CNPJ);
        int dv2 = calculaDigito(base + dv1, PESOS_CNPJ);
        return cnpj.equals(base + dv1 + dv2);
    }

    private static int calculaDigito(String base, int[] pesos) {
        int soma = 0;
        int len = base.length();
        for (int i = len - 1; i >= 0; i--) {
            int val = (int) base.charAt(i) - 48; // Regra ASCII
            soma += val * pesos[pesos.length - len + i];
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
}`,
    unificado: `// Validação Unificada em Java

public class DocumentValidator {
    private static final int[] PESOS_CPF = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
    private static final int[] PESOS_CNPJ = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    public static boolean isValid(String doc) {
        if (doc == null) return false;
        doc = doc.replaceAll("[./-]", "").toUpperCase();

        if (doc.length() == 11 && doc.matches("^\\\\d+$")) {
            if (doc.matches("^(\\\\d)\\\\1*$")) return false;
            String base = doc.substring(0, 9);
            return doc.equals(base + calcDv(base, PESOS_CPF) + calcDv(base + calcDv(base, PESOS_CPF), PESOS_CPF));
        } else if (doc.length() == 14 && doc.matches("^[A-Z0-9]{12}\\\\d{2}$") && !doc.matches("^[0]+$")) {
            String base = doc.substring(0, 12);
            return doc.equals(base + calcDv(base, PESOS_CNPJ) + calcDv(base + calcDv(base, PESOS_CNPJ), PESOS_CNPJ));
        }
        return false;
    }

    private static int calcDv(String base, int[] pesos) {
        int soma = 0, len = base.length();
        for (int i = len - 1; i >= 0; i--) {
            int val = (int) base.charAt(i) - 48;
            soma += val * pesos[pesos.length - len + i];
        }
        return (soma % 11 < 2) ? 0 : 11 - (soma % 11);
    }
}`
  },

  csharp: {
    isolado: `// Validação Isolada em C#

using System.Text.RegularExpressions;

public static class Validator {
    private static readonly int[] PesosCPF = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
    private static readonly int[] PesosCNPJ = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    public static bool IsValidCPF(string cpf) {
        cpf = Regex.Replace(cpf ?? "", "[^\\\\d]", "");
        if (cpf.Length != 11 || Regex.IsMatch(cpf, @"^(\\\\d)\\\\1*$")) return false;
        string baseCpf = cpf.Substring(0, 9);
        int dv1 = CalcDigito(baseCpf, PesosCPF);
        int dv2 = CalcDigito(baseCpf + dv1, PesosCPF);
        return cpf == baseCpf + dv1 + dv2;
    }

    public static bool IsValidCNPJ(string cnpj) {
        cnpj = Regex.Replace(cnpj ?? "", "[./-]", "").ToUpper();
        if (!Regex.IsMatch(cnpj, @"^[A-Z0-9]{12}\\\\d{2}$") || Regex.IsMatch(cnpj, "^[0]+$")) return false;
        string baseCnpj = cnpj.Substring(0, 12);
        int dv1 = CalcDigito(baseCnpj, PesosCNPJ);
        int dv2 = CalcDigito(baseCnpj + dv1, PesosCNPJ);
        return cnpj == baseCnpj + dv1 + dv2;
    }

    private static int CalcDigito(string sub, int[] pesos) {
        int soma = 0, len = sub.Length;
        for (int i = len - 1; i >= 0; i--) {
            int val = (int)sub[i] - 48;
            soma += val * pesos[pesos.Length - len + i];
        }
        return soma % 11 < 2 ? 0 : 11 - (soma % 11);
    }
}`,
    unificado: `// Validação Unificada em C#

using System.Text.RegularExpressions;

public static class DocumentValidator {
    private static readonly int[] PesosCPF = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
    private static readonly int[] PesosCNPJ = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    public static bool IsValid(string doc) {
        if (string.IsNullOrWhiteSpace(doc)) return false;
        doc = Regex.Replace(doc, "[./-]", "").ToUpper();

        if (doc.Length == 11 && Regex.IsMatch(doc, @"^\\\\d+$")) {
            if (Regex.IsMatch(doc, @"^(\\\\d)\\\\1*$")) return false;
            string b = doc.Substring(0, 9);
            return doc == b + Calc(b, PesosCPF) + Calc(b + Calc(b, PesosCPF), PesosCPF);
        } else if (doc.Length == 14 && Regex.IsMatch(doc, @"^[A-Z0-9]{12}\\\\d{2}$")) {
            if (Regex.IsMatch(doc, "^[0]+$")) return false;
            string b = doc.Substring(0, 12);
            return doc == b + Calc(b, PesosCNPJ) + Calc(b + Calc(b, PesosCNPJ), PesosCNPJ);
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

  js: {
    isolado: `// Validação Isolada em JavaScript

const PESOS_CPF = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calculaDV(baseStr, pesos) {
    let soma = 0;
    const len = baseStr.length;
    for (let i = len - 1; i >= 0; i--) {
        const val = baseStr.charCodeAt(i) - 48;
        soma += val * pesos[pesos.length - len + i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
}

export function isValidCPF(cpf) {
    cpf = cpf.replace(/\\D/g, '');
    if (cpf.length !== 11 || /^(\\d)\\1+$/.test(cpf)) return false;
    const base = cpf.substring(0, 9);
    const dv1 = calculaDV(base, PESOS_CPF);
    const dv2 = calculaDV(base + dv1, PESOS_CPF);
    return cpf === base + dv1 + dv2;
}

export function isValidCNPJ(cnpj) {
    cnpj = cnpj.replace(/[./-]/g, '').toUpperCase();
    if (!/^[A-Z0-9]{12}\\d{2}$/.test(cnpj) || /^[0]+$/.test(cnpj)) return false;
    const base = cnpj.substring(0, 12);
    const dv1 = calculaDV(base, PESOS_CNPJ);
    const dv2 = calculaDV(base + dv1, PESOS_CNPJ);
    return cnpj === base + dv1 + dv2;
}`,
    unificado: `// Validação Unificada em JavaScript

const PESOS_CPF = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcDV(b, p) {
    let s = 0;
    for (let i = b.length - 1; i >= 0; i--) {
        s += (b.charCodeAt(i) - 48) * p[p.length - b.length + i];
    }
    return s % 11 < 2 ? 0 : 11 - (s % 11);
}

export function isValidDocument(doc) {
    if (!doc) return false;
    doc = doc.replace(/[./-]/g, '').toUpperCase();
    
    if (doc.length === 11 && /^\\d+$/.test(doc)) {
        if (/^(\\d)\\1+$/.test(doc)) return false;
        const b = doc.substring(0, 9);
        return doc === b + calcDV(b, PESOS_CPF) + calcDV(b + calcDV(b, PESOS_CPF), PESOS_CPF);
    } else if (doc.length === 14 && /^[A-Z0-9]{12}\\d{2}$/.test(doc) && !/^[0]+$/.test(doc)) {
        const b = doc.substring(0, 12);
        return doc === b + calcDV(b, PESOS_CNPJ) + calcDV(b + calcDV(b, PESOS_CNPJ), PESOS_CNPJ);
    }
    return false;
}`
  },
  
  ts: {
    isolado: `// Validação Isolada em TypeScript

const PESOS_CPF: number[] = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calculaDV(baseStr: string, pesos: number[]): number {
    let soma = 0;
    const len = baseStr.length;
    for (let i = len - 1; i >= 0; i--) {
        const val = baseStr.charCodeAt(i) - 48;
        soma += val * pesos[pesos.length - len + i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
}

export function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/\\D/g, '');
    if (cpf.length !== 11 || /^(\\d)\\1+$/.test(cpf)) return false;
    const base = cpf.substring(0, 9);
    const dv1 = calculaDV(base, PESOS_CPF);
    const dv2 = calculaDV(base + dv1, PESOS_CPF);
    return cpf === base + dv1 + dv2;
}

export function isValidCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[./-]/g, '').toUpperCase();
    if (!/^[A-Z0-9]{12}\\d{2}$/.test(cnpj) || /^[0]+$/.test(cnpj)) return false;
    const base = cnpj.substring(0, 12);
    const dv1 = calculaDV(base, PESOS_CNPJ);
    const dv2 = calculaDV(base + dv1, PESOS_CNPJ);
    return cnpj === base + dv1 + dv2;
}`,
    unificado: `// Validação Unificada em TypeScript

const PESOS_CPF: number[] = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcDV(b: string, p: number[]): number {
    let s = 0;
    for (let i = b.length - 1; i >= 0; i--) {
        s += (b.charCodeAt(i) - 48) * p[p.length - b.length + i];
    }
    return s % 11 < 2 ? 0 : 11 - (s % 11);
}

export function isValidDocument(doc: string): boolean {
    if (!doc) return false;
    doc = doc.replace(/[./-]/g, '').toUpperCase();
    
    if (doc.length === 11 && /^\\d+$/.test(doc)) {
        if (/^(\\d)\\1+$/.test(doc)) return false;
        const b = doc.substring(0, 9);
        return doc === b + calcDV(b, PESOS_CPF) + calcDV(b + calcDV(b, PESOS_CPF), PESOS_CPF);
    } else if (doc.length === 14 && /^[A-Z0-9]{12}\\d{2}$/.test(doc) && !/^[0]+$/.test(doc)) {
        const b = doc.substring(0, 12);
        return doc === b + calcDV(b, PESOS_CNPJ) + calcDV(b + calcDV(b, PESOS_CNPJ), PESOS_CNPJ);
    }
    return false;
}`
  },

  rust: {
    isolado: `// Validação Isolada em Rust

const PESOS_CPF: &[u32] = &[11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ: &[u32] = &[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

fn calc_dv(base: &str, pesos: &[u32]) -> u32 {
    let mut soma = 0;
    let bytes = base.as_bytes();
    for (i, &b) in bytes.iter().enumerate().rev() {
        let val = b as u32 - 48;
        soma += val * pesos[pesos.len() - bytes.len() + i];
    }
    let rest = soma % 11;
    if rest < 2 { 0 } else { 11 - rest }
}

pub fn is_valid_cpf(cpf: &str) -> bool {
    let clean: String = cpf.chars().filter(|c| c.is_digit(10)).collect();
    if clean.len() != 11 { return false; }
    
    let base = &clean[..9];
    let dv1 = calc_dv(base, PESOS_CPF);
    let dv2 = calc_dv(&format!("{}{}", base, dv1), PESOS_CPF);
    clean == format!("{}{}{}", base, dv1, dv2)
}

pub fn is_valid_cnpj(cnpj: &str) -> bool {
    let clean = cnpj.replace(&['.', '/', '-'][..], "").to_uppercase();
    if clean.len() != 14 { return false; }
    
    let base = &clean[..12];
    let dv1 = calc_dv(base, PESOS_CNPJ);
    let dv2 = calc_dv(&format!("{}{}", base, dv1), PESOS_CNPJ);
    clean == format!("{}{}{}", base, dv1, dv2)
}`,
    unificado: `// Validação Unificada em Rust

const PESOS_CPF: &[u32] = &[11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ: &[u32] = &[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

fn calc_dv(base: &str, pesos: &[u32]) -> u32 {
    let sum: u32 = base.bytes().enumerate()
        .map(|(i, b)| (b as u32 - 48) * pesos[pesos.len() - base.len() + i])
        .sum();
    match sum % 11 {
        0 | 1 => 0,
        r => 11 - r
    }
}

pub fn is_valid_document(doc: &str) -> bool {
    let clean = doc.replace(&['.', '/', '-'][..], "").to_uppercase();
    
    if clean.len() == 11 && clean.chars().all(|c| c.is_digit(10)) {
        let b = &clean[..9];
        let dv1 = calc_dv(b, PESOS_CPF);
        return clean == format!("{}{}{}", b, dv1, calc_dv(&format!("{}{}", b, dv1), PESOS_CPF));
    } else if clean.len() == 14 {
        let b = &clean[..12];
        let dv1 = calc_dv(b, PESOS_CNPJ);
        return clean == format!("{}{}{}", b, dv1, calc_dv(&format!("{}{}", b, dv1), PESOS_CNPJ));
    }
    false
}`
  },

  go: {
    isolado: `// Validação Isolada em Go (Golang)

package validator

import (
	"regexp"
	"strconv"
	"strings"
)

var pesosCPF = []int{11, 10, 9, 8, 7, 6, 5, 4, 3, 2}
var pesosCNPJ = []int{6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}

func calcDV(base string, pesos []int) int {
	soma := 0
	l := len(base)
	for i := l - 1; i >= 0; i-- {
		val := int(base[i]) - 48
		soma += val * pesos[len(pesos)-l+i]
	}
	resto := soma % 11
	if resto < 2 { return 0 }
	return 11 - resto
}

func IsValidCPF(cpf string) bool {
    re := regexp.MustCompile(\`\\\\D\`)
	cpf = re.ReplaceAllString(cpf, "")
	if len(cpf) != 11 { return false }

	base := cpf[:9]
	dv1 := calcDV(base, pesosCPF)
	dv2 := calcDV(base+strconv.Itoa(dv1), pesosCPF)
	return cpf == base+strconv.Itoa(dv1)+strconv.Itoa(dv2)
}

func IsValidCNPJ(cnpj string) bool {
	re := regexp.MustCompile(\`[./-]\`)
	cnpj = strings.ToUpper(re.ReplaceAllString(cnpj, ""))
	if len(cnpj) != 14 { return false }

	base := cnpj[:12]
	dv1 := calcDV(base, pesosCNPJ)
	dv2 := calcDV(base+strconv.Itoa(dv1), pesosCNPJ)
	return cnpj == base+strconv.Itoa(dv1)+strconv.Itoa(dv2)
}`,
    unificado: `// Validação Unificada em Go (Golang)

package validator

import (
	"regexp"
	"strconv"
	"strings"
)

var pesosCPF = []int{11, 10, 9, 8, 7, 6, 5, 4, 3, 2}
var pesosCNPJ = []int{6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}

func calcDV(b string, p []int) int {
	s := 0
	for i := len(b) - 1; i >= 0; i-- {
		s += (int(b[i]) - 48) * p[len(p)-len(b)+i]
	}
	if s%11 < 2 { return 0 }
	return 11 - (s % 11)
}

func IsValidDocument(doc string) bool {
	re := regexp.MustCompile(\`[./-]\`)
	doc = strings.ToUpper(re.ReplaceAllString(doc, ""))

	if len(doc) == 11 {
		b := doc[:9]
		dv1 := calcDV(b, pesosCPF)
		return doc == b+strconv.Itoa(dv1)+strconv.Itoa(calcDV(b+strconv.Itoa(dv1), pesosCPF))
	} else if len(doc) == 14 {
		b := doc[:12]
		dv1 := calcDV(b, pesosCNPJ)
		return doc == b+strconv.Itoa(dv1)+strconv.Itoa(calcDV(b+strconv.Itoa(dv1), pesosCNPJ))
	}
	return false
}`
  },

  swift: {
    isolado: `// Validação Isolada em Swift

import Foundation

let pesosCPF = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
let pesosCNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

func calcDV(_ base: String, _ pesos: [Int]) -> Int {
    let chars = Array(base)
    var soma = 0
    for i in (0..<chars.count).reversed() {
        let val = Int(chars[i].asciiValue!) - 48
        soma += val * pesos[pesos.count - chars.count + i]
    }
    let rest = soma % 11
    return rest < 2 ? 0 : 11 - rest
}

func isValidCPF(_ cpf: String) -> Bool {
    let clean = cpf.replacingOccurrences(of: "\\\\D", with: "", options: .regularExpression)
    guard clean.count == 11 else { return false }
    
    let base = String(clean.prefix(9))
    let dv1 = calcDV(base, pesosCPF)
    let dv2 = calcDV(base + "\\(dv1)", pesosCPF)
    return clean == "\\(base)\\(dv1)\\(dv2)"
}

func isValidCNPJ(_ cnpj: String) -> Bool {
    let clean = cnpj.replacingOccurrences(of: "[./-]", with: "", options: .regularExpression).uppercased()
    guard clean.count == 14 else { return false }
    
    let base = String(clean.prefix(12))
    let dv1 = calcDV(base, pesosCNPJ)
    let dv2 = calcDV(base + "\\(dv1)", pesosCNPJ)
    return clean == "\\(base)\\(dv1)\\(dv2)"
}`,
    unificado: `// Validação Unificada em Swift

import Foundation

let pesosCPF = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
let pesosCNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

func calcDV(_ b: String, _ p: [Int]) -> Int {
    var s = 0
    let c = Array(b)
    for i in 0..<c.count {
        s += (Int(c[i].asciiValue!) - 48) * p[p.count - c.count + i]
    }
    return (s % 11 < 2) ? 0 : 11 - (s % 11)
}

func isValidDocument(_ doc: String) -> Bool {
    let clean = doc.replacingOccurrences(of: "[./-]", with: "", options: .regularExpression).uppercased()
    
    if clean.count == 11 {
        let b = String(clean.prefix(9))
        let dv1 = calcDV(b, pesosCPF)
        return clean == "\\(b)\\(dv1)\\(calcDV(b + "\\(dv1)", pesosCPF))"
    } else if clean.count == 14 {
        let b = String(clean.prefix(12))
        let dv1 = calcDV(b, pesosCNPJ)
        return clean == "\\(b)\\(dv1)\\(calcDV(b + "\\(dv1)", pesosCNPJ))"
    }
    return false
}`
  },

  kotlin: {
    isolado: `// Validação Isolada em Kotlin

val PESOS_CPF = intArrayOf(11, 10, 9, 8, 7, 6, 5, 4, 3, 2)
val PESOS_CNPJ = intArrayOf(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2)

fun calcDV(base: String, pesos: IntArray): Int {
    var soma = 0
    for (i in base.indices.reversed()) {
        val valor = base[i].code - 48
        soma += valor * pesos[pesos.size - base.length + i]
    }
    val resto = soma % 11
    return if (resto < 2) 0 else 11 - resto
}

fun isValidCPF(cpf: String): Boolean {
    val clean = cpf.replace(Regex("\\\\\\\\D"), "")
    if (clean.length != 11) return false
    val base = clean.substring(0, 9)
    val dv1 = calcDV(base, PESOS_CPF)
    val dv2 = calcDV(base + dv1, PESOS_CPF)
    return clean == base + dv1 + dv2
}

fun isValidCNPJ(cnpj: String): Boolean {
    val clean = cnpj.replace(Regex("[./-]"), "").uppercase()
    if (clean.length != 14) return false
    val base = clean.substring(0, 12)
    val dv1 = calcDV(base, PESOS_CNPJ)
    val dv2 = calcDV(base + dv1, PESOS_CNPJ)
    return clean == base + dv1 + dv2
}`,
    unificado: `// Validação Unificada em Kotlin

val PESOS_CPF = intArrayOf(11, 10, 9, 8, 7, 6, 5, 4, 3, 2)
val PESOS_CNPJ = intArrayOf(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2)

fun calcDV(b: String, p: IntArray): Int {
    var s = 0
    for (i in b.indices) s += (b[i].code - 48) * p[p.size - b.length + i]
    return if (s % 11 < 2) 0 else 11 - (s % 11)
}

fun isValidDocument(doc: String): Boolean {
    val clean = doc.replace(Regex("[./-]"), "").uppercase()
    if (clean.length == 11) {
        val b = clean.substring(0, 9)
        val dv1 = calcDV(b, PESOS_CPF)
        return clean == b + dv1 + calcDV(b + dv1, PESOS_CPF)
    } else if (clean.length == 14) {
        val b = clean.substring(0, 12)
        val dv1 = calcDV(b, PESOS_CNPJ)
        return clean == b + dv1 + calcDV(b + dv1, PESOS_CNPJ)
    }
    return false
}`
  },

  sql: {
    isolado: `-- Validação Isolada em PL/pgSQL (PostgreSQL)

CREATE OR REPLACE FUNCTION calc_dv(base_str VARCHAR, pesos INT[]) RETURNS INT AS $$
DECLARE
    soma INT := 0;
    i INT;
    val INT;
BEGIN
    FOR i IN REVERSE length(base_str)..1 LOOP
        val := ascii(substring(base_str FROM i FOR 1)) - 48;
        soma := soma + (val * pesos[array_length(pesos, 1) - length(base_str) + i]);
    END LOOP;
    IF (soma % 11) < 2 THEN RETURN 0; ELSE RETURN 11 - (soma % 11); END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION is_valid_cpf(cpf VARCHAR) RETURNS BOOLEAN AS $$
DECLARE
    clean VARCHAR := regexp_replace(cpf, '\\D', '', 'g');
    base_cpf VARCHAR;
    dv1 INT; dv2 INT;
BEGIN
    IF length(clean) != 11 THEN RETURN FALSE; END IF;
    base_cpf := substring(clean, 1, 9);
    dv1 := calc_dv(base_cpf, ARRAY[11,10,9,8,7,6,5,4,3,2]);
    dv2 := calc_dv(base_cpf || dv1, ARRAY[11,10,9,8,7,6,5,4,3,2]);
    RETURN clean = base_cpf || dv1 || dv2;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION is_valid_cnpj(cnpj VARCHAR) RETURNS BOOLEAN AS $$
DECLARE
    clean VARCHAR := upper(regexp_replace(cnpj, '[./-]', '', 'g'));
    base_cnpj VARCHAR;
    dv1 INT; dv2 INT;
BEGIN
    IF length(clean) != 14 THEN RETURN FALSE; END IF;
    base_cnpj := substring(clean, 1, 12);
    dv1 := calc_dv(base_cnpj, ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2]);
    dv2 := calc_dv(base_cnpj || dv1, ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2]);
    RETURN clean = base_cnpj || dv1 || dv2;
END;
$$ LANGUAGE plpgsql IMMUTABLE;`,
    unificado: `-- Validação Unificada em PL/pgSQL (PostgreSQL)

CREATE OR REPLACE FUNCTION is_valid_document(doc VARCHAR) RETURNS BOOLEAN AS $$
DECLARE
    clean VARCHAR := upper(regexp_replace(doc, '[./-]', '', 'g'));
    base_str VARCHAR; dv1 INT; dv2 INT;
BEGIN
    IF length(clean) = 11 THEN
        base_str := substring(clean, 1, 9);
        dv1 := calc_dv(base_str, ARRAY[11,10,9,8,7,6,5,4,3,2]);
        dv2 := calc_dv(base_str || dv1, ARRAY[11,10,9,8,7,6,5,4,3,2]);
        RETURN clean = base_str || dv1 || dv2;
    ELSIF length(clean) = 14 THEN
        base_str := substring(clean, 1, 12);
        dv1 := calc_dv(base_str, ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2]);
        dv2 := calc_dv(base_str || dv1, ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2]);
        RETURN clean = base_str || dv1 || dv2;
    END IF;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;`
  }
};
