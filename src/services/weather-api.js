const API_BASE = 'https://apitempo.inmet.gov.br/condicao/capitais/';

export const fetchWeatherData = async () => {
  const today = new Date();
  today.setDate(today.getDate());
  const API = API_BASE + today.toLocaleDateString('sv-SE');

  const response = await fetch(API);

  // Verifica se a resposta da API foi bem-sucedida
  if (!response.ok) {
    throw new Error(`API response error: ${response.status}`);
  }

  const data = await response.json();
  return cleanData(data);
};

const cleanData = (data) => {
  return data.map((item) => {
    const cleanedItem = { ...item };
    for (let key in cleanedItem) {
      if (cleanedItem[key] === "*") {
        cleanedItem[key] = "0";
      } else {
        cleanedItem[key] = cleanedItem[key].replace("*", "");
      }
    }
    return cleanedItem;
  });
};