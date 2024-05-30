import {
  getZones,
  getRegionsByZoneId,
  getCitiesByRegionId,
  getFormats,
  getCategories,
  getChannels,
  getTypes,
  postClient,
} from "./requests.js";

let selectedLocation = null;

// validations
const isValidForm = () => {
  const isNameValid = validateName();
  const isPhoneValid = validatePhone();
  const isInnValid = validateInn();
  const isLegalNameValid = validateLegalName();
  const isAddressValid = validateAddress();
  const isReferencePointValid = validateReferencePoint();
  const submitBtn = document.getElementById("submit-btn");

  if (
    !isNameValid ||
    !isPhoneValid ||
    !isInnValid ||
    !isLegalNameValid ||
    !isAddressValid ||
    !isReferencePointValid
  ) {
    return false;
  }
  if (!submitBtn) {
    alert("Заполните все поля");
    return false;
  } else if (!selectedLocation) {
    alert("Выберите местоположение на карте");
    return false;
  }
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
  legalNameInput.value = legalNameInput.value.toUpperCase();
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
  const errorTag = referenceInput.nextElementSibling;
  if (referenceInput.value.length < 5) {
    errorTag.textContent = "*Минимум 5 символов";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

const validateOnInput = () => {
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

const onClickSubmitBtn = () => {
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.click();
};

const onPostClient = async (_data) => {
  const latitude = selectedLocation[0];
  const longitude = selectedLocation[1];
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
  } = _data;
  const data = {
    address,
    company_name,
    inn,
    name,
    navigate,
    phone,
    latitude,
    longitude,
    sales_channel_id: channel,
    client_category_id: category,
    city_id: city,
    format_id: format,
    client_type_id: type,
  };

  await postClient(data);
};

// yandex map
const initYandexMap = () => {
  Telegram.WebApp.ready();

  const memoryCoords = localStorage.getItem("userCoords");
  let userCoords = memoryCoords
    ? JSON.parse(memoryCoords)
    : DemoApp.requestLocation();
  if (userCoords && !memoryCoords) {
    localStorage.setItem("userCoords", JSON.stringify(userCoords));
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

window.addEventListener("load", function () {
  DemoApp.init();
});

document.addEventListener("DOMContentLoaded", async () => {
  const onCreateZoneOptions = async () => {
    const zoneSelect = document.getElementById("zone");
    const zones = (await getZones()) || [];

    zones.forEach((zone) => {
      const option = document.createElement("option");
      option.value = zone.id;
      option.textContent = zone.name;
      zoneSelect.appendChild(option);
    });
  };

  await onCreateZoneOptions();

  const formContent = document.getElementById("addForm");

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
    select.innerHTML = `<option disabled selected required>${
      options.length ? placeholder : "Нет данных"
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

  // Function to handle zone selection
  const handleZoneChange = async (event) => {
    removeElementsById([
      "region",
      "city",
      "inputs",
      "format",
      "category",
      "channel",
      "type",
      "map",
    ]);

    createLoader();
    const selectedZoneId = event.target.value;
    const regions = await getRegionsByZoneId(selectedZoneId);
    removeLoader();

    const regionSelect = createSelectElement(
      "region",
      regions,
      "Регион",
      "Выберите регион"
    );

    regionSelect.addEventListener("change", handleRegionChange);
    formContent.appendChild(regionSelect);
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

    // init yandex-maps
    initYandexMap();

    // Apply input masks
    IMask(document.getElementById("phone-input"), {
      mask: "+{998} (00) 000-00-00",
    });
    IMask(document.getElementById("inn-input"), { mask: "000 000 000" });
    validateOnInput();
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
        DemoApp.showMainButtonLoader()
        const data = {};
        const formData = new FormData(event.target);
        formData.forEach((value, key) => {
          data[key] = value;
        });
        await onPostClient(data);
        DemoApp.hideMainButtonLoader
        DemoApp.sendConfirmationToAddAgain("Хотите добавить еще?");
        DemoApp.close();
      }
    });
  };

  onSubmit();

  // Initial event listener for the 'zone' select element
  document.getElementById("zone").addEventListener("change", handleZoneChange);
});

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
    Telegram.WebApp.MainButton.showProgress(leaveBtnActive)
  },

  hideMainButtonLoader() {
    Telegram.WebApp.MainButton.hideProgress()
  },

  // actions
  sendData() {
    // Telegram.WebApp.sendData(JSON.stringify(data));
    Telegram.WebApp.sendData(
      JSON.stringify({
        action: "form_submission",
        message: "Form submitted successfully!",
      })
    );
  },

  sendConfirmationToAddAgain(message) {
    Telegram.WebApp.showConfirm(message);
  },

  sendMessage(msg_id, with_webview) {
    if (!DemoApp.initDataUnsafe.query_id) {
      alert("WebViewQueryId not defined");
      return;
    }

    document.querySelectorAll("button").forEach((btn) => (btn.disabled = true));

    const btn = document.querySelector("#btn_status");
    btn.textContent = "Sending...";

    DemoApp.apiRequest(
      "sendMessage",
      {
        msg_id: msg_id || "",
        with_webview: !DemoApp.initDataUnsafe.receiver && with_webview ? 1 : 0,
      },
      function (result) {
        document
          .querySelectorAll("button")
          .forEach((btn) => (btn.disabled = false));

        if (result.response) {
          if (result.response.ok) {
            btn.textContent = "Message sent successfully!";
            btn.className = "ok";
            btn.style.display = "block";
          } else {
            btn.textContent = result.response.description;
            btn.className = "err";
            btn.style.display = "block";
            alert(result.response.description);
          }
        } else if (result.error) {
          btn.textContent = result.error;
          btn.className = "err";
          btn.style.display = "block";
          alert(result.error);
        } else {
          btn.textContent = "Unknown error";
          btn.className = "err";
          btn.style.display = "block";
          alert("Unknown error");
        }
      }
    );
  },

  // Permissions
  requestLocation() {
    // added to localStorage not to ask permission for coords everytime
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition((position) => {
        return position.coords;
      });
    }
    return undefined;
  },

  // Other
  apiRequest(method, data, onCallback) {
    // DISABLE BACKEND FOR FRONTEND DEMO
    // YOU CAN USE YOUR OWN REQUESTS TO YOUR OWN BACKEND
    // CHANGE THIS CODE TO YOUR OWN
    return (
      onCallback &&
      onCallback({
        error:
          "This function (" +
          method +
          ") should send requests to your backend. Please, change this code to your own.",
      })
    );

    const authData = DemoApp.initData || "";
    fetch("/demo/api", {
      method: "POST",
      body: JSON.stringify(
        Object.assign(data, {
          _auth: authData,
          method: method,
        })
      ),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        onCallback && onCallback(result);
      })
      .catch(function (error) {
        onCallback && onCallback({ error: "Server error" });
      });
  },
};
