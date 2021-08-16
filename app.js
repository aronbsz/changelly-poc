var Changelly = require('./lib.js');

var changelly = new Changelly(
  'ApiKey',
  'ApiSecret'
);

async function listCurrencies(){
  changelly.getCurrencies(function(err, data) {
    if (err){
      console.log('Error!', err);
    } else {
      console.log('Available currencies:', data);
    }
  });
}

async function getMinAmount(from, to){
  changelly.getMinAmount('eth', 'btc', function(err, data) {
    if (err){
      console.log('Error!', err);
    } else {
      return data
    }
  });
}

async function getExchangeAmount(from, to, amount){
  changelly.getExchangeAmount(from, to, amount, function(err, data) {
    if (err){
      console.log('Error!', err);
    } else {
      return data
    }
  });
}

async function createTransaction(from, to, toAddress, amount){
  changelly.createTransaction(from, to, toAddress, amount, undefined, function(err, data) {
    if (err){
      console.log('Error!', err);
    } else {
      return data
    }
  });
  
}

async function getStatus(txId){
  changelly.getStatus(txId, function(err, data) {
    if (err){
      console.log('Error!', err);
    } else {
      return data
    }
  });
}

const finishedStatuses = ['finished', 'failed', 'refunded', 'expired']

async function exchange(){
  const from = process.env.FROM_CURRENCY
  const to = process.env.TO_CURRENCY
  const amount = process.env.AMOUNT

  const minAmount = await getMinAmount(from, to)

  if(minAmount && amount < minAmount){
    console.log(`Amount smaller than the minimum amount: ${amount} < ${minAmount}`)
    return
  }

  exchangeAmount = await getExchangeAmount(from, to, amount)

  console.log(`Exchanging ${amount} ${from} to ${exchangeAmount} ${to}`)

  const toAddress = process.env.TO_ADDRESS

  const transaction = await createTransaction(from, to, toAddress, amount)

  console.log(`Created transaction: ${transaction}`)

  const txId = transaction.id

  const status = await changelly.getStatus(txId)

  console.log(`Tx ${txId} status: ${status}`)

  do{
    const newStatus = await changelly.getStatus(txId)
    if(newStatus !== status){
      console.log(`Tx ${txId} status: ${status}`)
      status = newStatus
    }
  }while(finishedStatuses.indexOf(status) > -1)
}
listCurrencies();