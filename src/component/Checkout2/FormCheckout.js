import axios from 'axios';
import React, { useState } from 'react';
import Script from 'react-load-script';

let Omise;

function FormCheckout() {
  const [card, setCard] = useState({
    name: '',
    number: '',
    expiration_month: 0,
    expiration_year: 0,
    security_code: 0,
  });

  const handleScriptLoad = () => {
    console.log('Script is loaded');
    Omise = window.Omise;
    Omise.setPublicKey('pkey_test_5pdoxhl4p3erc27pgew');
  };

  const handleSubmitform = async (e) => {
    e.preventDefault();

    // Omise.createToken(
    //   'card',
    //   {
    //     ...card,
    //   },
    //   function (statusCode, response) {
    //     // response["id"] is token identifier

    //     console.log(statusCode);
    //     console.log(response);
    //   }
    // );

    Omise.createSource(
      'truemoney',
      {
        amount: '20000',
        currency: 'THB',
        phone_number: '0123456789',
      },
      async function (statusCode, response) {
        // response["id"] is token identifier

        console.log(statusCode);
        console.log(response);
        const res = await axios.post('http://localhost:8888/true-wallet', { source: response.id });
        console.log(res.data.charge);
        window.location.href = res.data.charge.authorize_uri;
      }
    );

    // Omise.createSource(
    //   'internet_banking_scb',
    //   {
    //     amount: 100000,
    //     currency: 'THB',
    //   },
    //   async function (statusCode, response) {
    //     // response["id"] is token identifier

    //     // console.log(statusCode);
    //     console.log(response.id);
    //     console.log(response);
    //     const res = await axios.post('http://localhost:8888/internet-banking', { sorce: response.id });
    //     // console.log(res.data.charge);
    //     // history.push(res.data.charge.authorize_uri);
    //     window.location.href = res.data.charge.authorize_uri;
    //     // console.log(res.data.charge.authorize_uri);
    //   }
    // );

    // try {
    //   let dataString =
    //     'card[name]=Somchai Prasert&card[city]=Bangkok&card[postal_code]=10320&card[number]=4242424242424242&card[security_code]=123&card[expiration_month]=12&card[expiration_year]=2022';

    //   let options = {
    //     url: 'https://vault.omise.co/tokens',
    //     method: 'POST',
    //     data: dataString,
    //     auth: {
    //       user: 'pkey_test_5pdoxhl4p3erc27pgew',
    //       pass: '',
    //     },
    //   };

    //   const res = await axios(options);

    //   console.log(res);
    // } catch (err) {
    //   console.dir(err);
    // }
  };

  return (
    <div>
      <Script url='https://cdn.omise.co/omise.js' onLoad={handleScriptLoad} />
      <form onSubmit={handleSubmitform}>
        <input type='text' value={card.name} onChange={(e) => setCard((cur) => ({ ...cur, name: e.target.value }))} />
        <input
          type='text'
          value={card.number}
          onChange={(e) => setCard((cur) => ({ ...cur, number: e.target.value }))}
          placeholder='number'
        />
        <input
          type='text'
          value={card.expiration_month}
          onChange={(e) => setCard((cur) => ({ ...cur, expiration_month: +e.target.value }))}
          placeholder='month'
        />
        <input
          type='text'
          value={card.expiration_year}
          onChange={(e) => setCard((cur) => ({ ...cur, expiration_year: +e.target.value }))}
          placeholder='year'
        />
        <input
          type='text'
          value={card.security_code}
          max='3'
          min='3'
          onChange={(e) => setCard((cur) => ({ ...cur, security_code: +e.target.value }))}
        />
        <button type='submit'>Check out</button>
      </form>
    </div>
  );
}

export default FormCheckout;
