import punycode from "punycode";
export const convertPunycodeToCyrillic=(domain: string) =>{
  // Разбиение домена на части по точкам
  const parts = domain.split(".");

  // Преобразование каждой части домена, если она в формате Punycode
  const convertedParts = parts.map((part) => {
    // Проверка, начинается ли часть с 'xn--', что указывает на Punycode
    if (part.startsWith("xn--")) {
      // Преобразование из Punycode в Unicode
      return punycode.toUnicode(part);
    } else {
      // Оставляем часть без изменений
      return part;
    }
  });

  // Соединение преобразованных частей обратно в домен
  return convertedParts.join(".");
}