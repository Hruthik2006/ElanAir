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

function disablePastDates(dateInput) {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById(dateInput).setAttribute('min', today);
}

window.onload = function () {
  disablePastDates('ticket-date');
};


document.getElementById('ticket-date').addEventListener('change', function (e) {
    e.preventDefault();

    const date = document.getElementById('ticket-date').value;
    fetch(`http://localhost:3000/ticket/date/${date}`)
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById('ticket-from');
        list.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.selected = true;
        placeholder.value = '';
        placeholder.textContent = '- - Journey From - -';
        list.appendChild(placeholder);
        data.forEach(origin => {
          const item = document.createElement('option');
          item.value = origin.origin;
          item.textContent = origin.origin;
          list.appendChild(item);
        });
    })
    .catch(err => console.error('Failed to fetch origin', err));

    const list1 = document.getElementById('ticket-to');
    list1.innerHTML = '';
    const placeholder1 = document.createElement('option');
    placeholder1.selected = true;
    placeholder1.value = '';
    placeholder1.textContent = '- - Journey To - -';
    list1.appendChild(placeholder1);

    const list2 = document.getElementById('ticket-time');
    list2.innerHTML = '';
    const placeholder2 = document.createElement('option');
    placeholder2.selected = true;
    placeholder2.value = '';
    placeholder2.textContent = '- - Journey start time - -';
    list2.appendChild(placeholder2);

	const list3 = document.getElementById('ticket-seat');
    list3.innerHTML = '';
    const placeholder3 = document.createElement('option');
    placeholder3.selected = true;
    placeholder3.value = '';
    placeholder3.textContent = '- - Seat No. - -';
    list3.appendChild(placeholder3);

	document.getElementById('ticket-class').selectedIndex = 0;

	document.getElementById('ticket-price').value = 'Price';
});

document.getElementById('ticket-from').addEventListener('change', function (e) {
    e.preventDefault();

    const origin = document.getElementById('ticket-from').value;
    const date = document.getElementById('ticket-date').value;
    fetch(`http://localhost:3000/ticket/origin/${origin}/date/${date}`)
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById('ticket-to');
        list.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.selected = true;
        placeholder.value = '';
        placeholder.textContent = '- - Journey To - -';
        list.appendChild(placeholder);
        data.forEach(destination => {
          const item = document.createElement('option');
          item.value = destination.destination;
          item.textContent = destination.destination;
          list.appendChild(item);
        });
    })
    .catch(err => console.error('Failed to fetch destination', err));
});

document.getElementById('ticket-to').addEventListener('change', function (e) {
    e.preventDefault();

    const origin = document.getElementById('ticket-from').value;
    const destination = document.getElementById('ticket-to').value;
    const date = document.getElementById('ticket-date').value;
    fetch(`http://localhost:3000/ticket/origin/${origin}/destination/${destination}/date/${date}`)
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById('ticket-time');
        list.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.selected = true;
        placeholder.value = '';
        placeholder.textContent = '- - Journey start time - -';
        list.appendChild(placeholder);
        data.forEach(time => {
          const item = document.createElement('option');
          item.value = time.departure;
          item.textContent = time.departure;
          list.appendChild(item);
        });
    })
    .catch(err => console.error('Failed to fetch journey start time', err));
});

document.getElementById('ticket-class').addEventListener('change', function (e) {
    e.preventDefault();

	const classtype = document.getElementById('ticket-class').value;
	if(classtype == 'economy') {
		min = 161;
		max = 250
		clearSeat();
		var list = document.getElementById('ticket-seat');
	} else if(classtype == 'premium_eco') {
		min = 91;
		max = 160;
		clearSeat();
		var list = document.getElementById('ticket-seat');
	} else if(classtype == 'business') {
		min = 41;
		max = 90;
		clearSeat();
		var list = document.getElementById('ticket-seat');
	} else if(classtype == 'first') {
		min = 1;
		max = 40;
		clearSeat();
		var list = document.getElementById('ticket-seat');
	} else {
		clearSeat();
	}

    for (let i = min; i <= max; i++) {
        const item = document.createElement('option');
        item.value = i;
        item.textContent = `${i}`;
        list.appendChild(item);
		document.getElementById('ticket-price').value = 'Price';
    }

	function clearSeat () {
		const list = document.getElementById('ticket-seat');
    	list.innerHTML = '';
    	const placeholder = document.createElement('option');
    	placeholder.selected = true;
    	placeholder.value = '';
    	placeholder.textContent = '- - Seat No. - -';
    	list.appendChild(placeholder);
	}
});

document.getElementById('ticket-seat').addEventListener('change', function (e) {
    e.preventDefault();

    const origin = document.getElementById('ticket-from').value;
    const destination = document.getElementById('ticket-to').value;
    const date = document.getElementById('ticket-date').value;
	const classtype = document.getElementById('ticket-class').value;
	var pricetype = ''
	if(classtype == 'economy') {
		pricetype = 'economy_class_price'
	} else if(classtype == 'premium_eco') {
		pricetype = 'premium_eco_class_price'
	} else if(classtype == 'business') {
		pricetype = 'business_class_price'
	} else if(classtype == 'first') {
		pricetype = 'first_class_price'
	} else {
		document.getElementById('ticket-price').value = 'Price';
	}

    fetch(`http://localhost:3000/ticket/origin/${origin}/destination/${destination}/date/${date}/pricetype/${pricetype}`)
    .then(res => res.json())
    .then(data => {
		data.forEach(row => {
			document.getElementById('ticket-price').value = row[pricetype];
		});
    })
    .catch(err => console.error('Failed to load price', err));
});

