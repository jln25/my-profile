// Builds the "Ongoing projects" cards from projects.xml.
// fetch() only works over http(s), so preview with Live Server or GitHub Pages.

const projectList = document.querySelector("#project-list");

// Turns "2026-09" into "September 2026"
function formatDate(value) {
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
}

// Gets the text inside a child tag, or an empty string if the tag is missing
function getText(parent, tagName) {
  const element = parent.querySelector(tagName);
  return element ? element.textContent.trim() : "";
}

function buildCard(project) {
  const title = getText(project, "title");
  const description = getText(project, "description");
  const date = getText(project, "date");
  const url = getText(project, "url");

  const card = document.createElement("article");
  card.className = "card";

  const heading = document.createElement("h3");
  if (url) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = title;
    heading.append(link);
  } else {
    heading.textContent = title;
  }

  const summary = document.createElement("p");
  summary.textContent = description;

  card.append(heading, summary);

  if (date) {
    const started = document.createElement("p");
    started.className = "card-date";
    const time = document.createElement("time");
    time.dateTime = date;
    time.textContent = formatDate(date);
    started.append("Started ", time);
    card.append(started);
  }

  return card;
}

fetch("projects.xml")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Could not load projects.xml");
    }
    return response.text();
  })
  .then((text) => {
    const xml = new DOMParser().parseFromString(text, "application/xml");

    if (xml.querySelector("parsererror")) {
      throw new Error("projects.xml has a formatting error");
    }

    const projects = xml.querySelectorAll("project");
    projectList.replaceChildren(...Array.from(projects, buildCard));
  })
  .catch((error) => {
    console.error(error);
    projectList.innerHTML =
      '<p>Projects couldn\'t load right now. Visit <a href="https://janisnarvas.com/">janisnarvas.com</a> to see what I\'m working on.</p>';
  });
