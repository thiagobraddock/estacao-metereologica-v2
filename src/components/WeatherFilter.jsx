import React, { useEffect, useState } from 'react';
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
    <div>
      <header>
        <div className="filter-city">
          <input
            placeholder="Filtro por cidade"
            type="text"
            id=""
            name="cityName"
            value={cityInput}
            onChange={(e) => {
              setNameInput(e.currentTarget.value);
            }}
          />
        </div>
        <select
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
          value={filterCriteria.condition}
          onChange={(e) =>
            setFilterCriteria({ ...filterCriteria, condition: e.target.value })
          }
        >
          <option value="">Selecione uma condição</option>
          <option value=">">MAIOR DO QUE</option>
          <option value="<">MENOR DO QUE </option>
          <option value="=">IGUAL </option>
        </select>
        <input
          placeholder="Digite o valor"
          type="text"
          id=""
          name="filterValue"
          value={filterCriteria.value}
          onChange={(e) =>
            setFilterCriteria({ ...filterCriteria, value: e.target.value })
          }
        />
        <div className="buttons">
          <button
            className="add"
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
            className="clear"
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
        <div className="activeFilters" key={index}>
          <button
            onClick={() => {
              const cloneArray = [...activeFilters];
              cloneArray.splice(index, 1);
              setActiveFilters(cloneArray);
            }}
          >
            𝙭
          </button>
          <span>
            {filter.column} {filter.condition} {filter.value}
          </span>
        </div>
      ))}
      {/* table */}
      <table>
        <thead>
          <tr>
            <th>CAPITAL</th>
            <th>TEMP MÍN</th>
            <th>TEMP MÁX</th>
            <th>CHUVA</th>
          </tr>
        </thead>
        <tbody>
          {weatherData
            .filter((el) =>
              el.CAPITAL.toLowerCase().includes(cityInput.toLowerCase())
            )
            .filter(applyFilters)
            .map((dados) => (
              <tr key={dados.CAPITAL}>
                <td>{dados.CAPITAL}</td>
                <td>{dados.TMIN18}</td>
                <td>{dados.TMAX18}</td>
                <td>{dados.PMAX12}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeatherFilter;
