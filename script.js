let selectedLocation = null;

const onClickSubmitBtn = () => {
  const submitBtn = document.getElementById("submit-btn");
  if (!validatePhone() || !validateInn()) {
    return;
  }
  if (!submitBtn) {
    alert("Заполните все поля");
    return;
  } else if (!selectedLocation) {
    alert("Выберите местоположение на карте");
    return;
  }
  submitBtn.click();
};

const validatePhone = () => {
  if (phoneInput.value.length < 19) {
    alert("Введите корректный номер телефона");
    return false;
  }
  return true;
};

const validateInn = () => {
  const innInput = document.getElementById("inn-input");
  if (innInput.value.length < 10) {
    alert("Введите корректный ИНН");
    return false;
  }
  return true;
};

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
  const createSelectElement = (id, options, placeholder) => {
    const select = document.createElement("select");
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
    return select;
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
      <input type="text" required name="name" class="text-input" placeholder="Названия магазина" />
      <input type="text" required name="legal_name" class="text-input" placeholder="Юридическое название" />
      <input type="text" required name="phone" id="phone-input" class="text-input" placeholder="Телефон" />
      <input type="text" required name="inn" id="inn-input" class="text-input" placeholder="Инн" />
      <input type="text" required name="address" id="address-input" class="text-input" placeholder="Адрес" />
      <input type="text" required name="reference_point" id="reference-input" class="text-input" placeholder="Ориентир" />
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
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    // DemoApp.sendData();
    DemoApp.sendNotification("Operation successful!");
    DemoApp.close();
  });

  // Initial event listener for the 'zone' select element
  document.getElementById("zone").addEventListener("change", handleZoneChange);
});

const DemoApp = {
  initData: Telegram.WebApp.initData || "",
  initDataUnsafe: Telegram.WebApp.initDataUnsafe || {},
  MainButton: Telegram.WebApp.MainButton,
  isClosingConfirmationEnabled: true,

  init(options) {
    document.body.style.visibility = "";
    Telegram.WebApp.ready();
    Telegram.WebApp.MainButton.setParams({
      text: "Сохранить",
      is_visible: true,
    }).onClick(onClickSubmitBtn);
  },

  expand() {
    Telegram.WebApp.expand();
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

  checkInitData() {
    const webViewStatus = document.querySelector("#webview_data_status");
    if (
      DemoApp.initDataUnsafe.query_id &&
      DemoApp.initData &&
      webViewStatus.classList.contains("status_need")
    ) {
      webViewStatus.classList.remove("status_need");
      DemoApp.apiRequest("checkInitData", {}, function (result) {
        if (result.ok) {
          webViewStatus.textContent = "Hash is correct (async)";
          webViewStatus.className = "ok";
        } else {
          webViewStatus.textContent = result.error + " (async)";
          webViewStatus.className = "err";
        }
      });
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

DemoApp.init();
