setTimeout(main, 500);

function extractData() {
  const result = new Map();
  let currentMonth = null;

  const selector = "#user-locations > text,g[data-toggle='tooltip']";
  [...document.querySelectorAll(selector)].forEach((e) => {
    if (e.tagName == "text") {
      currentMonth = e.textContent;
      result.set(currentMonth, []);
    }
    if (e.tagName == "g") {
      result.set(currentMonth, [
        ...result.get(currentMonth),
        {
          day: e.querySelector("text").textContent,
          hoursCount: e.dataset.originalTitle,
        },
      ]);
    }
  });
  return result;
}

function sumHours(monthData, isDayIncluded) {
  return monthData.reduce((res, current) => {
    [hours, minutes] = current.hoursCount.split("h");
    return isDayIncluded(current.day)
      ? res + parseInt(minutes) + parseInt(hours) * 60
      : res;
  }, 0);
}

// sum month data from 28 to 27
function sumMonthHours(currentMonthData, prevMonthData) {
  let minutesCount = 0;
  const lastActiveDayInCurrentMonth =
    currentMonthData[currentMonthData.length - 1];
  if (parseInt(lastActiveDayInCurrentMonth.day) >= 28) {
    // if current day is >= 28 start counting from it
    minutesCount = sumHours(currentMonthData, (day) => day >= 28);
  } else {
    const currentMonthCount = sumHours(currentMonthData, (day) => day < 28);
    const prevMonthCount = sumHours(prevMonthData, (day) => day >= 28);
    minutesCount = currentMonthCount + prevMonthCount;
  }
  return [Math.floor(minutesCount / 60), minutesCount % 60];
}

function createDisplayElement(text, withStyle = false) {
  const span = document.createElement("span");
  span.textContent = text;
  if (!withStyle) return span;
  span.style["display"] = "flex";
  span.style["justify-content"] = "center";
  span.style["font-weight"] = "500";
  span.style["font-size"] = "larger";
  span.style["color"] = "rgba(0, 186, 188, 100)";
  return span;
}

function displayData(text) {
  let targetElement = document.querySelector("#locations");
  targetElement ??= document.querySelectorAll(".profile-title")[2];
  const displayElement = createDisplayElement(
    text,
    targetElement.id === "locations"
  );
  if (targetElement.id === "locations") {
    let innerHtml = targetElement.innerHTML;
    targetElement.innerHTML = null;
    targetElement.appendChild(displayElement);
    targetElement.innerHTML += innerHtml;
  } else {
    targetElement?.appendChild(displayElement);
  }
}

function main() {
  const data = extractData();
  if (data.size == 0) return;
  const arr = Array.from(data);
  const [lastMonthData, prevMonthData] = [arr.pop()[1], arr.pop()[1]];
  const [hours, minutes] = sumMonthHours(lastMonthData, prevMonthData);
  displayData([hours, minutes].join("h"));
}
