import React from 'react';
import Script from 'react-load-script';
import axios from 'axios';

let OmiseCard;

function CreditCardForm() {
  const handleScriptLoad = () => {
    console.log('Script is loaded');
    OmiseCard = window.OmiseCard;
    OmiseCard.configure({
      publicKey: 'pkey_test_5pdoxhl4p3erc27pgew',
      currency: 'THB',
      frameLabel: 'Sabai Shop',
      submitLabel: 'PAY NOW',
      buttonLabel: 'Pay',
    });
  };

  const creditcardConfigure = () => {
    OmiseCard.configure({
      defaultPaymentMethod: 'credit_card',
      otherPaymentMethods: ['internet_banking', 'truemoney', 'rabbit_linepay'],
    });
    OmiseCard.configureButton('#credit_card');
    OmiseCard.attach();
  };

  const handleClickCredit = (e) => {
    e.preventDefault();
    creditcardConfigure();
    OmiseCard.open({
      amount: 10000,
      onCreateTokenSuccess: async (nonce) => {
        if (nonce.startsWith('tokn_')) {
          console.log(nonce);
          const res = await axios.post('http://localhost:8888/credit', { token: nonce, amount: 10000 });
          console.log(res.data.charge);
        } else {
          console.log(nonce);
          const res = await axios.post('http://localhost:8888/source', { source: nonce, amount: 10000 });
          console.log(res.data.charge);
          window.location.href = res.data.charge.authorize_uri;
        }
      },
      onFormClosed: () => {},
    });
  };

  return (
    <div>
      <Script url='https://cdn.omise.co/omise.js' onLoad={handleScriptLoad} />
      <form>
        <button id='credit_card' onClick={handleClickCredit}>
          Test
        </button>
      </form>
    </div>
  );
}

export default CreditCardForm;
