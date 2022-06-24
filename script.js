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

// sum month data from 28 to 27
function sumMonthHours(monthData, prevMonthData) {
  const prevMonthResult = prevMonthData.reduce((res, current) => {
    [hours, minutes] = current.hoursCount.split("h");
    return parseInt(current.day) >= 28
      ? res + parseInt(minutes) + parseInt(hours) * 60
      : res;
  }, 0);
  const monthResult = monthData.reduce((res, current) => {
    [hours, minutes] = current.hoursCount.split("h");
    return parseInt(current.day) < 28
      ? res + parseInt(minutes) + parseInt(hours) * 60
      : res;
  }, 0);
  const result = prevMonthResult + monthResult;
  return [Math.floor(result / 60), result % 60];
}

function displayData(text) {
  const targetElement = document.querySelectorAll(".profile-title")[2];
  const span = document.createElement("span");
  span.textContent = text;
  targetElement?.appendChild(span);
}

function main() {
  const data = extractData();
  if (data.size == 0) return;
  const arr = Array.from(data);
  const [lastMonthData, prevMonthData] = [arr.pop()[1], arr.pop()[1]];
  displayData(sumMonthHours(lastMonthData, prevMonthData).join("h"));
}
