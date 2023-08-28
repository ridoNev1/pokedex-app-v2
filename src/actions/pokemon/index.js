import axios from "axios";
import { API_URL } from "helpers/env";

const getDetailPokemon = async (data) => {
  try {
    return await Promise.all(
      data.map(async (pokemon) => {
        if (pokemon.url) {
          const response = await axios.get(pokemon.url);
          return response.data;
        } else {
          const response = await axios.get(pokemon.pokemon.url);
          return response.data;
        }
      })
    );
  } catch (error) {
    console.log("[Error Api]", error);
    throw error;
  }
};

const getListPokemon = async (offset, limit, filter) => {
  try {
    let response = null;

    if (filter) {
      response = await axios.get(`${API_URL}/type/${filter}`);
    } else {
      response = await axios.get(
        `${API_URL}/pokemon?offset=${offset}&limit=${limit}`
      );
    }

    let data = [];
    if (response?.data?.results?.length > 0) {
      data = await getDetailPokemon(response?.data?.results);
    } else {
      const startIndex = offset;
      const endIndex = startIndex + limit;
      const currentPageData = response?.data?.pokemon?.slice(
        startIndex,
        endIndex
      );
      data = await getDetailPokemon(currentPageData);
    }

    return {
      count: response.data.count || response?.data?.pokemon?.length,
      results: data
    };
  } catch (error) {
    console.log("[Error Api]", error);
    throw error;
  }
};

export { getListPokemon };
