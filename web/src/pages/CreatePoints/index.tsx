import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { LeafletMouseEvent } from "leaflet";
import { Map, TileLayer, Marker } from "react-leaflet";

import api from "../../services/api";
import { getUFs, getCities } from "../../services/localidade";
import Dropzone from "../../components/Dropzone";

import "./styles.css";
import logo from "../../assets/logo.svg";

interface Item {
  id: number;
  title: string;
  image_url: string;
}
interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  uf: string;
  city: string;
  latitude: number;
  longitude: number;
  items: number[];
  image?: File;
}
const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    whatsapp: "",
    uf: "",
    city: "",
    latitude: 0,
    longitude: 0,
    items: [],
  });
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [inicialPosition, setInicialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInicialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get("/items").then((response) => {
      setItems(response.data);
    });
  }, []);
  useEffect(() => {
    getUFs().then((response) => {
      const ufsIniticial = response.data.map((uf) => uf.sigla);
      setUfs(ufsIniticial);
    });
  }, []);

  useEffect(() => {
    let uf = formData.uf;
    getCities(uf).then((response) => {
      const cityNames = response.data.map((city) => city.nome);
      setCities(cityNames);
    });
  }, [formData.uf]);

  function handleSelecttUf(event: ChangeEvent<HTMLSelectElement>) {
    setFormData({ ...formData, uf: event.target.value });
  }

  function handleSelectCiry(event: ChangeEvent<HTMLSelectElement>) {
    setFormData({ ...formData, city: event.target.value });
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    setFormData({ ...formData, latitude: lat, longitude: lng });
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = formData.items.includes(id);
    if (alreadySelected) {
      const filteredItems = formData.items.filter((item) => item !== id);
      setFormData({ ...formData, items: filteredItems });
    } else {
      let items = formData.items;
      items.push(id);
      setFormData({ ...formData, items });
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("whatsapp", formData.whatsapp);
    data.append("uf", formData.uf);
    data.append("city", formData.city);
    data.append("latitude", String(formData.latitude));
    data.append("longitude", String(formData.longitude));
    data.append("items", formData.items.join(","));

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    await api.post("/points", data);
    alert("Cadastrado com sucesso");
    history.push("/");
  }
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do
          <br />
          ponto de coleta
        </h1>
        <Dropzone onUploaded={setSelectedFile} />
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="">E-Mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={inicialPosition} zoom={15} onclick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[formData.latitude, formData.longitude]} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="Estado (UF)"></label>
              <select
                name="uf"
                id="uf"
                value={formData.uf}
                onChange={handleSelecttUf}
              >
                <option value="0">Selecion uma uf</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="Cidade"></label>
              <select
                name="city"
                id="city"
                value={formData.city}
                onChange={handleSelectCiry}
              >
                <option value="0">Selecion uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => {
              return (
                <li
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={formData.items.includes(item.id) ? "selected" : ""}
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
