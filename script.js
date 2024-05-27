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
    select.id = id;
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
    removeElementsById(["inputs", "format", "category", "channel", "type"]);
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
    removeElementsById(["inputs", "category", "channel", "type"]);
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
    removeElementsById(["inputs", "channel", "type"]);
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
    removeElementsById(["inputs", "type"]);
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
      <input type="text" name="name" class="text-input" placeholder="name" />
      <input type="text" name="surname" class="text-input" placeholder="surname" />
      <input type="text" name="phone" id="phone-input" class="text-input" placeholder="phone" />
      <input type="text" name="inn" id="inn-input" class="text-input" placeholder="inn" />
      <button type="submit" name="submit">Saqlash</button>`;
    formContent.appendChild(inputsDiv);

    // Apply input masks
    IMask(document.getElementById("phone-input"), {
      mask: "+{998} (00) 000-00-00",
    });
    IMask(document.getElementById("inn-input"), { mask: "000 000 000" });
  };

  // Initial event listener for the 'zone' select element
  document.getElementById("zone").addEventListener("change", handleZoneChange);
});
