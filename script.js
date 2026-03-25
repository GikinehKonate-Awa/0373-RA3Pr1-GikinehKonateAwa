let alumnes = [];

const inputNom        = document.getElementById('nom');
const inputExamen     = document.getElementById('examen');
const inputPractiques = document.getElementById('practiques');
const inputActitud    = document.getElementById('actitud');
const cosTaula        = document.getElementById('cos-taula');

function validarFormulari() {
  let valid = true;

  ['nom', 'examen', 'practiques', 'actitud'].forEach(function (id) {
    document.getElementById(id).classList.remove('error');
    document.getElementById('err-' + id).style.display = 'none';
  });

  if (inputNom.value.trim() === '') {
    inputNom.classList.add('error');
    document.getElementById('err-nom').style.display = 'block';
    valid = false;
  }

  function validarNota(input, idError) {
    const num = parseFloat(input.value);
    if (input.value.trim() === '' || isNaN(num) || num < 0 || num > 10) {
      input.classList.add('error');
      document.getElementById(idError).style.display = 'block';
      return false;
    }
    return true;
  }

  if (!validarNota(inputExamen,     'err-examen'))     valid = false;
  if (!validarNota(inputPractiques, 'err-practiques')) valid = false;
  if (!validarNota(inputActitud,    'err-actitud'))    valid = false;

  return valid;
}

function calcularNotaFinal(examen, practiques, actitud) {
  return (examen * 0.6) + (practiques * 0.3) + (actitud * 0.1);
}

function afegirAlumne() {
  if (!validarFormulari()) return;

  const examen     = parseFloat(inputExamen.value);
  const practiques = parseFloat(inputPractiques.value);
  const actitud    = parseFloat(inputActitud.value);
  const notaFinal  = calcularNotaFinal(examen, practiques, actitud);

  alumnes.push({
    nom:        inputNom.value.trim(),
    examen,
    practiques,
    actitud,
    notaFinal,
  });

  inputNom.value        = '';
  inputExamen.value     = '';
  inputPractiques.value = '';
  inputActitud.value    = '';
  inputNom.focus();

  mostrarAlumnes();
}

function mostrarAlumnes() {
  cosTaula.innerHTML = '';

  if (alumnes.length === 0) {
    cosTaula.innerHTML = '<tr><td colspan="3" id="missatge-buit">Encara no hi ha alumnes.</td></tr>';
    return;
  }

  alumnes.forEach(function (alumne) {
    const aprovat = alumne.notaFinal >= 5;
    const estat   = aprovat ? 'Aprovat' : 'Suspès';
    const classe  = aprovat ? 'aprovat' : 'suspes';

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${alumne.nom}</td>
      <td class="nota">${alumne.notaFinal.toFixed(2)}</td>
      <td><span class="badge ${classe}">${estat}</span></td>
    `;
    cosTaula.appendChild(fila);
  });
}

function ordenarAlumnes(ordre) {
  alumnes.sort(function (a, b) {
    return ordre === 'desc'
      ? b.notaFinal - a.notaFinal
      : a.notaFinal - b.notaFinal;
  });
  mostrarAlumnes();
}

document.getElementById('btn-afegir').addEventListener('click', afegirAlumne);

[inputNom, inputExamen, inputPractiques, inputActitud].forEach(function (input) {
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') afegirAlumne();
  });
});