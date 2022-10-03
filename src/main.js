import "./styles/app.scss";

document.addEventListener('DOMContentLoaded', function () {
  /*значения из инпутов*/
  const priceAuto = document.getElementById('price-auto'),
    initialFee = document.getElementById('initial-fee'),
    deadline = document.getElementById('deadline');

  /*значения из range*/
  const priceAutoRange = document.getElementById('price-auto-range'),
    initialFeeRange = document.getElementById('initial-fee-range'),
    deadlineRange = document.getElementById('deadline-range');

  /*итоговые расчеты*/
  const totalPrice = document.getElementById('total-price'),
    monthPayment = document.getElementById('payment'),
    initFeeRub = document.getElementById('initial-fee-rub');

  /*Все range*/
  const inputsRange = document.querySelectorAll('.form__input_range');

  priceAutoRange.value = 3300000;
  initialFeeRange.value = 10;
  deadlineRange.value = 59;

  /*свзываем range с input*/
  const assignValue = () => {
    priceAuto.value = (priceAutoRange.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    initialFee.value = initialFeeRange.value;
    deadline.value = deadlineRange.value;
    calculation(Number((priceAutoRange.value).replace(/ /g,'')), initialFee.value, deadline.value);
  };

  assignValue();

  for (let input of inputsRange) {
    input.addEventListener('input', () => {
      assignValue();
      calculation(Number((priceAutoRange.value).replace(/ /g,'')), initialFee.value, deadline.value);
    });
  }

  function calculation(price, initialFeePrecent, term) {
    const firstPayment = Math.round((price / 100) * initialFeePrecent); //первоначальный взнос
    const monthlyPayment = Math.round(
      (price - firstPayment) *
        ((0.035 * Math.pow(1 + 0.035, term)) / (Math.pow(1 + 0.035, term) - 1)),
    );
    const totalPayment = Math.round(firstPayment + term * monthlyPayment); //сумма договора лизинга
    if (monthlyPayment < 0) {
      return false;
    } else {
      totalPrice.value = `${(totalPayment).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
      monthPayment.value = `${(monthlyPayment).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
      initFeeRub.value = `${(firstPayment).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
    }
  }

  const form = document.getElementById('form');
  form.addEventListener('submit', formSend);

  async function formSend(e) {
    e.preventDefault();

    const formData = new FormData(form);

    const formBtn = document.getElementById('form-btn');
    formBtn.disabled = true;

    let response = await fetch('https://eoj3r7f3r4ef6v4.m.pipedream.net', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData,
    }).catch((error) => {
      console.error('ERROR: ', error);
    });

    if (response.ok) {
      let result = await response.json();
      alert('Заявка выполнена. Ожидайте ответ');
      form.reset();
      formBtn.disabled = false;
    } else {
      alert('Извините, возникла ошибка');
    }
  }
});