document.getElementById('ticket-form').addEventListener('submit', function (e) {
    e.preventDefault();

	const origin = document.getElementById('ticket-from').value;
    const destination = document.getElementById('ticket-to').value;
    const date = document.getElementById('ticket-date').value;
	fetch(`http://localhost:3000/ticket/origin/${origin}/destination/${destination}/date/${date}/flightid/`)
    .then(res => res.json())
    .then(data => {
		flight_id = data[0].flight_id;

		const bookingData = {
			bookingid : Number(flight_id + String(document.getElementById('ticket-aadhaar').value.slice(0,4) + String(document.getElementById('ticket-seat').value.padStart(3, '0')))),
			flightid: flight_id,
			aadhaar: document.getElementById('ticket-aadhaar').value,
			firstname: document.getElementById('ticket-firstname').value,
			lastname: document.getElementById('ticket-lastname').value,
			email: document.getElementById('ticket-email').value,
			contact: document.getElementById('ticket-contactnumber').value,
			classtype: document.getElementById('ticket-class').value,
			seat: document.getElementById('ticket-seat').value,
			price: document.getElementById('ticket-price').value,
    	};

		fetch('http://localhost:3000/booking', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(bookingData),
		})
		alert('Flight seat confirmed.\nTicket ID: '+ bookingData.bookingid + '\nThanks for choosing Élan Air & Happy Journey.');
    })
	.catch(err => console.error('failed to fetch flight_id', err));
});

document.getElementById('track-fetch').addEventListener('click', function (e) {
    e.preventDefault();

	const firstname = document.getElementById('track-firstname').value;
	const lastname = document.getElementById('track-lastname').value;
	const aadhaar = document.getElementById('track-aadhaar').value;
	const contact = document.getElementById('track-contactnumber').value;
	const email = document.getElementById('track-email').value;

	fetch(`http://localhost:3000/track/firstname/${firstname}/lastname/${lastname}/aadhaar/${aadhaar}/contact/${contact}/email/${email}/booking_id`)
	.then(res => res.json())
    .then(data => {
		const list = document.getElementById('track-bookingid');
    	list.innerHTML = '';
    	const placeholder = document.createElement('option');
    	placeholder.selected = true;
    	placeholder.value = '';
    	placeholder.textContent = '- - Select ticket ID - -';
    	list.appendChild(placeholder);
		data.forEach(trackid => {
			const item = document.createElement('option');
			item.value = String(trackid.booking_id).padStart(11, '0');
			item.textContent = String(trackid.booking_id).padStart(11, '0');
			list.appendChild(item);
        });
    })
	.catch(err => console.error('failed to fetch booking ids', err));
});

document.getElementById('track-form').addEventListener('submit', function (e) {
	e.preventDefault();

	const ticketid = document.getElementById('track-bookingid').value;

	document.getElementById('track-popup').style.display='none';

	fetch(`http://localhost:3000/track/booking_id/${ticketid}`)
	.then(res => res.json())
    .then(data => {
		const name = data[0].first_name + ' ' + data[0].last_name;
		const classtype = data[0].class;
		const seat = data[0].seat;
		const flightid = data[0].flight_id;

		fetch(`http://localhost:3000/flight/flight_id/${flightid}`)
		.then(res => res.json())
		.then(data => {
			const from = data[0].origin;
			const to = data[0].destination;
			const date = data[0].departure_date;
			const time = data[0].departure;
			const aircraftid = data[0].aircraft_id;

			fetch(`http://localhost:3000/aircraft/aircraft_id/${aircraftid}`)
			.then(res => res.json())
			.then(data => {
				const model = data[0].model;

				const rawDate = date;
				const datend = new Date(rawDate);
				const dd = String(datend.getDate()).padStart(2, '0');
				const mm = String(datend.getMonth() + 1).padStart(2, '0');
				const yyyy = datend.getFullYear();
				const formattedDate = `${dd}-${mm}-${yyyy}`;

				document.getElementById('journey-popup').style.display='block';
				document.getElementById('boarding-pass-name').textContent = name;
				document.getElementById('boarding-pass-flight').textContent = model;
				document.getElementById('boarding-pass-from').textContent = from;
				document.getElementById('boarding-pass-to').textContent = to;
				document.getElementById('boarding-pass-date').textContent = formattedDate;
				document.getElementById('boarding-pass-time').textContent = time;
				document.getElementById('boarding-pass-gate').textContent = 'Terminal-1/2C';
				document.getElementById('boarding-pass-seat').textContent = classtype + ' / ' + seat;

				const qrdetails = name + '\nTicket ID: ' + ticketid + '\nGate: ' + 'Terminal-1/2C' + '\nSeat no.: ' + classtype + '/' + seat;
				QRCode.toCanvas(document.getElementById('qrcode'), qrdetails, {scale: 2.5}, {
					color: {
					dark: '#FFF',
					light: '#0000' 
					}
					}, function (error) {
					if (error) console.error(error);
					console.log('QR code generated!');
				});
			})
			.catch(err => console.error('failed to fetch aircraft details', err))
		})
		.catch(err => console.error('failed to fetch flight details', err));
    })
	.catch(err => console.error('failed to fetch booking id\'s', err));
})