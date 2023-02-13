import fs from "fs";
import axios from "axios";
import {JSDOM} from "jsdom";
//import cron from "node-cron";

export class Parser_myFin {
    constructor(linkMyFin) {
        this.linkMyFin = linkMyFin
    }

    parserOfCurrency() {
        return axios.get(this.linkMyFin).then(response => {
            const dom = new JSDOM(response.data).window.document;
            const arrayOfBank = dom.getElementById('currency-table').lastChild.rows;
            const currenciesOfBanks = [];
            const currenciesOfTheBank = {
                nameOfBank: "",
                currency: [
                    {
                        USA: {
                            buy: '',
                            sale: ''
                        }

                    },
                    {
                        EUR: {
                            buy: '',
                            sale: ''
                        }
                    },
                    {
                        RUB: {
                            buy: '',
                            sale: ''
                        }
                    },
                ]
            };

            for (let i = 6; i < arrayOfBank.length - 1; i++) {
                if (i % 2 === 0) {
                    currenciesOfTheBank.nameOfBank = arrayOfBank[i].getElementsByTagName('a')[0].textContent;
                    currenciesOfTheBank.currency[0].USA.buy = arrayOfBank[i].getElementsByTagName('span')[1].textContent;
                    currenciesOfTheBank.currency[0].USA.sale = arrayOfBank[i].getElementsByTagName('span')[2].textContent;
                    currenciesOfTheBank.currency[1].EUR.buy = arrayOfBank[i].getElementsByTagName('span')[3].textContent;
                    currenciesOfTheBank.currency[1].EUR.sale = arrayOfBank[i].getElementsByTagName('span')[4].textContent;
                    currenciesOfTheBank.currency[2].RUB.buy = arrayOfBank[i].getElementsByTagName('span')[5].textContent;
                    currenciesOfTheBank.currency[2].RUB.sale = arrayOfBank[i].getElementsByTagName('span')[6].textContent;
                }

                currenciesOfBanks.push(currenciesOfTheBank);
            }

            fs.writeFile('currency.json', JSON.stringify(currenciesOfBanks), (err) => {
                if (err) throw err;
                console.log('File created');
            });
        })
    }

    getHeader() {
        return axios.get(this.linkMyFin)
            .then(response => {
                const dom = new JSDOM(response.data).window.document;
                dom.getElementsByTagName('h1').item(0).textContent
            })
    }
}

// function parserOfCurrency() {
//     return axios.get(linkMyFin).then(response => {
//         const parserPage = response.data;
//         const dom = new JSDOM(parserPage).window.document;
//         const header = dom.getElementsByTagName('h1').item(0).textContent;
//         const arrayOfBank = dom.getElementById('currency-table').lastChild.rows;
//         const currenciesOfBanks = [];
//         const currenciesOfTheBank = {
//             nameOfBank: "",
//             currency: [
//                 {
//                     USA: {
//                         buy: '',
//                         sale: ''
//                     }
//
//                 },
//                 {
//                     EUR: {
//                         buy: '',
//                         sale: ''
//                     }
//                 },
//                 {
//                     RUB: {
//                         buy: '',
//                         sale: ''
//                     }
//                 },
//             ]
//         };
//         console.log(header)
//         for (let i = 6; i < arrayOfBank.length - 1; i++) {
//             if (i % 2 === 0) {
//                 currenciesOfTheBank.nameOfBank = arrayOfBank[i].getElementsByTagName('a')[0].textContent;
//                 currenciesOfTheBank.currency[0].USA.buy = arrayOfBank[i].getElementsByTagName('span')[1].textContent;
//                 currenciesOfTheBank.currency[0].USA.sale = arrayOfBank[i].getElementsByTagName('span')[2].textContent;
//                 currenciesOfTheBank.currency[1].EUR.buy = arrayOfBank[i].getElementsByTagName('span')[3].textContent;
//                 currenciesOfTheBank.currency[1].EUR.sale = arrayOfBank[i].getElementsByTagName('span')[4].textContent;
//                 currenciesOfTheBank.currency[2].RUB.buy = arrayOfBank[i].getElementsByTagName('span')[5].textContent;
//                 currenciesOfTheBank.currency[2].RUB.sale = arrayOfBank[i].getElementsByTagName('span')[6].textContent;
//             }
//
//             currenciesOfBanks.push(currenciesOfTheBank);
//         }
//
//         fs.writeFile('currency.json', JSON.stringify(currenciesOfBanks), (err) => {
//             if(err) throw err;
//             console.log('File created');
//         });
//     })
// }
// cron.schedule('30 * * * 1-5', () => {
//     parserOfCurrency()
//         .then(() => console.log('good parsing'))
//         .catch((error) => console.log(error.message))
// });

// cron.schedule('30 * * * 1-5', () => {
//     parser.parserOfCurrency()
//     .then(() => console.log('good parsing'))
//     .catch((error) => console.log(error.message))
// });

// parserOfCurrency()
//     .then(() => console.log('good parsing'))
//     .catch((error) => console.log(error.message))

const parser = new Parser_myFin('https://myfin.by/currency/minsk')

await parser.parserOfCurrency()
    .then(() => console.log('good parsing'))
    .catch((error) => console.log(error.message))

const header = await parser.getHeader()
    .then(() => console.log('good parsing'))
    .catch((error) => console.log(error.message))

console.log(header)