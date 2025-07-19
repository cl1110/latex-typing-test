import React, { useState, useMemo } from 'react';
import { Search, Copy, CheckCircle } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface LaTeXCommand {
  command: string;
  description: string;
  example: string;
  symbol?: string;
  category: string;
  equationExample?: string;
  equationCode?: string;
}

const latexCommands: LaTeXCommand[] = [
  // Basic Math
  { command: '+', description: 'Addition', example: 'a + b', symbol: '+', category: 'Basic Math', equationExample: '2 + 3 = 5', equationCode: '2 + 3 = 5' },
  { command: '-', description: 'Subtraction', example: 'a - b', symbol: '−', category: 'Basic Math', equationExample: '7 - 3 = 4', equationCode: '7 - 3 = 4' },
  { command: '\\cdot', description: 'Multiplication (dot)', example: 'a \\cdot b', symbol: '⋅', category: 'Basic Math', equationExample: 'F⃗ = m⋅a⃗', equationCode: '\\vec{F} = m \\cdot \\vec{a}' },
  { command: '\\times', description: 'Multiplication (cross)', example: 'a \\times b', symbol: '×', category: 'Basic Math', equationExample: 'a⃗ × b⃗ = c⃗', equationCode: '\\vec{a} \\times \\vec{b} = \\vec{c}' },
  { command: '\\div', description: 'Division', example: 'a \\div b', symbol: '÷', category: 'Basic Math', equationExample: '12 ÷ 3 = 4', equationCode: '12 \\div 3 = 4' },
  { command: '\\pm', description: 'Plus or minus', example: 'a \\pm b', symbol: '±', category: 'Basic Math', equationExample: 'x = (-b ± √Δ)/2a', equationCode: 'x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}' },
  { command: '\\mp', description: 'Minus or plus', example: 'a \\mp b', symbol: '∓', category: 'Basic Math', equationExample: 'cos(α ∓ β)', equationCode: '\\cos(\\alpha \\mp \\beta)' },
  
  // Fractions and Roots
  { command: '\\frac{a}{b}', description: 'Fraction', example: '\\frac{1}{2}', symbol: '½', category: 'Fractions & Roots', equationExample: 'E = ½mv²', equationCode: 'E = \\frac{1}{2}mv^2' },
  { command: '\\dfrac{a}{b}', description: 'Display fraction', example: '\\dfrac{1}{2}', symbol: '½', category: 'Fractions & Roots', equationExample: 'π/4 = 1 - ⅓ + ⅕ - ⅐', equationCode: '\\frac{\\pi}{4} = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7}' },
  { command: '\\tfrac{a}{b}', description: 'Text fraction', example: '\\tfrac{1}{2}', symbol: '½', category: 'Fractions & Roots', equationExample: 'slope = Δy/Δx', equationCode: '\\text{slope} = \\tfrac{\\Delta y}{\\Delta x}' },
  { command: '\\sqrt{x}', description: 'Square root', example: '\\sqrt{16}', symbol: '√', category: 'Fractions & Roots', equationExample: 'c = √(a² + b²)', equationCode: 'c = \\sqrt{a^2 + b^2}' },
  { command: '\\sqrt[n]{x}', description: 'nth root', example: '\\sqrt[3]{8}', symbol: '∛', category: 'Fractions & Roots', equationExample: '∛27 = 3', equationCode: '\\sqrt[3]{27} = 3' },
  { command: '\\cfrac{a}{b}', description: 'Continued fraction', example: '\\cfrac{1}{2+\\cfrac{1}{3}}', symbol: '½', category: 'Fractions & Roots', equationExample: 'φ = 1 + 1/(1 + 1/(1 + ...))', equationCode: '\\phi = 1 + \\cfrac{1}{1 + \\cfrac{1}{1 + \\cdots}}' },
  
  // Superscripts and Subscripts
  { command: 'x^{n}', description: 'Superscript', example: 'x^{2}', symbol: 'x²', category: 'Super/Subscripts', equationExample: 'E = mc²', equationCode: 'E = mc^2' },
  { command: 'x_{n}', description: 'Subscript', example: 'x_{1}', symbol: 'x₁', category: 'Super/Subscripts', equationExample: 'H₂O', equationCode: 'H_2O' },
  { command: 'x^{a}_{b}', description: 'Both super and subscript', example: 'x^{2}_{1}', symbol: 'x₁²', category: 'Super/Subscripts', equationExample: 'xᵢⁿ⁺¹', equationCode: 'x_i^{n+1}' },
  { command: '^{a}x', description: 'Prescript', example: '^{14}C', symbol: '¹⁴C', category: 'Super/Subscripts', equationExample: '²³⁸U → ²³⁴Th', equationCode: '^{238}U \\to ^{234}Th' },
  
  // Greek Letters (lowercase)
  { command: '\\alpha', description: 'Alpha', example: '\\alpha', symbol: 'α', category: 'Greek Letters', equationExample: 'α = 45°', equationCode: '\\alpha = 45°' },
  { command: '\\beta', description: 'Beta', example: '\\beta', symbol: 'β', category: 'Greek Letters', equationExample: 'β decay', equationCode: '\\beta \\text{ decay}' },
  { command: '\\gamma', description: 'Gamma', example: '\\gamma', symbol: 'γ', category: 'Greek Letters', equationExample: 'γ = 1/√(1-v²/c²)', equationCode: '\\gamma = \\frac{1}{\\sqrt{1-v^2/c^2}}' },
  { command: '\\delta', description: 'Delta', example: '\\delta', symbol: 'δ', category: 'Greek Letters', equationExample: 'δ(x) = 0', equationCode: '\\delta(x) = 0' },
  { command: '\\epsilon', description: 'Epsilon', example: '\\epsilon', symbol: 'ε', category: 'Greek Letters', equationExample: 'ε₀ = 8.85×10⁻¹²', equationCode: '\\epsilon_0 = 8.85 \\times 10^{-12}' },
  { command: '\\varepsilon', description: 'Variant epsilon', example: '\\varepsilon', symbol: 'ϵ', category: 'Greek Letters', equationExample: 'ϵ > 0', equationCode: '\\varepsilon > 0' },
  { command: '\\zeta', description: 'Zeta', example: '\\zeta', symbol: 'ζ', category: 'Greek Letters', equationExample: 'ζ(s) = ∑1/nˢ', equationCode: '\\zeta(s) = \\sum \\frac{1}{n^s}' },
  { command: '\\eta', description: 'Eta', example: '\\eta', symbol: 'η', category: 'Greek Letters', equationExample: 'η = μ/ρ', equationCode: '\\eta = \\frac{\\mu}{\\rho}' },
  { command: '\\theta', description: 'Theta', example: '\\theta', symbol: 'θ', category: 'Greek Letters', equationExample: 'sin θ = y/r', equationCode: '\\sin \\theta = \\frac{y}{r}' },
  { command: '\\vartheta', description: 'Variant theta', example: '\\vartheta', symbol: 'ϑ', category: 'Greek Letters', equationExample: 'ϑ function', equationCode: '\\vartheta \\text{ function}' },
  { command: '\\iota', description: 'Iota', example: '\\iota', symbol: 'ι', category: 'Greek Letters' },
  { command: '\\kappa', description: 'Kappa', example: '\\kappa', symbol: 'κ', category: 'Greek Letters', equationExample: 'κ = k/(ρcₚ)', equationCode: '\\kappa = \\frac{k}{\\rho c_p}' },
  { command: '\\lambda', description: 'Lambda', example: '\\lambda', symbol: 'λ', category: 'Greek Letters', equationExample: 'λ = c/f', equationCode: '\\lambda = \\frac{c}{f}' },
  { command: '\\mu', description: 'Mu', example: '\\mu', symbol: 'μ', category: 'Greek Letters', equationExample: 'μ₀ = 4π×10⁻⁷', equationCode: '\\mu_0 = 4\\pi \\times 10^{-7}' },
  { command: '\\nu', description: 'Nu', example: '\\nu', symbol: 'ν', category: 'Greek Letters', equationExample: 'ν = 1/λ', equationCode: '\\nu = \\frac{1}{\\lambda}' },
  { command: '\\xi', description: 'Xi', example: '\\xi', symbol: 'ξ', category: 'Greek Letters', equationExample: 'ξ coordinate', equationCode: '\\xi \\text{ coordinate}' },
  { command: '\\pi', description: 'Pi', example: '\\pi', symbol: 'π', category: 'Greek Letters', equationExample: 'A = πr²', equationCode: 'A = \\pi r^2' },
  { command: '\\varpi', description: 'Variant pi', example: '\\varpi', symbol: 'ϖ', category: 'Greek Letters' },
  { command: '\\rho', description: 'Rho', example: '\\rho', symbol: 'ρ', category: 'Greek Letters', equationExample: 'ρ = m/V', equationCode: '\\rho = \\frac{m}{V}' },
  { command: '\\varrho', description: 'Variant rho', example: '\\varrho', symbol: 'ϱ', category: 'Greek Letters' },
  { command: '\\sigma', description: 'Sigma', example: '\\sigma', symbol: 'σ', category: 'Greek Letters', equationExample: 'σ = √Var(X)', equationCode: '\\sigma = \\sqrt{\\text{Var}(X)}' },
  { command: '\\varsigma', description: 'Variant sigma', example: '\\varsigma', symbol: 'ς', category: 'Greek Letters' },
  { command: '\\tau', description: 'Tau', example: '\\tau', symbol: 'τ', category: 'Greek Letters', equationExample: 'τ = 2π', equationCode: '\\tau = 2\\pi' },
  { command: '\\upsilon', description: 'Upsilon', example: '\\upsilon', symbol: 'υ', category: 'Greek Letters' },
  { command: '\\phi', description: 'Phi', example: '\\phi', symbol: 'φ', category: 'Greek Letters', equationExample: 'φ = (1+√5)/2', equationCode: '\\phi = \\frac{1+\\sqrt{5}}{2}' },
  { command: '\\varphi', description: 'Variant phi', example: '\\varphi', symbol: 'ϕ', category: 'Greek Letters', equationExample: 'ϕ(n) Euler function', equationCode: '\\varphi(n) \\text{ Euler function}' },
  { command: '\\chi', description: 'Chi', example: '\\chi', symbol: 'χ', category: 'Greek Letters', equationExample: 'χ² test', equationCode: '\\chi^2 \\text{ test}' },
  { command: '\\psi', description: 'Psi', example: '\\psi', symbol: 'ψ', category: 'Greek Letters', equationExample: 'ψ(x,t) wavefunction', equationCode: '\\psi(x,t) \\text{ wavefunction}' },
  { command: '\\omega', description: 'Omega', example: '\\omega', symbol: 'ω', category: 'Greek Letters', equationExample: 'ω = 2πf', equationCode: '\\omega = 2\\pi f' },
  
  // Greek Letters (uppercase)
  { command: '\\Gamma', description: 'Capital Gamma', example: '\\Gamma', symbol: 'Γ', category: 'Greek Letters', equationExample: 'Γ(n) = (n-1)!', equationCode: '\\Gamma(n) = (n-1)!' },
  { command: '\\Delta', description: 'Capital Delta', example: '\\Delta', symbol: 'Δ', category: 'Greek Letters', equationExample: 'ΔE = E₂ - E₁', equationCode: '\\Delta E = E_2 - E_1' },
  { command: '\\Theta', description: 'Capital Theta', example: '\\Theta', symbol: 'Θ', category: 'Greek Letters', equationExample: 'Θ(n) complexity', equationCode: '\\Theta(n) \\text{ complexity}' },
  { command: '\\Lambda', description: 'Capital Lambda', example: '\\Lambda', symbol: 'Λ', category: 'Greek Letters', equationExample: 'Λ = diag(λ₁,λ₂)', equationCode: '\\Lambda = \\text{diag}(\\lambda_1, \\lambda_2)' },
  { command: '\\Xi', description: 'Capital Xi', example: '\\Xi', symbol: 'Ξ', category: 'Greek Letters' },
  { command: '\\Pi', description: 'Capital Pi', example: '\\Pi', symbol: 'Π', category: 'Greek Letters', equationExample: 'Π = ∏pᵢ', equationCode: '\\Pi = \\prod p_i' },
  { command: '\\Sigma', description: 'Capital Sigma', example: '\\Sigma', symbol: 'Σ', category: 'Greek Letters', equationExample: 'Σ = ∑xᵢ', equationCode: '\\Sigma = \\sum x_i' },
  { command: '\\Upsilon', description: 'Capital Upsilon', example: '\\Upsilon', symbol: 'Υ', category: 'Greek Letters' },
  { command: '\\Phi', description: 'Capital Phi', example: '\\Phi', symbol: 'Φ', category: 'Greek Letters', equationExample: 'Φₑ = ∮E⃗·dA⃗', equationCode: '\\Phi_e = \\oint \\vec{E} \\cdot d\\vec{A}' },
  { command: '\\Psi', description: 'Capital Psi', example: '\\Psi', symbol: 'Ψ', category: 'Greek Letters', equationExample: 'Ψ = |ψ⟩⟨ψ|', equationCode: '\\Psi = |\\psi\\rangle\\langle\\psi|' },
  { command: '\\Omega', description: 'Capital Omega', example: '\\Omega', symbol: 'Ω', category: 'Greek Letters', equationExample: 'R = V/I [Ω]', equationCode: 'R = \\frac{V}{I} \\text{ [}\\Omega\\text{]}' },
  
  // Relations
  { command: '=', description: 'Equal', example: 'a = b', symbol: '=', category: 'Relations', equationExample: 'x² = 16', equationCode: 'x^2 = 16' },
  { command: '\\neq', description: 'Not equal', example: 'a \\neq b', symbol: '≠', category: 'Relations', equationExample: 'π ≠ 22/7', equationCode: '\\pi \\neq \\frac{22}{7}' },
  { command: '<', description: 'Less than', example: 'a < b', symbol: '<', category: 'Relations', equationExample: 'x < 5', equationCode: 'x < 5' },
  { command: '>', description: 'Greater than', example: 'a > b', symbol: '>', category: 'Relations', equationExample: 'x > 0', equationCode: 'x > 0' },
  { command: '\\leq', description: 'Less than or equal', example: 'a \\leq b', symbol: '≤', category: 'Relations', equationExample: '0 ≤ x ≤ 1', equationCode: '0 \\leq x \\leq 1' },
  { command: '\\geq', description: 'Greater than or equal', example: 'a \\geq b', symbol: '≥', category: 'Relations', equationExample: 'n ≥ 1', equationCode: 'n \\geq 1' },
  { command: '\\ll', description: 'Much less than', example: 'a \\ll b', symbol: '≪', category: 'Relations', equationExample: 'r ≪ R', equationCode: 'r \\ll R' },
  { command: '\\gg', description: 'Much greater than', example: 'a \\gg b', symbol: '≫', category: 'Relations', equationExample: 'N ≫ 1', equationCode: 'N \\gg 1' },
  { command: '\\approx', description: 'Approximately equal', example: 'a \\approx b', symbol: '≈', category: 'Relations', equationExample: 'π ≈ 3.14', equationCode: '\\pi \\approx 3.14' },
  { command: '\\equiv', description: 'Equivalent', example: 'a \\equiv b', symbol: '≡', category: 'Relations', equationExample: 'a ≡ b (mod n)', equationCode: 'a \\equiv b \\pmod{n}' },
  { command: '\\sim', description: 'Similar', example: 'a \\sim b', symbol: '∼', category: 'Relations', equationExample: 'f(x) ∼ g(x)', equationCode: 'f(x) \\sim g(x)' },
  { command: '\\simeq', description: 'Similar or equal', example: 'a \\simeq b', symbol: '≃', category: 'Relations', equationExample: 'A ≃ B', equationCode: 'A \\simeq B' },
  { command: '\\cong', description: 'Congruent', example: 'a \\cong b', symbol: '≅', category: 'Relations', equationExample: 'ΔABC ≅ ΔDEF', equationCode: '\\triangle ABC \\cong \\triangle DEF' },
  { command: '\\propto', description: 'Proportional', example: 'a \\propto b', symbol: '∝', category: 'Relations', equationExample: 'F ∝ 1/r²', equationCode: 'F \\propto \\frac{1}{r^2}' },
  { command: '\\parallel', description: 'Parallel', example: 'a \\parallel b', symbol: '∥', category: 'Relations', equationExample: 'AB ∥ CD', equationCode: 'AB \\parallel CD' },
  { command: '\\perp', description: 'Perpendicular', example: 'a \\perp b', symbol: '⊥', category: 'Relations', equationExample: 'AB ⊥ CD', equationCode: 'AB \\perp CD' },
  
  // Set Theory
  { command: '\\in', description: 'Element of', example: 'x \\in A', symbol: '∈', category: 'Set Theory', equationExample: 'x ∈ ℝ', equationCode: 'x \\in \\mathbb{R}' },
  { command: '\\notin', description: 'Not element of', example: 'x \\notin A', symbol: '∉', category: 'Set Theory', equationExample: '0 ∉ ℕ', equationCode: '0 \\notin \\mathbb{N}' },
  { command: '\\subset', description: 'Subset', example: 'A \\subset B', symbol: '⊂', category: 'Set Theory', equationExample: 'ℕ ⊂ ℤ', equationCode: '\\mathbb{N} \\subset \\mathbb{Z}' },
  { command: '\\subseteq', description: 'Subset or equal', example: 'A \\subseteq B', symbol: '⊆', category: 'Set Theory', equationExample: 'A ⊆ A', equationCode: 'A \\subseteq A' },
  { command: '\\supset', description: 'Superset', example: 'A \\supset B', symbol: '⊃', category: 'Set Theory', equationExample: 'ℝ ⊃ ℚ', equationCode: '\\mathbb{R} \\supset \\mathbb{Q}' },
  { command: '\\supseteq', description: 'Superset or equal', example: 'A \\supseteq B', symbol: '⊇', category: 'Set Theory', equationExample: 'B ⊇ B', equationCode: 'B \\supseteq B' },
  { command: '\\cup', description: 'Union', example: 'A \\cup B', symbol: '∪', category: 'Set Theory', equationExample: 'A ∪ B = {x: x∈A or x∈B}', equationCode: 'A \\cup B = \\{x: x\\in A \\text{ or } x\\in B\\}' },
  { command: '\\cap', description: 'Intersection', example: 'A \\cap B', symbol: '∩', category: 'Set Theory', equationExample: 'A ∩ B = {x: x∈A and x∈B}', equationCode: 'A \\cap B = \\{x: x\\in A \\text{ and } x\\in B\\}' },
  { command: '\\setminus', description: 'Set difference', example: 'A \\setminus B', symbol: '∖', category: 'Set Theory', equationExample: 'A ∖ B = {x: x∈A, x∉B}', equationCode: 'A \\setminus B = \\{x: x\\in A, x\\notin B\\}' },
  { command: '\\emptyset', description: 'Empty set', example: '\\emptyset', symbol: '∅', category: 'Set Theory', equationExample: 'A ∩ ∅ = ∅', equationCode: 'A \\cap \\emptyset = \\emptyset' },
  { command: '\\varnothing', description: 'Variant empty set', example: '\\varnothing', symbol: '∅', category: 'Set Theory', equationExample: '|∅| = 0', equationCode: '|\\varnothing| = 0' },
  
  // Logic
  { command: '\\land', description: 'Logical and', example: 'p \\land q', symbol: '∧', category: 'Logic', equationExample: 'p ∧ q ⇒ p', equationCode: 'p \\land q \\Rightarrow p' },
  { command: '\\lor', description: 'Logical or', example: 'p \\lor q', symbol: '∨', category: 'Logic', equationExample: 'p ⇒ p ∨ q', equationCode: 'p \\Rightarrow p \\lor q' },
  { command: '\\lnot', description: 'Logical not', example: '\\lnot p', symbol: '¬', category: 'Logic', equationExample: '¬(¬p) ≡ p', equationCode: '\\lnot(\\lnot p) \\equiv p' },
  { command: '\\neg', description: 'Negation', example: '\\neg p', symbol: '¬', category: 'Logic', equationExample: 'p ∨ ¬p ≡ T', equationCode: 'p \\lor \\neg p \\equiv T' },
  { command: '\\implies', description: 'Implies', example: 'p \\implies q', symbol: '⟹', category: 'Logic', equationExample: 'x>0 ⟹ x²>0', equationCode: 'x>0 \\implies x^2>0' },
  { command: '\\impliedby', description: 'Implied by', example: 'p \\impliedby q', symbol: '⟸', category: 'Logic', equationExample: 'x=0 ⟸ x²=0', equationCode: 'x=0 \\impliedby x^2=0' },
  { command: '\\iff', description: 'If and only if', example: 'p \\iff q', symbol: '⟺', category: 'Logic', equationExample: 'x=0 ⟺ |x|=0', equationCode: 'x=0 \\iff |x|=0' },
  { command: '\\forall', description: 'For all', example: '\\forall x', symbol: '∀', category: 'Logic', equationExample: '∀x∈ℝ: x²≥0', equationCode: '\\forall x\\in\\mathbb{R}: x^2\\geq 0' },
  { command: '\\exists', description: 'There exists', example: '\\exists x', symbol: '∃', category: 'Logic', equationExample: '∃x∈ℝ: x²=4', equationCode: '\\exists x\\in\\mathbb{R}: x^2=4' },
  { command: '\\nexists', description: 'Not exists', example: '\\nexists x', symbol: '∄', category: 'Logic', equationExample: '∄x∈ℝ: x²=-1', equationCode: '\\nexists x\\in\\mathbb{R}: x^2=-1' },
  
  // Calculus
  { command: '\\lim', description: 'Limit', example: '\\lim_{x \\to 0}', symbol: 'lim', category: 'Calculus', equationExample: 'lim[x→0] sin(x)/x = 1', equationCode: '\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1' },
  { command: '\\lim_{x \\to a}', description: 'Limit as x approaches a', example: '\\lim_{x \\to \\infty} f(x)', symbol: 'lim', category: 'Calculus', equationExample: 'lim[x→∞] 1/x = 0', equationCode: '\\lim_{x \\to \\infty} \\frac{1}{x} = 0' },
  { command: '\\sum', description: 'Sum', example: '\\sum_{i=1}^{n} x_i', symbol: '∑', category: 'Calculus', equationExample: '∑[k=1 to ∞] 1/k² = π²/6', equationCode: '\\sum_{k=1}^{\\infty} \\frac{1}{k^2} = \\frac{\\pi^2}{6}' },
  { command: '\\prod', description: 'Product', example: '\\prod_{i=1}^{n} x_i', symbol: '∏', category: 'Calculus', equationExample: 'n! = ∏[k=1 to n] k', equationCode: 'n! = \\prod_{k=1}^{n} k' },
  { command: '\\int', description: 'Integral', example: '\\int f(x) dx', symbol: '∫', category: 'Calculus', equationExample: '∫ xⁿ dx = xⁿ⁺¹/(n+1)', equationCode: '\\int x^n dx = \\frac{x^{n+1}}{n+1}' },
  { command: '\\int_{a}^{b}', description: 'Definite integral', example: '\\int_{0}^{1} f(x) dx', symbol: '∫', category: 'Calculus', equationExample: '∫₀¹ x dx = ½', equationCode: '\\int_0^1 x dx = \\frac{1}{2}' },
  { command: '\\iint', description: 'Double integral', example: '\\iint f(x,y) dx dy', symbol: '∬', category: 'Calculus', equationExample: '∬ᴿ 1 dA = Area(R)', equationCode: '\\iint_R 1 \\, dA = \\text{Area}(R)' },
  { command: '\\iiint', description: 'Triple integral', example: '\\iiint f(x,y,z) dx dy dz', symbol: '∭', category: 'Calculus', equationExample: '∭ᴱ 1 dV = Volume(E)', equationCode: '\\iiint_E 1 \\, dV = \\text{Volume}(E)' },
  { command: '\\oint', description: 'Contour integral', example: '\\oint f(z) dz', symbol: '∮', category: 'Calculus', equationExample: '∮ᶜ f(z) dz = 2πi∑Res', equationCode: '\\oint_C f(z) dz = 2\\pi i \\sum \\text{Res}' },
  { command: '\\frac{d}{dx}', description: 'Derivative', example: '\\frac{d}{dx} f(x)', symbol: 'd/dx', category: 'Calculus', equationExample: 'd/dx[xⁿ] = nxⁿ⁻¹', equationCode: '\\frac{d}{dx}[x^n] = nx^{n-1}' },
  { command: '\\frac{\\partial}{\\partial x}', description: 'Partial derivative', example: '\\frac{\\partial f}{\\partial x}', symbol: '∂/∂x', category: 'Calculus', equationExample: '∂f/∂x|y const', equationCode: '\\frac{\\partial f}{\\partial x}\\Big|_y \\text{ const}' },
  { command: '\\nabla', description: 'Nabla (gradient)', example: '\\nabla f', symbol: '∇', category: 'Calculus', equationExample: '∇f = (∂f/∂x, ∂f/∂y)', equationCode: '\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)' },
  { command: '\\infty', description: 'Infinity', example: '\\lim_{x \\to \\infty}', symbol: '∞', category: 'Calculus', equationExample: 'lim[x→∞] eˣ = ∞', equationCode: '\\lim_{x \\to \\infty} e^x = \\infty' },
  
  // Linear Algebra
  { command: '\\mathbf{v}', description: 'Bold vector', example: '\\mathbf{v}', symbol: 'v', category: 'Linear Algebra' },
  { command: '\\vec{v}', description: 'Vector with arrow', example: '\\vec{v}', symbol: 'v⃗', category: 'Linear Algebra' },
  { command: '\\hat{v}', description: 'Unit vector', example: '\\hat{v}', symbol: 'v̂', category: 'Linear Algebra' },
  { command: '\\mathbf{A}', description: 'Bold matrix', example: '\\mathbf{A}', symbol: 'A', category: 'Linear Algebra' },
  { command: '\\det', description: 'Determinant', example: '\\det(A)', symbol: 'det', category: 'Linear Algebra' },
  { command: '\\tr', description: 'Trace', example: '\\tr(A)', symbol: 'tr', category: 'Linear Algebra' },
  { command: '\\transpose', description: 'Transpose', example: 'A^T', symbol: 'Aᵀ', category: 'Linear Algebra' },
  { command: '\\begin{matrix}', description: 'Matrix', example: '\\begin{matrix} a & b \\\\ c & d \\end{matrix}', symbol: '[a b; c d]', category: 'Linear Algebra' },
  { command: '\\begin{pmatrix}', description: 'Matrix with parentheses', example: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', symbol: '(a b; c d)', category: 'Linear Algebra' },
  { command: '\\begin{bmatrix}', description: 'Matrix with brackets', example: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}', symbol: '[a b; c d]', category: 'Linear Algebra' },
  { command: '\\begin{vmatrix}', description: 'Matrix with determinant bars', example: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', symbol: '|a b; c d|', category: 'Linear Algebra' },
  { command: '\\begin{Vmatrix}', description: 'Matrix with double bars', example: '\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}', symbol: '‖a b; c d‖', category: 'Linear Algebra' },
  { command: '\\cdot', description: 'Dot product', example: '\\mathbf{a} \\cdot \\mathbf{b}', symbol: '⋅', category: 'Linear Algebra' },
  { command: '\\times', description: 'Cross product', example: '\\mathbf{a} \\times \\mathbf{b}', symbol: '×', category: 'Linear Algebra' },
  { command: '\\otimes', description: 'Tensor product', example: '\\mathbf{a} \\otimes \\mathbf{b}', symbol: '⊗', category: 'Linear Algebra' },
  
  // Functions
  { command: '\\sin', description: 'Sine', example: '\\sin(x)', symbol: 'sin', category: 'Functions' },
  { command: '\\cos', description: 'Cosine', example: '\\cos(x)', symbol: 'cos', category: 'Functions' },
  { command: '\\tan', description: 'Tangent', example: '\\tan(x)', symbol: 'tan', category: 'Functions' },
  { command: '\\cot', description: 'Cotangent', example: '\\cot(x)', symbol: 'cot', category: 'Functions' },
  { command: '\\sec', description: 'Secant', example: '\\sec(x)', symbol: 'sec', category: 'Functions' },
  { command: '\\csc', description: 'Cosecant', example: '\\csc(x)', symbol: 'csc', category: 'Functions' },
  { command: '\\arcsin', description: 'Arcsine', example: '\\arcsin(x)', symbol: 'arcsin', category: 'Functions' },
  { command: '\\arccos', description: 'Arccosine', example: '\\arccos(x)', symbol: 'arccos', category: 'Functions' },
  { command: '\\arctan', description: 'Arctangent', example: '\\arctan(x)', symbol: 'arctan', category: 'Functions' },
  { command: '\\sinh', description: 'Hyperbolic sine', example: '\\sinh(x)', symbol: 'sinh', category: 'Functions' },
  { command: '\\cosh', description: 'Hyperbolic cosine', example: '\\cosh(x)', symbol: 'cosh', category: 'Functions' },
  { command: '\\tanh', description: 'Hyperbolic tangent', example: '\\tanh(x)', symbol: 'tanh', category: 'Functions' },
  { command: '\\ln', description: 'Natural logarithm', example: '\\ln(x)', symbol: 'ln', category: 'Functions' },
  { command: '\\log', description: 'Logarithm', example: '\\log(x)', symbol: 'log', category: 'Functions' },
  { command: '\\log_{a}', description: 'Logarithm base a', example: '\\log_{10}(x)', symbol: 'log₁₀', category: 'Functions' },
  { command: '\\exp', description: 'Exponential', example: '\\exp(x)', symbol: 'exp', category: 'Functions' },
  { command: 'e^x', description: 'Exponential e', example: 'e^x', symbol: 'eˣ', category: 'Functions' },
  { command: '\\max', description: 'Maximum', example: '\\max(a, b)', symbol: 'max', category: 'Functions' },
  { command: '\\min', description: 'Minimum', example: '\\min(a, b)', symbol: 'min', category: 'Functions' },
  { command: '\\sup', description: 'Supremum', example: '\\sup S', symbol: 'sup', category: 'Functions' },
  { command: '\\inf', description: 'Infimum', example: '\\inf S', symbol: 'inf', category: 'Functions' },
  { command: '\\arg', description: 'Argument', example: '\\arg(z)', symbol: 'arg', category: 'Functions' },
  { command: '\\gcd', description: 'Greatest common divisor', example: '\\gcd(a, b)', symbol: 'gcd', category: 'Functions' },
  { command: '\\lcm', description: 'Least common multiple', example: '\\lcm(a, b)', symbol: 'lcm', category: 'Functions' },
  
  // Arrows
  { command: '\\rightarrow', description: 'Right arrow', example: 'A \\rightarrow B', symbol: '→', category: 'Arrows' },
  { command: '\\leftarrow', description: 'Left arrow', example: 'A \\leftarrow B', symbol: '←', category: 'Arrows' },
  { command: '\\leftrightarrow', description: 'Left-right arrow', example: 'A \\leftrightarrow B', symbol: '↔', category: 'Arrows' },
  { command: '\\Rightarrow', description: 'Double right arrow', example: 'A \\Rightarrow B', symbol: '⇒', category: 'Arrows' },
  { command: '\\Leftarrow', description: 'Double left arrow', example: 'A \\Leftarrow B', symbol: '⇐', category: 'Arrows' },
  { command: '\\Leftrightarrow', description: 'Double left-right arrow', example: 'A \\Leftrightarrow B', symbol: '⇔', category: 'Arrows' },
  { command: '\\uparrow', description: 'Up arrow', example: '\\uparrow', symbol: '↑', category: 'Arrows' },
  { command: '\\downarrow', description: 'Down arrow', example: '\\downarrow', symbol: '↓', category: 'Arrows' },
  { command: '\\updownarrow', description: 'Up-down arrow', example: '\\updownarrow', symbol: '↕', category: 'Arrows' },
  { command: '\\Uparrow', description: 'Double up arrow', example: '\\Uparrow', symbol: '⇑', category: 'Arrows' },
  { command: '\\Downarrow', description: 'Double down arrow', example: '\\Downarrow', symbol: '⇓', category: 'Arrows' },
  { command: '\\Updownarrow', description: 'Double up-down arrow', example: '\\Updownarrow', symbol: '⇕', category: 'Arrows' },
  { command: '\\mapsto', description: 'Maps to', example: 'f: x \\mapsto x^2', symbol: '↦', category: 'Arrows' },
  { command: '\\to', description: 'To (short arrow)', example: 'x \\to y', symbol: '→', category: 'Arrows' },
  
  // Miscellaneous Symbols
  { command: '\\partial', description: 'Partial derivative symbol', example: '\\partial f', symbol: '∂', category: 'Miscellaneous' },
  { command: '\\hbar', description: 'h-bar (Planck constant)', example: '\\hbar', symbol: 'ℏ', category: 'Miscellaneous' },
  { command: '\\ell', description: 'Script l', example: '\\ell', symbol: 'ℓ', category: 'Miscellaneous' },
  { command: '\\Re', description: 'Real part', example: '\\Re(z)', symbol: 'ℜ', category: 'Miscellaneous' },
  { command: '\\Im', description: 'Imaginary part', example: '\\Im(z)', symbol: 'ℑ', category: 'Miscellaneous' },
  { command: '\\aleph', description: 'Aleph', example: '\\aleph_0', symbol: 'ℵ', category: 'Miscellaneous' },
  { command: '\\beth', description: 'Beth', example: '\\beth_1', symbol: 'ℶ', category: 'Miscellaneous' },
  { command: '\\gimel', description: 'Gimel', example: '\\gimel', symbol: 'ℷ', category: 'Miscellaneous' },
  { command: '\\daleth', description: 'Daleth', example: '\\daleth', symbol: 'ℸ', category: 'Miscellaneous' },
  { command: '\\angle', description: 'Angle', example: '\\angle ABC', symbol: '∠', category: 'Miscellaneous' },
  { command: '\\triangle', description: 'Triangle', example: '\\triangle ABC', symbol: '△', category: 'Miscellaneous' },
  { command: '\\square', description: 'Square', example: '\\square', symbol: '□', category: 'Miscellaneous' },
  { command: '\\Diamond', description: 'Diamond', example: '\\Diamond', symbol: '◊', category: 'Miscellaneous' },
  { command: '\\star', description: 'Star', example: '\\star', symbol: '⋆', category: 'Miscellaneous' },
  { command: '\\dagger', description: 'Dagger', example: '\\dagger', symbol: '†', category: 'Miscellaneous' },
  { command: '\\ddagger', description: 'Double dagger', example: '\\ddagger', symbol: '‡', category: 'Miscellaneous' },
  { command: '\\S', description: 'Section symbol', example: '\\S', symbol: '§', category: 'Miscellaneous' },
  { command: '\\P', description: 'Paragraph symbol', example: '\\P', symbol: '¶', category: 'Miscellaneous' },
  { command: '\\copyright', description: 'Copyright', example: '\\copyright', symbol: '©', category: 'Miscellaneous' },
  { command: '\\pounds', description: 'Pound sterling', example: '\\pounds', symbol: '£', category: 'Miscellaneous' },
  
  // Delimiters
  { command: '\\left(', description: 'Left parenthesis (scalable)', example: '\\left( \\frac{a}{b} \\right)', symbol: '(', category: 'Delimiters' },
  { command: '\\right)', description: 'Right parenthesis (scalable)', example: '\\left( \\frac{a}{b} \\right)', symbol: ')', category: 'Delimiters' },
  { command: '\\left[', description: 'Left bracket (scalable)', example: '\\left[ \\frac{a}{b} \\right]', symbol: '[', category: 'Delimiters' },
  { command: '\\right]', description: 'Right bracket (scalable)', example: '\\left[ \\frac{a}{b} \\right]', symbol: ']', category: 'Delimiters' },
  { command: '\\left\\{', description: 'Left brace (scalable)', example: '\\left\\{ \\frac{a}{b} \\right\\}', symbol: '{', category: 'Delimiters' },
  { command: '\\right\\}', description: 'Right brace (scalable)', example: '\\left\\{ \\frac{a}{b} \\right\\}', symbol: '}', category: 'Delimiters' },
  { command: '\\left|', description: 'Left vertical bar (scalable)', example: '\\left| \\frac{a}{b} \\right|', symbol: '|', category: 'Delimiters' },
  { command: '\\right|', description: 'Right vertical bar (scalable)', example: '\\left| \\frac{a}{b} \\right|', symbol: '|', category: 'Delimiters' },
  { command: '\\left\\|', description: 'Left double bar (scalable)', example: '\\left\\| \\frac{a}{b} \\right\\|', symbol: '‖', category: 'Delimiters' },
  { command: '\\right\\|', description: 'Right double bar (scalable)', example: '\\left\\| \\frac{a}{b} \\right\\|', symbol: '‖', category: 'Delimiters' },
  { command: '\\left\\langle', description: 'Left angle bracket (scalable)', example: '\\left\\langle \\frac{a}{b} \\right\\rangle', symbol: '⟨', category: 'Delimiters' },
  { command: '\\right\\rangle', description: 'Right angle bracket (scalable)', example: '\\left\\langle \\frac{a}{b} \\right\\rangle', symbol: '⟩', category: 'Delimiters' },
  { command: '\\left\\lceil', description: 'Left ceiling (scalable)', example: '\\left\\lceil \\frac{a}{b} \\right\\rceil', symbol: '⌈', category: 'Delimiters' },
  { command: '\\right\\rceil', description: 'Right ceiling (scalable)', example: '\\left\\lceil \\frac{a}{b} \\right\\rceil', symbol: '⌉', category: 'Delimiters' },
  { command: '\\left\\lfloor', description: 'Left floor (scalable)', example: '\\left\\lfloor \\frac{a}{b} \\right\\rfloor', symbol: '⌊', category: 'Delimiters' },
  { command: '\\right\\rfloor', description: 'Right floor (scalable)', example: '\\left\\lfloor \\frac{a}{b} \\right\\rfloor', symbol: '⌋', category: 'Delimiters' },
  
  // Spacing
  { command: '\\,', description: 'Thin space', example: 'a\\,b', symbol: ' ', category: 'Spacing' },
  { command: '\\:', description: 'Medium space', example: 'a\\:b', symbol: ' ', category: 'Spacing' },
  { command: '\\;', description: 'Thick space', example: 'a\\;b', symbol: ' ', category: 'Spacing' },
  { command: '\\quad', description: 'Quad space', example: 'a\\quad b', symbol: '    ', category: 'Spacing' },
  { command: '\\qquad', description: 'Double quad space', example: 'a\\qquad b', symbol: '        ', category: 'Spacing' },
  { command: '\\!', description: 'Negative thin space', example: 'a\\!b', symbol: '', category: 'Spacing' },
  { command: '\\ ', description: 'Regular space', example: 'a\\ b', symbol: ' ', category: 'Spacing' },
  
  // Text in Math
  { command: '\\text{text}', description: 'Text in math mode', example: '\\text{if } x > 0', symbol: 'text', category: 'Text' },
  { command: '\\textit{text}', description: 'Italic text', example: '\\textit{italic}', symbol: 'italic', category: 'Text' },
  { command: '\\textbf{text}', description: 'Bold text', example: '\\textbf{bold}', symbol: 'bold', category: 'Text' },
  { command: '\\textrm{text}', description: 'Roman text', example: '\\textrm{roman}', symbol: 'roman', category: 'Text' },
  { command: '\\textsf{text}', description: 'Sans-serif text', example: '\\textsf{sans-serif}', symbol: 'sans-serif', category: 'Text' },
  { command: '\\texttt{text}', description: 'Monospace text', example: '\\texttt{monospace}', symbol: 'monospace', category: 'Text' },
  { command: '\\mathrm{text}', description: 'Roman in math', example: '\\mathrm{d}x', symbol: 'd', category: 'Text' },
  { command: '\\mathit{text}', description: 'Italic in math', example: '\\mathit{var}', symbol: 'var', category: 'Text' },
  { command: '\\mathbf{text}', description: 'Bold in math', example: '\\mathbf{x}', symbol: 'x', category: 'Text' },
  { command: '\\mathsf{text}', description: 'Sans-serif in math', example: '\\mathsf{A}', symbol: 'A', category: 'Text' },
  { command: '\\mathtt{text}', description: 'Monospace in math', example: '\\mathtt{code}', symbol: 'code', category: 'Text' },
  { command: '\\mathcal{text}', description: 'Calligraphic', example: '\\mathcal{A}', symbol: '𝒜', category: 'Text' },
  { command: '\\mathscr{text}', description: 'Script', example: '\\mathscr{A}', symbol: '𝒜', category: 'Text' },
  { command: '\\mathfrak{text}', description: 'Fraktur', example: '\\mathfrak{A}', symbol: '𝔄', category: 'Text' },
  { command: '\\mathbb{text}', description: 'Blackboard bold', example: '\\mathbb{R}', symbol: 'ℝ', category: 'Text' },
  
  // Accents
  { command: '\\hat{a}', description: 'Hat accent', example: '\\hat{a}', symbol: 'â', category: 'Accents' },
  { command: '\\widehat{abc}', description: 'Wide hat', example: '\\widehat{abc}', symbol: 'âbc', category: 'Accents' },
  { command: '\\tilde{a}', description: 'Tilde accent', example: '\\tilde{a}', symbol: 'ã', category: 'Accents' },
  { command: '\\widetilde{abc}', description: 'Wide tilde', example: '\\widetilde{abc}', symbol: 'ãbc', category: 'Accents' },
  { command: '\\bar{a}', description: 'Bar accent', example: '\\bar{a}', symbol: 'ā', category: 'Accents' },
  { command: '\\overline{abc}', description: 'Overline', example: '\\overline{abc}', symbol: 'ābc', category: 'Accents' },
  { command: '\\underline{abc}', description: 'Underline', example: '\\underline{abc}', symbol: 'a̱bc', category: 'Accents' },
  { command: '\\dot{a}', description: 'Dot accent', example: '\\dot{a}', symbol: 'ȧ', category: 'Accents' },
  { command: '\\ddot{a}', description: 'Double dot accent', example: '\\ddot{a}', symbol: 'ä', category: 'Accents' },
  { command: '\\vec{a}', description: 'Vector arrow', example: '\\vec{a}', symbol: 'a⃗', category: 'Accents' },
  { command: '\\acute{a}', description: 'Acute accent', example: '\\acute{a}', symbol: 'á', category: 'Accents' },
  { command: '\\grave{a}', description: 'Grave accent', example: '\\grave{a}', symbol: 'à', category: 'Accents' },
  { command: '\\breve{a}', description: 'Breve accent', example: '\\breve{a}', symbol: 'ă', category: 'Accents' },
  { command: '\\check{a}', description: 'Check accent', example: '\\check{a}', symbol: 'ǎ', category: 'Accents' },
  
  // Environments
  { command: '\\begin{equation}', description: 'Numbered equation', example: '\\begin{equation}\na = b\n\\end{equation}', symbol: '(1)', category: 'Environments' },
  { command: '\\begin{equation*}', description: 'Unnumbered equation', example: '\\begin{equation*}\na = b\n\\end{equation*}', symbol: 'a = b', category: 'Environments' },
  { command: '\\begin{align}', description: 'Aligned equations', example: '\\begin{align}\na &= b \\\\\nc &= d\n\\end{align}', symbol: 'a = b\nc = d', category: 'Environments' },
  { command: '\\begin{align*}', description: 'Unnumbered aligned equations', example: '\\begin{align*}\na &= b \\\\\nc &= d\n\\end{align*}', symbol: 'a = b\nc = d', category: 'Environments' },
  { command: '\\begin{cases}', description: 'Cases', example: 'f(x) = \\begin{cases}\nx & \\text{if } x \\geq 0 \\\\\n-x & \\text{if } x < 0\n\\end{cases}', symbol: '{x if x≥0; -x if x<0', category: 'Environments' },
  { command: '\\begin{split}', description: 'Split equation', example: '\\begin{split}\na &= b + c \\\\\n&= d + e\n\\end{split}', symbol: 'a = b + c\n  = d + e', category: 'Environments' },
  { command: '\\begin{gathered}', description: 'Gathered equations', example: '\\begin{gathered}\na = b \\\\\nc = d\n\\end{gathered}', symbol: 'a = b\nc = d', category: 'Environments' },
  { command: '\\begin{multline}', description: 'Multi-line equation', example: '\\begin{multline}\na + b + c + d \\\\\n= e + f + g\n\\end{multline}', symbol: 'a + b + c + d\n= e + f + g', category: 'Environments' },
];

const categories = Array.from(new Set(latexCommands.map(cmd => cmd.category))).sort();

const CheatSheetPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const filteredCommands = useMemo(() => {
    return latexCommands.filter(cmd => {
      const matchesSearch = cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cmd.example.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || cmd.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const copyToClipboard = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-main)] mb-4">
            Library
          </h1>
          <p className="text-xl text-[var(--color-sub)]">
            Complete reference for LaTeX mathematical notation
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-[var(--color-menu)] rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-sub)] w-5 h-5" />
              <input
                type="text"
                placeholder="Search commands, descriptions, or examples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-box)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-main)] text-[var(--color-text)] placeholder-[var(--color-sub)]"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-[var(--color-box)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-main)] text-[var(--color-text)] min-w-[200px]"
              title="Select category"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="mt-4 text-sm text-[var(--color-sub)]">
            Showing {filteredCommands.length} of {latexCommands.length} commands
          </div>
        </div>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCommands.map((cmd, index) => (
            <div
              key={index}
              className="bg-[var(--color-menu)] rounded-lg hover:bg-[var(--color-box)] transition-colors duration-300 overflow-hidden border border-[var(--color-border)]"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block px-2 py-1 bg-[var(--color-main)] text-[var(--color-bg)] text-xs font-medium rounded-full">
                    {cmd.category}
                  </span>
                  <button
                    onClick={() => copyToClipboard(cmd.command)}
                    className="p-1 text-[var(--color-sub)] hover:text-[var(--color-main)] transition-colors"
                    title="Copy command"
                  >
                    {copiedCommand === cmd.command ? (
                      <CheckCircle className="w-4 h-4 text-[var(--color-correct)]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <h3 className="text-base font-semibold text-[var(--color-text)] mb-3">
                  {cmd.description}
                </h3>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Left Column - Symbol & Command */}
                  <div className="space-y-2">
                    {/* Symbol Display */}
                    {cmd.symbol && (
                      <div>
                        <label className="block text-xs font-medium text-[var(--color-sub)] mb-1">
                          Symbol:
                        </label>
                        <div className="flex items-center justify-center h-8 bg-[var(--color-box)] rounded border border-[var(--color-border)]">
                          <span className="text-lg text-[var(--color-main)] font-mono">
                            {cmd.symbol}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Command */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-sub)] mb-1">
                        Command:
                      </label>
                      <code className="block w-full p-2 h-8 bg-[var(--color-box)] border border-[var(--color-border)] rounded text-xs font-mono text-[var(--color-main)] overflow-hidden flex items-center">
                        {cmd.command}
                      </code>
                    </div>
                  </div>
                  
                  {/* Right Column - Rendered LaTeX Example */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-sub)] mb-1">
                      Example:
                    </label>
                    <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded p-3 h-[92px] flex items-center justify-center">
                      {/* Rendered LaTeX */}
                      <div className="text-white text-base">
                        <InlineMath 
                          math={cmd.equationCode || cmd.command} 
                          renderError={(error) => (
                            <span className="text-[var(--color-error)] text-xs">
                              {cmd.equationExample || cmd.example}
                            </span>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Usage - Raw LaTeX Code */}
                <div>
                  <label className="block text-xs font-medium text-[var(--color-sub)] mb-1">
                    Usage:
                  </label>
                  <code className="block w-full p-2 bg-[var(--color-box)] border border-[var(--color-border)] rounded text-xs font-mono text-[var(--color-text)] break-all">
                    {cmd.equationCode || cmd.command}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCommands.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[var(--color-sub)] text-lg">
              No commands found matching your search criteria.
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-6 py-2 bg-[var(--color-main)] text-[var(--color-bg)] rounded-lg hover:opacity-80 transition-opacity"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-12 bg-[var(--color-menu)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-main)] mb-4">
            Quick Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[var(--color-text)]">
            <div>
              <h3 className="font-semibold text-[var(--color-main)] mb-2">Basic Syntax</h3>
              <ul className="space-y-1">
                <li>• Use <code className="bg-[var(--color-box)] border border-[var(--color-border)] px-1 rounded text-[var(--color-main)]">$...$</code> for inline math</li>
                <li>• Use <code className="bg-[var(--color-box)] border border-[var(--color-border)] px-1 rounded text-[var(--color-main)]">$$...$$</code> for display math</li>
                <li>• Use <code className="bg-[var(--color-box)] border border-[var(--color-border)] px-1 rounded text-[var(--color-main)]">{`{}`}</code> to group expressions</li>
                <li>• Use <code className="bg-[var(--color-box)] border border-[var(--color-border)] px-1 rounded text-[var(--color-main)]">\\</code> before command names</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-main)] mb-2">Common Patterns</h3>
              <ul className="space-y-1">
                <li>• Subscripts: <code className="bg-[var(--color-box)] border border-[var(--color-border)] px-1 rounded text-[var(--color-main)]">x_1</code></li>
                <li>• Superscripts: <code className="bg-[var(--color-box)] border border-[var(--color-border)] px-1 rounded text-[var(--color-main)]">x^2</code></li>
                <li>• Fractions: <code className="bg-[var(--color-box)] border border-[var(--color-border)] px-1 rounded text-[var(--color-main)]">{'\\frac{a}{b}'}</code></li>
                <li>• Square roots: <code className="bg-[var(--color-box)] border border-[var(--color-border)] px-1 rounded text-[var(--color-main)]">{'\\sqrt{x}'}</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheatSheetPage;
