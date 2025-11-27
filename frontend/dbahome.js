function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    document.getElementById('clock').textContent = timeString;
}
updateClock();
setInterval(updateClock, 1000);

function clearlist() {
  document.getElementById('result-list').innerHTML = '';
  document.getElementById('menu-bar').style.display='block';
  document.getElementById('floating-btn').style.display='block';
}

function tableAttributes(tableName) {
  fetch('http://localhost:3000/table-attributes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableName })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('result-popup').style.display='block';
    document.getElementById('menu-bar').style.display='none';
    document.getElementById('floating-btn').style.display='none';
    const list = document.getElementById('result-list');
    data.forEach( () => {
      list.textContent = data.join(', ');
    });
  })
  .catch(err => alert('Failed to load Table Attributes:', err));
}

function fetchWholeTable(tableName) {
  tableAttributes(tableName);
  fetch('http://localhost:3000/fetchWholeTable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableName }),
  })
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('result-list');
    data.forEach(row => {
      const item = document.createElement('p');
      let rowText = '';
      for (let key in row) {
        rowText += `${row[key]}, `;
      }
      item.textContent = rowText;
      list.appendChild(item);
    });
  })
  .catch(err => alert(`Failed to load table ${tableName}`, err));
}

function fetchcustom() {
  const query = document.getElementById('customquery-query').value;
  fetch('http://localhost:3000/custom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
      checkboxstatus: document.getElementById('customquerycheckbox').checked
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('result-popup').style.display='block';
    document.getElementById('menu-bar').style.display='none';
    document.getElementById('floating-btn').style.display='none';
    document.getElementById('result-list').textContent = JSON.stringify(data, null, 2);
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => alert('Only SELECT queries are allowed for safety.'));
}


document.getElementById('aircraftform').addEventListener('submit', function (e) {
    e.preventDefault();

    const aircraftData = {
		aircraft_id: document.getElementById('aircraftid').value,
		model: document.getElementById('aircraftmodel').value,
		manufacturer: document.getElementById('aircraftmanufacturer').value,
		capacity: document.getElementById('aircraftcapacity').value,
		first_class_cap: document.getElementById('aircraftfirstclasscap').value,
		business_class_cap: document.getElementById('aircraftbusinessclasscap').value,
		premium_eco_class_cap: document.getElementById('aircraftpremiumecoclasscap').value,
		economy_class_cap: document.getElementById('aircrafteconomyclasscap').value,
    };

	if (Number(aircraftData.capacity) !== (Number(aircraftData.first_class_cap) + Number(aircraftData.business_class_cap) + Number(aircraftData.premium_eco_class_cap) + Number(aircraftData.economy_class_cap))) {
		return alert('Error in total capacity');
	}

    fetch('http://localhost:3000/append-aircraft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aircraftData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message)
        } else {
            alert('Error, check console for more details.');
        }
    })
    .catch(err => console.error('Insert failed:', err));
});

document.getElementById('flightform').addEventListener('submit', function (e) {
    e.preventDefault();

    const flightData = {
		flightid: document.getElementById('flightid').value,
		flightaircraftid: document.getElementById('flightaircraftid').value,
		flightorigin: document.getElementById('flightorigin').value,
		flightdestination: document.getElementById('flightdestination').value,
		flightdeparturedate: document.getElementById('flightdeparturedate').value,
		flightdeparturetime: document.getElementById('flightdeparturetime').value,
		flightfirstclassprice: document.getElementById('flightfirstclassprice').value,
    flightbusinessclassprice: document.getElementById('flightbusinessclassprice').value,
    flightpremiumecoclassprice: document.getElementById('flightpremiumecoclassprice').value,
    flighteconomyclassprice: document.getElementById('flighteconomyclassprice').value,
    };

    fetch('http://localhost:3000/append-flight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flightData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message)
        } else {
            alert('Error, check console for more details.');
        }
    })
    .catch(err => console.error('Insert failed:', err));
});

document.getElementById('airportform').addEventListener('submit', function (e) {
    e.preventDefault();

    const airportData = {
		airportid: document.getElementById('airportid').value,
		airportname: document.getElementById('airportname').value,
		airportcity: document.getElementById('airportcity').value,
		airportcountry: document.getElementById('airportcountry').value,
    };

    fetch('http://localhost:3000/append-airport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(airportData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message)
        } else {
            alert('Error, check console for more details.');
        }
    })
    .catch(err => console.error('Insert failed:', err));
});

document.getElementById('crewform').addEventListener('submit', function (e) {
    e.preventDefault();

    const crewData = {
		crewid: document.getElementById('crewid').value,
		crewfirstname: document.getElementById('crewfirstname').value,
		crewlastname: document.getElementById('crewlastname').value,
		crewrole: document.getElementById('crewrole').value,
    crewcontact: document.getElementById('crewcontact').value,
    };

    fetch('http://localhost:3000/append-crew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crewData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message)
        } else {
            alert('Error, check console for more details.');
        }
    })
    .catch(err => console.error('Insert failed:', err));
});

document.getElementById('pilotform').addEventListener('submit', function (e) {
    e.preventDefault();

    const pilotData = {
		pilotflightid: document.getElementById('pilotflightid').value,
		pilotcrewid: document.getElementById('pilotcrewid').value,
    };

    fetch('http://localhost:3000/append-pilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pilotData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message)
        } else {
            alert('Error, check console for more details.');
        }
    })
    .catch(err => console.error('Insert failed:', err));
});