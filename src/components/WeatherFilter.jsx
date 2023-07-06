import  { useEffect, useState } from 'react';
import { fetchWeatherData } from '../services/weather-api';

function WeatherFilter() {
  // estado para armazenar os critérios de filtro (selecionados)
  const [filterCriteria, setFilterCriteria] = useState({
    column: '',
    condition: '',
    value: '',
  });

  // estado para nome das capitais
  const [cityInput, setNameInput] = useState('');

  // estado para armazenar os dados metereologicos
  const [weatherData, setWeatherData] = useState([]);

  // estado para armazenar os filtros selecionados
  const [activeFilters, setActiveFilters] = useState([]);

  // Busca os dados meteorológicos na API quando o componente é montado
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWeatherData();
        setWeatherData(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // função para aplicar os filtros aos dados

  const applyFilters = (row) => {
    const filterResults = [];
    // percorre os filtros ativos
    activeFilters.forEach((filter) => {
      switch (filter.condition) {
        case '>':
          filterResults.push(Number(row[filter.column]) > Number(filter.value));
          break;
        case '<':
          filterResults.push(Number(row[filter.column]) < Number(filter.value));
          break;
        case '=':
          filterResults.push(
            Number(row[filter.column]) === Number(filter.value)
          );
          break;
        default:
          break;
      }
    });
    // retorna true se todos os filtros forem verdadeiros
    return filterResults.every((result) => result);
  };

  // função para verificar se um filtro já está ativo
  const isOptionSelected = (option) =>
    !activeFilters.find((filter) => option === filter.column);

  return (
    <div className="container mx-auto px-4">
      <header className="my-4">
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4"
          placeholder="Filtro por cidade"
          type="text"
          id=""
          name="cityName"
          value={cityInput}
          onChange={(e) => {
            setNameInput(e.currentTarget.value);
          }}
        />
        <div className="flex flex-col md:flex-row md:space-x-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4 md:flex-grow"
            value={filterCriteria.column}
            onChange={(e) =>
              setFilterCriteria({ ...filterCriteria, column: e.target.value })
            }
          >
            <option value="">Selecione uma coluna</option>
            {['PMAX12', 'TMIN18', 'TMAX18']
              .filter(isOptionSelected)
              .map((column) => (
                <option value={column} key={column}>
                  {column}
                </option>
              ))}
          </select>
          <select
            className="px-3 py-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4 md:flex-grow"
            value={filterCriteria.condition}
            onChange={(e) =>
              setFilterCriteria({
                ...filterCriteria,
                condition: e.target.value,
              })
            }
          >
            <option value="">Selecione uma condição</option>
            <option value=">">MAIOR DO QUE</option>
            <option value="<">MENOR DO QUE </option>
            <option value="=">IGUAL </option>
          </select>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4 md:flex-grow"
            placeholder="Digite o valor"
            type="number"
            id=""
            name="filterValue"
            value={filterCriteria.value}
            onChange={(e) =>
              setFilterCriteria({ ...filterCriteria, value: e.target.value })
            }
          />
        </div>
        <div className="">
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={() => {
              setActiveFilters([...activeFilters, filterCriteria]);
              setFilterCriteria({
                column: '',
                condition: '',
                value: '',
              });
            }}
          >
            ADICIONAR
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setActiveFilters([]);
              setFilterCriteria({
                column: '',
                condition: '',
                value: '',
              });
            }}
          >
            LIMPAR
          </button>
        </div>
      </header>
      {activeFilters.map((filter, index) => (
        <div
          className="activeFilters bg-gray-700 px-3 py-1 flex items-center justify-between mb-4"
          key={index}
        >
          <span className="font-bold text-white">
            {filter.column} {filter.condition} {filter.value}
          </span>
          <button
            className="ml-2 bg-red-500 text-white w-5 h-5 flex justify-center items-center"
            onClick={() => {
              const cloneArray = [...activeFilters];
              cloneArray.splice(index, 1);
              setActiveFilters(cloneArray);
            }}
          >
            𝙭
          </button>
        </div>
      ))}
      {/* table */}
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">CAPITAL</th>
            <th className="py-3 px-6 text-left">TEMP MÍN</th>
            <th className="py-3 px-6 text-left">TEMP MÁX</th>
            <th className="py-3 px-6 text-left">CHUVA</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {weatherData
            .filter((el) =>
              el.CAPITAL.toLowerCase().includes(cityInput.toLowerCase())
            )
            .filter(applyFilters)
            .map((dados) => (
              <tr
                key={dados.CAPITAL}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{dados.CAPITAL}</td>
                <td className="py-3 px-6 text-left">{dados.TMIN18}</td>
                <td className="py-3 px-6 text-left">{dados.TMAX18}</td>
                <td className="py-3 px-6 text-left">{dados.PMAX12}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeatherFilter;
