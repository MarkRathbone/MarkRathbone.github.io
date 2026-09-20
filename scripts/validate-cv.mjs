import fs from "node:fs";
import { load as loadYaml } from "js-yaml";

const cv = loadYaml(fs.readFileSync(new URL("../cv.yaml", import.meta.url), "utf8"));
const required = [
  "personal",
  "links",
  "profile",
  "career_highlights",
  "career_arc",
  "experience_intro",
  "skills",
  "experience",
  "earlier_experience",
  "certifications",
  "selected_work",
];
const missing = required.filter((key) => !cv[key]);

if (missing.length) {
  throw new Error(`cv.yaml is missing required sections: ${missing.join(", ")}`);
}

const requireFields = (item, fields, path) => {
  fields.forEach((field) => {
    if (!item?.[field]) throw new Error(`cv.yaml: ${path}.${field} is required`);
  });
};

const requireList = (items, path, length) => {
  if (!Array.isArray(items) || (length ? items.length !== length : items.length === 0)) {
    const requirement = length ? `contain ${length} items` : "contain at least one item";
    throw new Error(`cv.yaml: ${path} must ${requirement}`);
  }
};

requireFields(cv.personal, ["name", "first_name", "last_name", "role", "location", "phone", "email", "website", "portrait"], "personal");
requireFields(cv.profile, ["short", "paragraphs"], "profile");
requireList(cv.profile.paragraphs, "profile.paragraphs");

const portraitUrl = new URL(`../public/${cv.personal.portrait.replace(/^\//, "")}`, import.meta.url);
if (!fs.existsSync(portraitUrl)) {
  throw new Error(`cv.yaml: portrait not found: ${cv.personal.portrait}`);
}

requireList(cv.links, "links");
cv.links.forEach((link, index) => requireFields(link, ["label", "url"], `links[${index}]`));

requireList(cv.career_highlights, "career_highlights", 4);
cv.career_highlights.forEach((item, index) => requireFields(item, ["key", "value", "label", "context"], `career_highlights[${index}]`));
if (new Set(cv.career_highlights.map((item) => item.key)).size !== cv.career_highlights.length) {
  throw new Error("cv.yaml: career_highlights keys must be unique");
}
for (const key of ["years", "approach"]) {
  if (!cv.career_highlights.some((item) => item.key === key)) {
    throw new Error(`cv.yaml: career_highlights needs a ${key} item for the hero`);
  }
}

requireList(cv.career_arc, "career_arc", 3);
cv.career_arc.forEach((stage, index) => requireFields(stage, ["period", "title", "description"], `career_arc[${index}]`));
requireFields(cv.experience_intro, ["eyebrow", "headline", "emphasis", "body"], "experience_intro");

requireList(cv.skills, "skills");
cv.skills.forEach((group, index) => {
  requireFields(group, ["group", "items"], `skills[${index}]`);
  requireList(group.items, `skills[${index}].items`);
});

requireList(cv.experience, "experience");
cv.experience.forEach((role, index) => {
  requireFields(role, ["company", "role", "location", "start", "end", "summary", "highlights"], `experience[${index}]`);
  requireList(role.highlights, `experience[${index}].highlights`);
  if (role.logo) {
    const logoUrl = new URL(`../public/${role.logo.replace(/^\//, "")}`, import.meta.url);
    if (!fs.existsSync(logoUrl)) throw new Error(`cv.yaml: logo not found for ${role.company}: ${role.logo}`);
  }
});

requireList(cv.earlier_experience, "earlier_experience");
cv.earlier_experience.forEach((role, index) => requireFields(role, ["company", "role", "location", "start", "end"], `earlier_experience[${index}]`));

requireList(cv.certifications, "certifications");
cv.certifications.forEach((certification, index) => requireFields(certification, ["title", "issuer", "date"], `certifications[${index}]`));

requireList(cv.selected_work, "selected_work");
cv.selected_work.forEach((item, index) => {
  requireFields(item, ["number", "title", "description", "tags"], `selected_work[${index}]`);
  requireList(item.tags, `selected_work[${index}].tags`);
});

console.log(`CV data valid: ${cv.experience.length} roles, ${cv.certifications.length} certifications.`);
