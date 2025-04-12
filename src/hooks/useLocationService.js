wwwwwwwwwwwwwwwww// this is for getting country, state & city list in array
import { useState } from "react";
import API from "../http/api";
import { toast } from "react-toastify";

// Cache object to store fetched countries, states, and cities
const cache = {
  countries: [],
  states: {},
  cities: {},
};

// api call for countries
const fetchCountriesAPI = async (setLoading) => {
  try {
    setLoading(true);
    const response = await API.get('country');
    if (response?.status === 200) {
      return response?.data;
    } else {
      toast.error(response?.message);
      console.error(response?.message);
    }
  } catch (error) {
    console.error(error.message);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

// api call for states
const fetchStatesAPI = async (countryId, setLoading) => {
  try {
    setLoading(true);
    if (!countryId) return;

    const response = await API.post('state', { country_id: countryId });
    if (response?.status === 200) {
      return response?.data;
    } else {
      toast.error(response?.message);
      console.error(response?.message);
    }
  } catch (error) {
    console.error(error.message);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

// api call for cities
const fetchCitiesAPI = async (stateId, setLoading) => {
  try {
    setLoading(true);
    if (!stateId) return;

    const response = await API.post('city', { state_id: stateId });
    if (response?.status === 200) {
      return response?.data;
    } else {
      toast.error(response?.message);
      console.error(response?.message);
    }
  } catch (error) {
    console.error(error.message);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

// API Service for fetching countries, states, and cities
const useLocationService = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState({});
  const [cities, setCities] = useState({});

  // Fetch countries only once and cache them
  const fetchCountries = async (setLoading) => {
    if (cache.countries?.length === 0) { // Check if countries are already cached
      const countriesData = await fetchCountriesAPI(setLoading);
      cache.countries = countriesData;
    }
    setCountries(cache.countries); // Set the cached countries
  };

  // Fetch states based on countryId, cache them, and dynamically update states
  const fetchStates = async (countryId, setLoading) => {
    if (!cache.states[countryId]) { // Check if states for this country are cached
      const statesData = await fetchStatesAPI(countryId, setLoading);
      cache.states[countryId] = statesData; // Cache the states for this countryId
    }
    setStates(cache.states[countryId]); // Set the cached states for the selected country
  };

  // Fetch cities based on stateId, cache them, and dynamically update cities
  const fetchCities = async (stateId, setLoading) => {
    if (!cache.cities[stateId]) { // Check if cities for this state are cached
      const citiesData = await fetchCitiesAPI(stateId, setLoading);
      cache.cities[stateId] = citiesData; // Cache the cities for this stateId
    }
    setCities(cache.cities[stateId]); // Set the cached cities for the selected state
  };

  return { countries, states, cities, fetchCountries, fetchStates, fetchCities };
};

export default useLocationService;