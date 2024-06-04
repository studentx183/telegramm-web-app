import {
  getRegionsByZoneId,
  getCitiesByRegionId,
  getFormats,
  getCategories,
  getChannels,
  getTypes,
  postClient,
  postRegistrationData,
} from "./requests.js";

let selectedLocation = null;

// on DOM mounted functions
const onMountedFuncs = async () => {
  DemoApp.init();
  const agentCode = await getAgentCode();
  setAgentCode(agentCode);
  validateAgentCodeOnInput();
};

const getAgentCode = async () => {
  // gets agent code from the backend by sending initDataUnsafe of Telegram.WebApp
  const userData = DemoApp.initDataUnsafe;
  if (!Object.keys(userData).length) return undefined;
  const { data: agentCode } = await postRegistrationData(userData);
  return agentCode || undefined;
};

const setAgentCode = (agentCode) => {
  if (agentCode) {
    const agentCodeInput = document.getElementById("agent-code-input");
    agentCodeInput.value = agentCode;
  }
};

// validations
const isValidForm = () => {
  const isSelectBoxesValid = validateSelectBoxes();
  const isValidAgentCode = validateAgentCode();
  const isNameValid = validateName();
  const isPhoneValid = validatePhone();
  const isInnValid = validateInn();
  const isLegalNameValid = validateLegalName();
  const isAddressValid = validateAddress();
  const isReferencePointValid = validateReferencePoint();

  if (!isSelectBoxesValid) {
    alert("Выберите все поля");
    return false;
  } else if (
    !isValidAgentCode ||
    !isNameValid ||
    !isPhoneValid ||
    !isInnValid ||
    !isLegalNameValid ||
    !isAddressValid ||
    !isReferencePointValid
  ) {
    return false;
  } else if (!selectedLocation) {
    alert("Выберите местоположение на карте");
    return false;
  }
  return true;
};

const validateEnteredValue = (element, value) => {
  const regex = /^[a-zA-Z0-9_.-\s]*$/;
  if (!value.match(regex)) {
    const sanitizedValue = value.replace(/[^a-zA-Z0-9_.-\s]/g, "");
    element.value = sanitizedValue;
  }
};

const convertToUpperCase = (element) => {
  element.value = element.value.toUpperCase();
};

