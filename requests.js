axios.defaults.baseURL = config.baseUrl;

const getZones = async () => await getData("/zones");

const getRegions = async () => await getData("/regions");

const getCities = async () => await getData("/cities");

const getFormats = async () => await getData("/formats");

const getCategories = async () => await getData("/categories");

const getChannels = async () => await getData("/channels");

const getTypes = async () => await getData("/types");

const getData = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export {
  getZones,
  getRegions,
  getCities,
  getFormats,
  getCategories,
  getChannels,
  getTypes,
};
