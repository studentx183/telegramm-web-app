let selectedLocation = null;

const onClickSubmitBtn = () => {
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.click();
};

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
  if (innInput.value.length < 10) {
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
    errorTag.textContent = "*Обязательное поле";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

const validateName = () => {
  const nameInput = document.getElementById("name-input");
  const errorTag = nameInput.nextElementSibling;
  if (nameInput.value.length < 5) {
    errorTag.textContent = "*Обязательное поле";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

const validateLegalName = () => {
  const legalNameInput = document.getElementById("legal-name-input");
  const errorTag = legalNameInput.nextElementSibling;
  if (legalNameInput.value.length < 5) {
    errorTag.textContent = "*Обязательное поле";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

const validateReferencePoint = () => {
  const referenceInput = document.getElementById("reference-input");
  const errorTag = referenceInput.nextElementSibling;
  if (referenceInput.value.length < 5) {
    errorTag.textContent = "*Обязательное поле";
    return false;
  }
  errorTag.textContent = null;
  return true;
};

// yandex map
const initYandexMap = () => {
  Telegram.WebApp.ready();

  const userCoords = DemoApp.requestLocation() || {
    latitude: 41.2995,
    longitude: 69.2401,
  };

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

document.addEventListener("DOMContentLoaded", () => {
  const formContent = document.getElementById("addForm");

  // Data for regions and cities
  const data = {
    zones: {
      zone1: {
        uzb: "Uzbekistan",
        russian: "Rossiya",
        japan: "Yaponiya",
        korea: "Korea",
      },
      zone2: {
        franch: "Fransiya",
        german: "Germaniya",
        italy: "Italiya",
        spain: "Ispaniya",
      },
      zone3: {
        brasil: "Braziliya",
        paraguay: "Paragvay",
        chili: "Chili",
        mexico: "Mexio",
      },
    },

    regions: {
      uzb: {
        and: "Andijon",
        fer: "Farg'ona",
        nam: "Namangan",
      },
      russian: {
        cros: "Кроснодар",
        mos: "Москва",
        arh: "Архан",
      },
      japan: {
        tokyo: "Tokyo",
        osaka: "Osaka",
        hiroshima: "Hiroshima",
      },
      korea: {
        seoul: "Seoul",
        busan: "Busan",
        daegu: "Daegu",
      },
    },
  };

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
    select.innerHTML = `<option disabled selected required>${placeholder}</option>`;
    Object.entries(options).forEach(([value, name]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = name;
      select.appendChild(option);
    });
    selectContent.appendChild(label);
    selectContent.appendChild(select);
    return selectContent;
  };

  // Function to handle zone selection
  const handleZoneChange = (event) => {
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
    const selectedZone = event.target.value;
    const regionSelect = createSelectElement(
      "region",
      data.zones[selectedZone],
      "Region",
      "Regionni tanlang"
    );
    regionSelect.addEventListener("change", handleRegionChange);
    formContent.appendChild(regionSelect);
  };

  // Function to handle region selection
  const handleRegionChange = (event) => {
    removeElementsById([
      "city",
      "inputs",
      "format",
      "category",
      "channel",
      "type",
      "map",
    ]);
    const selectedRegion = event.target.value;
    const citySelect = createSelectElement(
      "city",
      data.regions[selectedRegion],
      "Shahar",
      "Shaharni tanlang"
    );
    citySelect.addEventListener("change", handleCityChange);
    formContent.appendChild(citySelect);
  };

  // Function to handle city selection
  const handleCityChange = () => {
    removeElementsById([
      "inputs",
      "format",
      "category",
      "channel",
      "type",
      "map",
    ]);
    const formatSelect = createSelectElement(
      "format",
      { format1: "Format 1", format2: "Format 2", format3: "Format 3" },
      "Format",
      "Formatni tanlang"
    );
    formatSelect.addEventListener("change", handleFormatChange);
    formContent.appendChild(formatSelect);
  };

  // Function to handle format selection
  const handleFormatChange = () => {
    removeElementsById(["inputs", "category", "channel", "type", "map"]);
    const categorySelect = createSelectElement(
      "category",
      {
        category1: "Category 1",
        category2: "Category 2",
        category3: "Category 3",
      },
      "Category",
      "Categoryni tanlang"
    );
    categorySelect.addEventListener("change", handleCategoryChange);
    formContent.appendChild(categorySelect);
  };

  // Function to handle category selection
  const handleCategoryChange = () => {
    removeElementsById(["inputs", "channel", "type", "map"]);
    const channelSelect = createSelectElement(
      "channel",
      { channel1: "Channel 1", channel2: "Channel 2", channel3: "Channel 3" },
      "Channel",
      "Channelni tanlang"
    );
    channelSelect.addEventListener("change", handleChannelChange);
    formContent.appendChild(channelSelect);
  };

  // Function to handle channel selection
  const handleChannelChange = () => {
    removeElementsById(["inputs", "type", "map"]);
    const typeSelect = createSelectElement(
      "type",
      { type1: "Type 1", type2: "Type 2", type3: "Type 3" },
      "Type",
      "Typeni tanlang"
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
        <input type="text" required name="legal_name" id="legal-name-input" class="text-input" placeholder="Юридическое название" />
        <small style="position: absolute; right: 0; bottom: -20px; color: red"></small>
      </div>
      <div style="position: relative">
        <label for="phone-input">Телефон</label>
        <input type="text" required name="phone" id="phone-input" class="text-input" placeholder="Телефон" />
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
        <input type="text" required name="reference_point" id="reference-input" class="text-input" placeholder="Ориентир" />
        <small style="position: absolute; right: 0; bottom: -20px; color: red"></small>
      </div>
      <div id="map"></div>
      <button style="visibility: hidden" type="submit" name="submit" id="submit-btn">Saqlash</button>`;
    formContent.appendChild(inputsDiv);

    // init yandex-maps
    initYandexMap();

    // Apply input masks
    IMask(document.getElementById("phone-input"), {
      mask: "+{998} (00) 000-00-00",
    });
    IMask(document.getElementById("inn-input"), { mask: "000 000 000" });
  };

  formContent.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isValidForm()) {
      const formData = new FormData(event.target);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      DemoApp.sendNotification("Operation successful!");
      DemoApp.close();
    }
  });

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
      text: "Подать",
      is_visible: true,
    }).onClick(onClickSubmitBtn);
  },

  close() {
    Telegram.WebApp.close();
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

  sendNotification(message) {
    Telegram.WebApp.showAlert(message);
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
    const memorizedCoords = localStorage.getItem("user-coords");
    if (memorizedCoords) {
      try {
        const parsedMemorizedCoords = JSON.parse(memorizedCoords);
        return parsedMemorizedCoords;
      } catch (error) {}
    } else {
      if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition((position) => {
          localStorage.set("user-coords", JSON.stringify(position.coords));
          return position.coords;
        });
      }
      return undefined;
    }
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
