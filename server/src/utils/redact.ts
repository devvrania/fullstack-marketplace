export function redact(text: string): string {
    return text
        .replace(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
            '[redacted email]'
        )
        .replace(
            /\+?\d[\d\s\-()]{7,}\d/gi,
            '[redacted phone]'
        );
}
