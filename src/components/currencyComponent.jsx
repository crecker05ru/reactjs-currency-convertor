import React from 'react'
import {useState,useEffect} from 'react'
import axios from "axios"
import XMLParser from 'react-xml-parser'
import currencyData from '../currency.xml'
import convert from 'xml-js'
// import { TextDecoder,TextEncoder} from 'web-encoding'

export default function CurrencyComponent () {
    const xhr = new XMLHttpRequest();
    var request = new XMLHttpRequest();
    // var headers = XMLHttpRequest.getAllResponseHeaders()
    request.open("GET", currencyData, false);
    const [currency,setCurrency] = useState()
    const [input,setInput] = useState(0)
    const [output,setOutput] = useState(0)
    const [selectedCurrency,setSelectedCurrency] = useState()
    const [russianRuble,setRussianRuble] = useState(0)
    const [calculated,setCalculated] = useState(0)
    const replaceComma = (str) => str.replace(/[^\d\.\-]/g, '.')
    const xml = currencyData
    const FETCH_URL = '/scripts/XML_daily.asp'
    const unblockCORS = 'https://cors-anywhere.herokuapp.com/'
    // let decoder = new TextDecoder("windows-1251")
    // let encoder = new TextEncoder("utf-8")
    console.log('currencyData',currencyData)
    console.log('xml',xml)
    console.log('currency',currency)
    console.log('input',input)
    console.log('output',output)
    console.log('calculated',calculated)
    // console.log('convert.xml2js(xml)',convert.xml2js(xml));

// function transformWindows1251ToUTF8(response) {
// const transformedBody = response.body
// // .pipeThrough(new TextDecoderStream("windows-1251"))
// // .pipeThrough(new TextEncoderStream("utf-8"));
// return new Response(transformedBody);
//         }


// let decoder = new TextDecoder("iso-8859-1");
let requestDecoded = () => {
 fetch(FETCH_URL)
.then(response => response.arrayBuffer())
.then(buffer => {
  let decoder = new TextDecoder("windows-1251");
  let text = decoder.decode(buffer);
  console.log('text',text);
  setCurrency(convert.xml2js(text,{compact:true}))
})  
} 


    useEffect(() =>{
        async function fetchData(){
            try{
                const response = await fetch(`${FETCH_URL}`,{
                    method:"GET",

                    credentials: 'include',
                    headers:{
                        "Content-Type": "application/xml; charset=windows-1251"}})
                // response.DOMParser().parseFromString("text/xml")
                response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                console.log('response',response)
                // let xml = new XMLParser().parseFromString(response)
                // console.log('xml',xml)
            }catch(e){
                console.log(e)
            }
    //     var self = this;
	// axios
	// .get("http://www.cbr.ru/scripts/XML_daily.asp", {
	// 	"Content-Type": "application/xml; charset=utf-8"
	//  })
	// .then(function(response) {
	// 	self.setState({ authors: response.data });
	// })
	// .catch(function(error) {
	// 	console.log(error);
	// });
}
        // fetchData()
    },[])

    const fetchCurrency = async () =>{
        await fetch(FETCH_URL,{
            // mode:'no-cors',
            credentials: 'include',
            headers: {
                // 'Content-Type': 'application/xml,charset=utf-8',
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'x-requested-with': 'XMLHttpRequest',
                
              },
        })
        .then((response)=> {
            console.log('fetch response',response)
            return response.text()
        })
        // .then(data => {
        //     // var xml = new XMLParser().parseFromString(data); 
        //     // console.log('data',data)
        //     // console.log('xml',xml)
        //     // localStorage.setItem('token', data.token)
        //     // console.log(data.token)
        //     console.log('data',data)
        //     setCurrency(data)
        // })
        .then(text => {
            console.log(text)
            console.log('convert.xml2js(response.data,{compact:true}',convert.xml2js(text,{compact:true}))
        })
        .catch(err => console.log(err))
    }

    const fetchWithAxios = () => {
        axios.get(FETCH_URL, {
            "Content-Type": "application/xml; charset=windows-1251"
         })
         .then((response) => {
            console.log('Axios response', response);
            console.log('response.data', response.data);

         });
    }

    const fetchLocalXMLHttp =() => {
        axios.get(currencyData, {
            "Content-Type": "application/xml; charset=windows-1251"
         })
         .then((response) => {
            console.log('Your xml file as string', response.data);
            console.log('convert.xml2js(response.data)',convert.xml2js(response.data,{compact:true}))
            setCurrency(convert.xml2js(response.data,{compact:true}))
         });
    }

    const fetchWithXMLHttpRequest = () => {
        if(request){
            request.open('GET', FETCH_URL, true);
            // request.onreadystatechange = handler;
            request.send();
        }
    }

    const outputCurrencyCalculation = (e) => {
        console.log('e',e)
        if(e.target.localName !== 'button'){
            setRussianRuble(e.target.value)
        }

        let inputValue = parseFloat(replaceComma(input))
        let outputValue = parseFloat(replaceComma(output))

        let inputOutputCoefficient = (inputValue  / outputValue) 
        let calculation = (russianRuble / inputValue ) * inputOutputCoefficient  
        console.log('inputOutputCoefficient',inputOutputCoefficient)
        console.log('(russianRuble / inputValue )',(russianRuble / inputValue ))
        console.log('calculation',calculation)
        setCalculated(calculation.toFixed(4))
    }

    return (
        <div>
            <h1>Currency convertor</h1>
            <button onClick={fetchCurrency}>Fetch currency</button>
            <button onClick={fetchWithAxios}>Fetch currency with Axios</button>
            <button onClick={fetchWithXMLHttpRequest}>Fetch currency with XMLHttpRequest</button>
            <button onClick={fetchLocalXMLHttp}>Fetch local currency with XMLHttpRequest</button>
            <button onClick={requestDecoded}>Fetch Decoded</button>
            <div>
                <label>Input currency</label>
                 <input value={input} onChange={e => setInput(e.target.value)}/>
            </div>
            <div>
                <label>Rubles amount</label>
                 <input value={russianRuble} onChange={e => outputCurrencyCalculation(e)}  name="rublesInput"/>
            </div>
            <div>
                <label>Output currency</label>
                 <input value={output} onChange={e => setOutput(e.target.value)}/>
            </div>
            <div>
            <button onClick={e => outputCurrencyCalculation(e)}>Calculate</button>
                <label>Converted calculation {calculated}</label>
                
                
            </div>
            <div>Select currency</div>
            <select name="input" onChange={e => setInput(e.target.value)}>
        
            <option disabled>Select input currency</option>
            { !currency ? <div></div>
            : currency.ValCurs.Valute.map((v, index) =>                          
                         <option name={v.CharCode._text} value={v.Value._text} key={index} >{v.CharCode._text} </option>       
                         
            )}
            </select>

            <select name="output" onChange={e => setOutput(e.target.value)}>
            <option disabled>Select output currency</option>
            { !currency ? <div></div>
            : currency.ValCurs.Valute.map((v, index) =>                          
                         <option name={v.CharCode._text} value={v.Value._text} key={index} >{v.CharCode._text}</option>        
            )}
            </select>

            <div>Curency List</div>
            { !currency ? <div></div>
            : currency.ValCurs.Valute.map((v, index) => 
                <div key={index}>
                    <div></div>
                    <div>Charcode {v.CharCode._text}</div> 
                    <div>Name {v.Name._text}</div> 
                    <div>Nominal {v.Nominal._text}</div> 
                    <div>NumCode {v.NumCode._text}</div> 
                    <div>Value {v.Value._text}</div> 
                </div>
                
            )}
        </div>
    )
}