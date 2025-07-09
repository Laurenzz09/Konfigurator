const MASTER_CODE = "texxeoKonfigurator"; // dein Zugangscode
const CODE_VALIDITY_HOURS = 24;

document.addEventListener('DOMContentLoaded', () => {
  const savedTimestamp = localStorage.getItem("zugangTimestamp");
  const isStillValid = checkCodeValidity(savedTimestamp);

  if (!isStillValid) {
    askForCode();
  }
});

function checkCodeValidity(timestamp) {
  if (!timestamp) return false;

  const now = new Date().getTime();
  const elapsed = now - parseInt(timestamp, 10);
  const maxAge = CODE_VALIDITY_HOURS * 60 * 60 * 1000; // in ms

  return elapsed < maxAge;
}

function askForCode() {
  Swal.fire({
    title: 'Zugangscode erforderlich',
    input: 'password',
    inputLabel: 'Bitte gib den Zugangscode ein',
    inputPlaceholder: 'Code hier eingeben',
    confirmButtonText: 'Einloggen',
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: true,
    preConfirm: (code) => {
      if (code !== MASTER_CODE) {
        Swal.showValidationMessage('❌ Falscher Code!');
      }
      return code === MASTER_CODE;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const now = new Date().getTime();
      localStorage.setItem("zugangTimestamp", now.toString());

      Swal.fire({
        icon: 'success',
        title: '✅ Zugang gewährt',
        showConfirmButton: false,
        timer: 1000
      });
    } else {
      askForCode(); // Erneut anzeigen, wenn abgebrochen
    }
  });
}