export function formatErrorMessage(
  template: string,
  valueByToken: Record<string, string>
): string {
  let formattedTemplate = template;

  for (const [token, value] of Object.entries(valueByToken)) {
    formattedTemplate = formattedTemplate.replaceAll(`{${token}}`, value);
  }

  return formattedTemplate;
}
