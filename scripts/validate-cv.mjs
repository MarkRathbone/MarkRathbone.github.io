import fs from "node:fs";
import { load as loadYaml } from "js-yaml";

const cv = loadYaml(fs.readFileSync(new URL("../cv.yaml", import.meta.url), "utf8"));
const required = ["personal", "profile", "skills", "experience", "certifications"];
const missing = required.filter((key) => !cv[key]);

if (missing.length) {
  throw new Error(`cv.yaml is missing required sections: ${missing.join(", ")}`);
}

for (const field of ["name", "role", "email", "location"]) {
  if (!cv.personal[field]) throw new Error(`cv.yaml: personal.${field} is required`);
}

if (!Array.isArray(cv.experience) || !cv.experience.length) {
  throw new Error("cv.yaml: experience must contain at least one role");
}

cv.experience.forEach((role, index) => {
  for (const field of ["company", "role", "location", "start", "end", "summary"]) {
    if (!role[field]) throw new Error(`cv.yaml: experience[${index}].${field} is required`);
  }
  if (!Array.isArray(role.highlights) || !role.highlights.length) {
    throw new Error(`cv.yaml: experience[${index}].highlights must contain at least one item`);
  }
  if (role.logo) {
    const logoUrl = new URL(`../public/${role.logo.replace(/^\//, "")}`, import.meta.url);
    if (!fs.existsSync(logoUrl)) throw new Error(`cv.yaml: logo not found for ${role.company}: ${role.logo}`);
  }
});

console.log(`CV data valid: ${cv.experience.length} roles, ${cv.certifications.length} certifications.`);
