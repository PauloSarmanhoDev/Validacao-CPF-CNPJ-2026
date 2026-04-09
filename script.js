// --- TABS LOGIC ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

// --- CODE RENDERER LOGIC ---
function renderCodeExample() {
    const lang = document.getElementById('code-lang-selector').value;
    const cat = document.getElementById('code-cat-selector').value;
    const viewer = document.getElementById('code-viewer');
    
    // codeExamples provém do arquivo examples.js
    if (typeof codeExamples !== 'undefined' && codeExamples[lang] && codeExamples[lang][cat]) {
        viewer.textContent = codeExamples[lang][cat];
        viewer.className = `language-` + (lang === 'csharp' ? 'csharp' : (lang === 'ts' ? 'typescript' : lang));
    } else {
        viewer.textContent = "// Exemplo não encontrado.";
    }
}

// Initial render on load
document.addEventListener('DOMContentLoaded', () => {
    renderCodeExample();
});

// --- UTILS ---
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function copiarValor(elementId) {
    const input = document.getElementById(elementId);
    if (!input || !input.value) return;

    // Use a abordagem nativa primeiro, mas com suporte de fallback
    // para protocolo file:// ou browsers mais estritos.
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(input.value).then(() => {
            showToast('Copiado para a área de transferência!');
        }).catch(err => copyFallback(input));
    } else {
        copyFallback(input);
    }
}

function copyFallback(input) {
    input.select();
    input.setSelectionRange(0, 99999); // Para Mobile
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Copiado para a área de transferência!');
        } else {
            showToast('Não foi possível copiar!');
        }
    } catch (err) {
        showToast('Erro interno ao copiar.');
    }
    window.getSelection().removeAllRanges(); // Limpa seleção
}

function updateOutputs(raw, masked) {
    document.getElementById('output-clean').value = raw;
    document.getElementById('output-mask').value = masked;
    showToast('Gerado com sucesso!');
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChar() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

// --- CPF LOGIC ---
function calculaDigitoCPF(cpfBase) {
    let soma = 0;
    let peso = cpfBase.length + 1;
    for (let i = 0; i < cpfBase.length; i++) {
        soma += parseInt(cpfBase.charAt(i)) * peso--;
    }
    let resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
}

function gerarCPF() {
    let cpf = "";
    for (let i = 0; i < 9; i++) {
        cpf += randomInt(0, 9);
    }
    const dv1 = calculaDigitoCPF(cpf);
    const dv2 = calculaDigitoCPF(cpf + dv1);
    cpf += dv1.toString() + dv2.toString();
    
    const masked = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    updateOutputs(cpf, masked);
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
    const base = cpf.substring(0, 9);
    const dv1 = calculaDigitoCPF(base);
    const dv2 = calculaDigitoCPF(base + dv1);
    
    return cpf === (base + dv1 + dv2);
}

// --- CNPJ LOGIC (2026 Compatible) ---
const PESOS_CNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calculaDigitoCNPJ(cnpjBase) {
    let soma = 0;
    const length = cnpjBase.length;
    for (let i = length - 1; i >= 0; i--) {
        // Regra ASCII do formato 2026
        const valorCaracter = cnpjBase.charCodeAt(i) - 48;
        const pesoIndex = PESOS_CNPJ.length - length + i;
        soma += valorCaracter * PESOS_CNPJ[pesoIndex];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
}

function gerarCNPJ(isAlpha) {
    let base = "";
    // 8 posições raiz
    for (let i = 0; i < 8; i++) {
        base += isAlpha ? randomChar() : randomInt(0, 9);
    }
    // 4 posições filial
    base += "000";
    base += isAlpha ? randomChar() : randomInt(1, 9); // Evita todos os zeros.
    
    const dv1 = calculaDigitoCNPJ(base);
    const dv2 = calculaDigitoCNPJ(base + dv1);
    const cnpj = base + dv1.toString() + dv2.toString();
    
    const masked = cnpj.substring(0,2) + "." + cnpj.substring(2,5) + "." + cnpj.substring(5,8) + "/" + cnpj.substring(8,12) + "-" + cnpj.substring(12,14);
    updateOutputs(cnpj, masked);
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[./-]/g, '').toUpperCase();
    if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) return false;
    if (/^[0]+$/.test(cnpj)) return false;
    
    const base = cnpj.substring(0, 12);
    const dvInformado = cnpj.substring(12);
    
    const dv1 = calculaDigitoCNPJ(base).toString();
    const dv2 = calculaDigitoCNPJ(base + dv1).toString();
    const dvCalculado = dv1 + dv2;
    
    return dvInformado === dvCalculado;
}

// --- MASTER VALIDATOR ---
function validarDocumento() {
    const input = document.getElementById('input-validador').value.trim();
    const resultBox = document.getElementById('validation-result');
    resultBox.style.display = 'block';
    resultBox.className = 'validation-message'; // reset

    if (!input) {
        resultBox.textContent = "Por favor, digite um documento.";
        resultBox.classList.add('error');
        return;
    }

    const unmasked = input.replace(/[./-]/g, '').toUpperCase();
    
    if (unmasked.length === 11 && /^\d+$/.test(unmasked)) {
        if (validarCPF(input)) {
            resultBox.textContent = "✅ CPF Válido!";
            resultBox.classList.add('success');
        } else {
            resultBox.textContent = "❌ CPF Inválido.";
            resultBox.classList.add('error');
        }
    } else if (unmasked.length === 14) {
        if (validarCNPJ(input)) {
            resultBox.textContent = "✅ CNPJ Válido!";
            resultBox.classList.add('success');
        } else {
            resultBox.textContent = "❌ CNPJ Inválido.";
            resultBox.classList.add('error');
        }
    } else {
        resultBox.textContent = "❌ Formato desconhecido. Deve conter 11 ou 14 caracteres.";
        resultBox.classList.add('error');
    }
}
