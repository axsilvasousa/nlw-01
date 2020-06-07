import axios from "axios";

interface IBGEUFReponse {
  sigla: string;
}

interface IBGEMunicipioReponse {
  nome: string;
}

export const getUFs = () =>
  axios.get<IBGEUFReponse[]>(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
  );
export const getCities = (uf: string) =>
  axios.get<IBGEMunicipioReponse[]>(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
  );
