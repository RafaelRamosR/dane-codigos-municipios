const fs = require('fs');
const path = require('path');
const dataSource = require('../resources/source_data.json');

const departmentObj = {};
let departmentQuery = 'INSERT INTO public.departamento(id, nombre, cod_dane) VALUES \n';
let municipalityQuery = 'INSERT INTO public.municipio(id, departamento_id, nombre, cod_dane) VALUES \n';

function getDepartmentId(searchCode) {
  const departmentCodes = Object.values(departmentObj);
  const departmentIndex = departmentCodes.findIndex((code) => code === searchCode);
  return departmentIndex + 1;
}

dataSource.forEach((e) => {
  departmentObj[e.departamento] = e.departamentoDANE;
});

Object.entries(departmentObj).forEach(([name, code], index) => {
  const id = index + 1;
  const separator = Object.keys(departmentObj).length === id ? ';' : ',';
  departmentQuery += `(${id}, "${name}", "${code}")${separator}\n`;
});

dataSource.forEach((e, index) => {
  const id = index + 1;
  const separator = dataSource.length === id ? ';' : ',';
  const departmentId = getDepartmentId(e.departamentoDANE);
  municipalityQuery += `(${id}, ${departmentId}, "${e.municipio}", "${e.municipioDANE}")${separator}\n`;
});

const outputPathDepartment = path.join(__dirname, '..', 'scripts', 'departamento_query.sql');
const outputPathMunicipality = path.join(__dirname, '..', 'scripts', 'municipio_query.sql');

fs.writeFileSync(outputPathDepartment, departmentQuery, 'utf8');
fs.writeFileSync(outputPathMunicipality, municipalityQuery, 'utf8');