const validateAgentCode = () => {
  const agentCodeInput = document.getElementById("agent-code-input");
  validateEnteredValue(agentCodeInput, agentCodeInput.value);
  convertToUpperCase(agentCodeInput);
  const errorTag = agentCodeInput.nextElementSibling;
  if (agentCodeInput.value.length < 3) {
    errorTag.textContent = "*Минимум 3 символов";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

const validatePhone = () => {
  const phoneInput = document.getElementById("phone-input");
  const errorTag = phoneInput.nextElementSibling;
  if (phoneInput.value.length !== 19) {
    errorTag.textContent = "*Введите корректный номер телефона";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

const validateInn = () => {
  const innInput = document.getElementById("inn-input");
  const errorTag = innInput.nextElementSibling;
  if (innInput.value.length < 11) {
    errorTag.textContent = "*Введите корректный ИНН";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

const validateAddress = () => {
  const addressInput = document.getElementById("address-input");
  validateEnteredValue(addressInput, addressInput.value);
  convertToUpperCase(addressInput);
  const errorTag = addressInput.nextElementSibling;
  if (addressInput.value.length < 5) {
    errorTag.textContent = "*Минимум 5 символов";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

const validateName = () => {
  const nameInput = document.getElementById("name-input");
  validateEnteredValue(nameInput, nameInput.value);
  convertToUpperCase(nameInput);
  const errorTag = nameInput.nextElementSibling;
  if (nameInput.value.length < 5) {
    errorTag.textContent = "*Минимум 5 символов";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

const validateLegalName = () => {
  const legalNameInput = document.getElementById("legal-name-input");
  validateEnteredValue(legalNameInput, legalNameInput.value);
  convertToUpperCase(legalNameInput);
  const errorTag = legalNameInput.nextElementSibling;
  if (legalNameInput.value.length < 5) {
    errorTag.textContent = "*Минимум 5 символов";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

const validateReferencePoint = () => {
  const referenceInput = document.getElementById("reference-input");
  validateEnteredValue(referenceInput, referenceInput.value);
  convertToUpperCase(referenceInput);
  const errorTag = referenceInput.nextElementSibling;
  if (referenceInput.value.length < 5) {
    errorTag.textContent = "*Минимум 5 символов";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

const validateInfoInputsOnInput = () => {
  document.getElementById("inn-input").addEventListener("input", validateInn);
  document
    .getElementById("phone-input")
    .addEventListener("input", validatePhone);
  document.getElementById("name-input").addEventListener("input", validateName);
  document
    .getElementById("legal-name-input")
    .addEventListener("input", validateLegalName);
  document
    .getElementById("address-input")
    .addEventListener("input", validateAddress);
  document
    .getElementById("reference-input")
    .addEventListener("input", validateReferencePoint);
};

const validateAgentCodeOnInput = () => {
  const agentCodeInput = document.getElementById("agent-code-input");
  agentCodeInput.addEventListener("input", validateAgentCode);
};

const validateSelectBoxes = () => {
  const selectBoxes = Array.from(document.querySelectorAll("select"));
  const isAllSelected = selectBoxes.every(
    (selectBox) => {
      return selectBox.value !== "false";
    }
  );
  return isAllSelected;
};

const resetForm = () => {
  const formContent = document.getElementById("addForm");
  const agentCodeValue = formContent.agent_code.value;
  formContent.reset();
  formContent.agent_code.value = agentCodeValue;
};

const getParsedCoords = (coords) => {
  try {
    const parsedCoords = JSON.parse(coords);
    return parsedCoords;
  } catch (error) {
    console.log(error);
    return {};
  }
};

// on-submit form
const onClickSubmitBtn = () => {
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.click();
};

const onPostClient = async (_data) => {
  const latitude = selectedLocation[0];
  const longitude = selectedLocation[1];
  const { query_id, hash } = DemoApp.initDataUnsafe;
  const {
    channel,
    category,
    city,
    format,
    type,
    address,
    company_name,
    inn,
    name,
    navigate,
    phone,
    agent_code,
  } = _data;

  const data = {
    address,
    company_name,
    inn,
    name,
    navigate,
    phone,
    agent_code,
    latitude,
    longitude,
    query_id,
    hash,
    sales_channel_id: channel,
    client_category_id: category,
    city_id: city,
    format_id: format,
    client_type_id: type,
  };

  const response = await postClient(data);
  return response;
};

// yandex map
const initYandexMap = () => {
  Telegram.WebApp.ready();

  const memoryCoords = DemoApp.getItem("userCoords");
  let userCoords = memoryCoords
    ? getParsedCoords(memoryCoords)
    : DemoApp.requestLocation();
  if (userCoords && !memoryCoords) {
    DemoApp.setItem("userCoords", JSON.stringify(userCoords));
  } else userCoords = { latitude: 41.311081, longitude: 69.240562 };

  ymaps.ready(init);

  function init() {
    var map = new ymaps.Map("map", {
      center: [userCoords?.latitude, userCoords?.longitude],
      zoom: 10,
    });

    var placemark;

    map.events.add("click", function (e) {
      var coords = e.get("coords");

      if (placemark) {
        placemark.geometry.setCoordinates(coords);
      } else {
        placemark = new ymaps.Placemark(
          coords,
          {},
          {
            draggable: true,
          }
        );
        map.geoObjects.add(placemark);
      }
      selectedLocation = coords;
    });
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const formContent = document.getElementById("addForm");
  await onMountedFuncs();

  // create options for region-select
  const onCreateRegionOptions = async () => {
    const selectedZoneId = window.location.search.split("=")[1];

    const regionSelect = document.getElementById("region");
    const regions = (await getRegionsByZoneId(selectedZoneId)) || [];

    regions.forEach((region) => {
      const option = document.createElement("option");
      option.value = region.id;
      option.textContent = region.name;
      regionSelect.appendChild(option);
    });
  };
  await onCreateRegionOptions();

  // Utility function to remove elements by their IDs
  const removeElementsById = (ids) => {
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.remove();
    });
  };

  // Function to create a select element with options
  const createSelectElement = (id, options, _label, placeholder) => {
    const selectContent = document.createElement("div");
    selectContent.id = id;
    const select = document.createElement("select");
    const label = document.createElement("label");
    label.textContent = _label;
    select.name = id;
    select.id = id;
    select.required = true;
    select.innerHTML = `<option value="false" disabled selected required>${
      options?.length ? placeholder : "Нет данных"
    }</option>`;
    options.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      select.appendChild(option);
    });
    selectContent.appendChild(label);
    selectContent.appendChild(select);
    return selectContent;
  };

  // create client-info inputs
  const createInfoInputs = () => {
    const inputsDiv = document.createElement("div");
    inputsDiv.id = "inputs";
    inputsDiv.innerHTML = `
      <div style="position: relative">
        <label for="name-input">Названия</label>
        <input type="text" required name="name" id="name-input" class="text-input" placeholder="Названия магазина" />
        <small style="position: absolute; right: 0; bottom: -20px; color: red"></small>
      </div>
        <div style="position: relative">
        <label for="legal-name-input">Юридическое названия</label>
        <input type="text" required name="company_name" id="legal-name-input" class="text-input" placeholder="Юридическое название" />
        <small style="position: absolute; right: 0; bottom: -20px; color: red"></small>
      </div>
      <div style="position: relative">
        <label for="phone-input">Телефон</label>
        <input type="tel" name="phone" required id="phone-input" class="text-input" placeholder="Телефон" />

        <small style="position: absolute; right: 0; bottom: -20px; color: red"></small>
      </div>
      <div style="position: relative">
        <label for="inn-input">Инн</label>
        <input type="text" required name="inn" id="inn-input" class="text-input" placeholder="Инн" />
        <small style="position: absolute; right: 0; bottom: -20px; color: red"></small>
      </div>
      <div style="position: relative">
        <label for="address-input">Адрес</label>
        <input type="text" required name="address" id="address-input" class="text-input" placeholder="Адрес" />
        <small style="position: absolute; right: 0; bottom: -20px; color: red"></small>
      </div>
      <div style="position: relative">
        <label for="reference-input">Ориентир</label>
        <input type="text" required name="navigate" id="reference-input" class="text-input" placeholder="Ориентир" />
        <small style="position: absolute; right: 0; bottom: -20px; color: red"></small>
      </div>
      <div id="map" style="nargin-top: 12px"></div>
      <button style="visibility: hidden" type="submit" name="submit" id="submit-btn">Saqlash</button>`;
    formContent.appendChild(inputsDiv);
  };

  // Function to handle region selection
  const handleRegionChange = async (event) => {
    removeElementsById([
      "city",
      "inputs",
      "format",
      "category",
      "channel",
      "type",
      "map",
    ]);

    createLoader();
    const selectedRegionId = event.target.value;
    const cities = await getCitiesByRegionId(selectedRegionId);
    removeLoader();

    const selectedRegion = event.target.value;

    const citySelect = createSelectElement(
      "city",
      cities,
      "Город",
      "Выберите город"
    );

    citySelect.addEventListener("change", handleCityChange);

    formContent.appendChild(citySelect);
  };

  // Function to handle city selection
  const handleCityChange = async () => {
    removeElementsById([
      "inputs",
      "format",
      "category",
      "channel",
      "type",
      "map",
    ]);

    createLoader();
    const formats = await getFormats();
    removeLoader();

    const formatSelect = createSelectElement(
      "format",
      formats,
      "Формат",
      "Выберите формат"
    );
    formatSelect.addEventListener("change", handleFormatChange);
    formContent.appendChild(formatSelect);
  };

  // Function to handle format selection
  const handleFormatChange = async () => {
    removeElementsById(["inputs", "category", "channel", "type", "map"]);
    createLoader();
    const categories = await getCategories();
    removeLoader();
    const categorySelect = createSelectElement(
      "category",
      categories,
      "Категория",
      "Выберите категорю"
    );
    categorySelect.addEventListener("change", handleCategoryChange);
    formContent.appendChild(categorySelect);
  };

  // Function to handle category selection
  const handleCategoryChange = async () => {
    removeElementsById(["inputs", "channel", "type", "map"]);

    createLoader();
    const channels = await getChannels();
    removeLoader();
    const channelSelect = createSelectElement(
      "channel",
      channels,
      "Канал",
      "Выберите канал"
    );
    channelSelect.addEventListener("change", handleChannelChange);
    formContent.appendChild(channelSelect);
  };

  // Function to handle channel selection
  const handleChannelChange = async () => {
    removeElementsById(["inputs", "type", "map"]);

    createLoader();
    const types = await getTypes();
    removeLoader();
    const typeSelect = createSelectElement(
      "type",
      types,
      "Тип",
      "Выберите тип"
    );
    typeSelect.addEventListener("change", handleTypeChange);
    formContent.appendChild(typeSelect);
  };

  // Function to handle type selection
  const handleTypeChange = () => {
    removeElementsById(["inputs"]);
    createInfoInputs();
    // init yandex-maps
    initYandexMap();

    // Apply input masks
    IMask(document.getElementById("phone-input"), {
      mask: "+{998} (00) 000-00-00",
    });
    IMask(document.getElementById("inn-input"), { mask: "000 000 000" });
    validateInfoInputsOnInput();
  };

  // Create loader
  const createLoader = () => {
    const formContent = document.getElementById("addForm");
    const loader = document.createElement("div");
    loader.className = "loader";
    formContent.appendChild(loader);
  };

  const removeLoader = () => {
    const loader = document.querySelector(".loader");
    if (loader) loader.remove();
  };

  const onSubmit = () => {
    formContent.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (isValidForm()) {
        DemoApp.showMainButtonLoader();
        const data = {};
        const formData = new FormData(event.target);
        formData.forEach((value, key) => {
          data[key] = value;
        });
        const response = await onPostClient(data);
        DemoApp.hideMainButtonLoader();
        if (response?.statusText === "OK") {
          DemoApp.sendConfirmationToAddAgain(
            "Клиент успешно добавлен!\nХотите добавить еще?"
          );
        } else {
          alert("Ошибка при добавлении клиента");
          resetForm();
        }
      }
    });
  };

  onSubmit();

  // Initial event listener for the 'region' select element
  document
    .getElementById("region")
    .addEventListener("change", handleRegionChange);
});

const handleAddAgainConfirmation = (isOkToAddAgain) => {
  if (isOkToAddAgain) {
    resetForm();
  } else {
    DemoApp.close();
  }
};

// Telegram Web API
const DemoApp = {
  initData: Telegram.WebApp.initData || "",
  initDataUnsafe: Telegram.WebApp.initDataUnsafe || {},
  MainButton: Telegram.WebApp.MainButton,
  isClosingConfirmationEnabled: true,
  userTheme: Telegram.WebApp?.themeParams || {},

  init(options) {
    document.body.style.visibility = "";
    Telegram.WebApp.ready();
    Telegram.WebApp.MainButton.setParams({
      text: "Добавить",
      is_visible: true,
    }).onClick(onClickSubmitBtn);
  },

  close() {
    Telegram.WebApp.close();
  },

  showMainButtonLoader(leaveBtnActive = false) {
    Telegram.WebApp.MainButton.showProgress(leaveBtnActive);
  },

  hideMainButtonLoader() {
    Telegram.WebApp.MainButton.hideProgress();
  },

  // actions
  sendConfirmationToAddAgain(message) {
    Telegram.WebApp.showConfirm(message, (isOkToAddAgain) =>
      handleAddAgainConfirmation(isOkToAddAgain)
    );
  },

  setItem(key, value) {
    try {
      Telegram.WebApp.CloudStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  },

  getItem(key) {
    try {
      return Telegram.WebApp.CloudStorage.getItem(key);
    } catch (error) {
      console.log(error);
    }
  },

  // Permissions
  requestLocation() {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition((position) => {
        return position.coords;
      });
    }
    return undefined;
  },
};
