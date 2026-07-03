const providerInstructions: Record<string, string[]> = {
  openai: [
    "OpenAI face optimization: use explicit natural-language identity anchors and avoid over-editing facial structure.",
    "Preserve the uploaded person's face shape, eyes, nose, lips, jawline, hairstyle and expression as much as supported.",
  ],
  gemini: [
    "Gemini face optimization: describe semantic facial consistency clearly and keep source identity constraints explicit.",
    "Avoid changing age, expression, hairstyle or facial proportions unless required by the scene.",
  ],
  flux: [
    "Flux face optimization: use dense photorealistic facial descriptors, natural skin texture, lens realism and clean lighting.",
    "Emphasize sharp eyes, detailed eyebrows, realistic facial hair and natural facial asymmetry.",
  ],
  "stable-diffusion": [
    "Stable Diffusion face optimization: compact positive facial descriptors with strong negative terms for deformed eyes, bad face and waxy skin.",
    "Prioritize realistic eyes, symmetrical face structure, natural skin detail and correct facial proportions.",
  ],
  future: [
    "Future provider face optimization: use provider-neutral identity preservation and realistic face quality instructions.",
  ],
};

export class ProviderFaceOptimizer {
  optimize(provider: string) {
    return providerInstructions[provider.toLowerCase()] ?? providerInstructions.future;
  }
}
